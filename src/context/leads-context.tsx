"use client";

import * as React from "react";
import {
  Lead,
  LeadActivity,
  FollowUpTask,
  FollowUpMethod,
  FollowUpTaskStatus,
} from "@/types/crm";
import {
  INITIAL_DEMO_LEADS,
  INITIAL_DEMO_FOLLOW_UPS,
  getSourceBadgeVariant,
  getStageBadgeVariant,
  normalizePhoneNumber,
  formatIndianPhoneNumber,
} from "@/lib/demo-data";
import {
  isToday,
  isOverdue,
  isUpcoming,
  formatFollowUpDate,
  parseDate,
} from "@/lib/date-utils";

export interface PipelineSummaryMetrics {
  totalActive: number;
  inCounselling: number;
  feesDiscussed: number;
  enrolled: number;
}

export interface FollowUpSummaryMetrics {
  today: number;
  overdue: number;
  upcoming: number;
  completed: number;
}

interface LeadsContextType {
  leads: Lead[];
  addLead: (
    newLeadData: Omit<
      Lead,
      "id" | "createdAt" | "sourceBadgeVariant" | "stageBadgeVariant"
    >
  ) => { success: boolean; error?: string };
  updateLead: (
    id: string,
    updatedFields: Partial<Lead>
  ) => { success: boolean; error?: string };
  updateLeadStage: (
    id: string,
    newStage: string
  ) => { success: boolean; error?: string };
  deleteLead: (id: string) => { success: boolean; error?: string };
  isPhoneDuplicate: (phone: string, excludeId?: string) => boolean;
  summary: {
    totalLeads: number;
    newLeads: number;
    interestedLeads: number;
    enrolledStudents: number;
  };
  pipelineSummary: PipelineSummaryMetrics;

  // Follow-ups & Reminders state & actions
  followUpTasks: FollowUpTask[];
  addFollowUpTask: (
    taskData: Omit<FollowUpTask, "id" | "createdAt" | "status">
  ) => { success: boolean; error?: string };
  rescheduleFollowUpTask: (
    id: string,
    newScheduledAt: string,
    method?: FollowUpMethod,
    notes?: string
  ) => { success: boolean; error?: string };
  completeFollowUpTask: (
    id: string,
    completionNotes?: string
  ) => { success: boolean; error?: string };
  cancelFollowUpTask: (
    id: string,
    cancelReason?: string
  ) => { success: boolean; error?: string };
  followUpSummary: FollowUpSummaryMetrics;

  resetToInitial: () => void;
}

const LeadsContext = React.createContext<LeadsContextType | undefined>(undefined);

export function LeadsProvider({ children }: { children: React.ReactNode }) {
  // In-memory state for demonstration leads. Clearly non-persistent across hard reloads.
  const [leads, setLeads] = React.useState<Lead[]>(INITIAL_DEMO_LEADS);
  const [followUpTasks, setFollowUpTasks] = React.useState<FollowUpTask[]>(
    INITIAL_DEMO_FOLLOW_UPS
  );

  const isPhoneDuplicate = React.useCallback(
    (phone: string, excludeId?: string) => {
      const normalizedTarget = normalizePhoneNumber(phone);
      if (!normalizedTarget) return false;

      return leads.some((lead) => {
        if (excludeId && lead.id === excludeId) return false;
        return normalizePhoneNumber(lead.phone) === normalizedTarget;
      });
    },
    [leads]
  );

  /**
   * Re-synchronizes a lead's nextFollowUp and isOverdue based on earliest pending task
   */
  const syncLeadNextFollowUp = React.useCallback(
    (leadId: string, currentTasks: FollowUpTask[]) => {
      // Find all pending tasks for this lead
      const pendingTasks = currentTasks.filter(
        (t) => t.leadId === leadId && t.status === "Pending"
      );

      setLeads((prevLeads) =>
        prevLeads.map((lead) => {
          if (lead.id !== leadId) return lead;

          if (pendingTasks.length === 0) {
            return {
              ...lead,
              nextFollowUp: "No Follow-up Scheduled",
              nextFollowUpAt: undefined,
              isOverdue: false,
            };
          }

          // Sort ascending by scheduled timestamp to find the earliest
          const sorted = [...pendingTasks].sort((a, b) => {
            const timeA = new Date(a.scheduledAt).getTime();
            const timeB = new Date(b.scheduledAt).getTime();
            return timeA - timeB;
          });

          const earliest = sorted[0];
          const overdue = isOverdue(earliest.scheduledAt);

          return {
            ...lead,
            nextFollowUp: formatFollowUpDate(earliest.scheduledAt),
            nextFollowUpAt: earliest.scheduledAt,
            isOverdue: overdue,
          };
        })
      );
    },
    []
  );

  const addLead = React.useCallback(
    (
      newLeadData: Omit<
        Lead,
        "id" | "createdAt" | "sourceBadgeVariant" | "stageBadgeVariant"
      >
    ) => {
      if (isPhoneDuplicate(newLeadData.phone)) {
        return {
          success: false,
          error: "A lead with this phone number already exists in the system.",
        };
      }

      const maxIdNum = leads.reduce((max, l) => {
        const num = parseInt(l.id.replace("LEAD-", ""), 10);
        return isNaN(num) ? max : Math.max(max, num);
      }, 100);

      const nextId = `LEAD-${maxIdNum + 1}`;
      const now = new Date();
      const formattedTimestamp = now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

      const initialActivity: LeadActivity = {
        id: `ACT-${Date.now()}`,
        type: "created",
        description: `Lead created manually via CRM by ${newLeadData.counselor}`,
        counselor: newLeadData.counselor,
        timestamp: formattedTimestamp,
        note: newLeadData.notes,
      };

      const newRecord: Lead = {
        ...newLeadData,
        id: nextId,
        phone: formatIndianPhoneNumber(newLeadData.phone),
        sourceBadgeVariant: getSourceBadgeVariant(newLeadData.source),
        stageBadgeVariant: getStageBadgeVariant(newLeadData.stage),
        createdAt: formattedTimestamp,
        activities: [initialActivity],
      };

      setLeads((prev) => [newRecord, ...prev]);

      return { success: true };
    },
    [leads, isPhoneDuplicate]
  );

  const updateLead = React.useCallback(
    (id: string, updatedFields: Partial<Lead>) => {
      if (updatedFields.phone && isPhoneDuplicate(updatedFields.phone, id)) {
        return {
          success: false,
          error: "Another lead already exists with this phone number.",
        };
      }

      setLeads((prev) =>
        prev.map((lead) => {
          if (lead.id !== id) return lead;

          const updatedSource = updatedFields.source ?? lead.source;
          const updatedStage = updatedFields.stage ?? lead.stage;
          const now = new Date();
          const timestamp = now.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });

          const newActivities = [...(lead.activities || [])];
          if (updatedFields.stage && updatedFields.stage !== lead.stage) {
            newActivities.push({
              id: `ACT-${Date.now()}`,
              type: "stage_change",
              description: `Pipeline stage moved from "${lead.stage}" to "${updatedFields.stage}"`,
              counselor: updatedFields.counselor || lead.counselor,
              timestamp,
            });
          }

          return {
            ...lead,
            ...updatedFields,
            phone: updatedFields.phone
              ? formatIndianPhoneNumber(updatedFields.phone)
              : lead.phone,
            sourceBadgeVariant: getSourceBadgeVariant(updatedSource),
            stageBadgeVariant: getStageBadgeVariant(updatedStage),
            updatedAt: timestamp,
            activities: newActivities,
          };
        })
      );

      return { success: true };
    },
    [isPhoneDuplicate]
  );

  const updateLeadStage = React.useCallback(
    (id: string, newStage: string) => {
      return updateLead(id, { stage: newStage });
    },
    [updateLead]
  );

  const deleteLead = React.useCallback((id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    // Also remove associated follow-up tasks
    setFollowUpTasks((prev) => prev.filter((t) => t.leadId !== id));
    return { success: true };
  }, []);

  // --- Follow-up Actions ---

  const addFollowUpTask = React.useCallback(
    (taskData: Omit<FollowUpTask, "id" | "createdAt" | "status">) => {
      const maxIdNum = followUpTasks.reduce((max, t) => {
        const num = parseInt(t.id.replace("TASK-", ""), 10);
        return isNaN(num) ? max : Math.max(max, num);
      }, 200);

      const nextId = `TASK-${maxIdNum + 1}`;
      const now = new Date();

      const newTask: FollowUpTask = {
        ...taskData,
        id: nextId,
        status: "Pending",
        createdAt: now.toISOString(),
      };

      const updatedTasks = [newTask, ...followUpTasks];
      setFollowUpTasks(updatedTasks);

      // Re-sync earliest next follow-up for this lead
      syncLeadNextFollowUp(taskData.leadId, updatedTasks);

      return { success: true };
    },
    [followUpTasks, syncLeadNextFollowUp]
  );

  const rescheduleFollowUpTask = React.useCallback(
    (
      id: string,
      newScheduledAt: string,
      method?: FollowUpMethod,
      notes?: string
    ) => {
      let targetLeadId: string | null = null;

      const updatedTasks = followUpTasks.map((task) => {
        if (task.id !== id) return task;
        targetLeadId = task.leadId;

        return {
          ...task,
          scheduledAt: newScheduledAt,
          method: method || task.method,
          notes: notes !== undefined ? notes : task.notes,
          status: "Pending" as FollowUpTaskStatus,
        };
      });

      setFollowUpTasks(updatedTasks);

      if (targetLeadId) {
        syncLeadNextFollowUp(targetLeadId, updatedTasks);
      }

      return { success: true };
    },
    [followUpTasks, syncLeadNextFollowUp]
  );

  const completeFollowUpTask = React.useCallback(
    (id: string, completionNotes?: string) => {
      let targetLeadId: string | null = null;
      let targetTask: FollowUpTask | null = null;
      const now = new Date();

      const updatedTasks = followUpTasks.map((task) => {
        if (task.id !== id) return task;
        targetLeadId = task.leadId;
        targetTask = task;

        return {
          ...task,
          status: "Completed" as FollowUpTaskStatus,
          completedAt: now.toISOString(),
          completionNotes: completionNotes || task.notes,
        };
      });

      setFollowUpTasks(updatedTasks);

      // Add activity entry to the lead record
      if (targetLeadId && targetTask) {
        const taskObj = targetTask as FollowUpTask;
        const formattedTimestamp = now.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });

        setLeads((prevLeads) =>
          prevLeads.map((lead) => {
            if (lead.id !== targetLeadId) return lead;
            const newActivities = [...(lead.activities || [])];
            newActivities.push({
              id: `ACT-${Date.now()}`,
              type: "call",
              description: `Follow-up completed via ${taskObj.method}`,
              counselor: taskObj.assignedCounsellor,
              timestamp: formattedTimestamp,
              note: completionNotes || taskObj.notes,
            });
            return {
              ...lead,
              activities: newActivities,
              lastContactedAt: formattedTimestamp,
            };
          })
        );

        // Re-sync remaining pending follow-ups for this lead
        syncLeadNextFollowUp(targetLeadId, updatedTasks);
      }

      return { success: true };
    },
    [followUpTasks, syncLeadNextFollowUp]
  );

  const cancelFollowUpTask = React.useCallback(
    (id: string, cancelReason?: string) => {
      let targetLeadId: string | null = null;

      const updatedTasks = followUpTasks.map((task) => {
        if (task.id !== id) return task;
        targetLeadId = task.leadId;

        return {
          ...task,
          status: "Cancelled" as FollowUpTaskStatus,
          notes: cancelReason
            ? `${task.notes ? task.notes + " | " : ""}Cancellation: ${cancelReason}`
            : task.notes,
        };
      });

      setFollowUpTasks(updatedTasks);

      if (targetLeadId) {
        syncLeadNextFollowUp(targetLeadId, updatedTasks);
      }

      return { success: true };
    },
    [followUpTasks, syncLeadNextFollowUp]
  );

  const resetToInitial = React.useCallback(() => {
    setLeads(INITIAL_DEMO_LEADS);
    setFollowUpTasks(INITIAL_DEMO_FOLLOW_UPS);
  }, []);

  // Summary counts for All Leads
  const summary = React.useMemo(() => {
    const totalLeads = leads.length;
    const newLeads = leads.filter((l) => l.stage === "New Lead").length;
    const interestedLeads = leads.filter(
      (l) =>
        l.stage === "Interested" ||
        l.stage === "Counselling" ||
        l.stage === "Fees Discussed"
    ).length;
    const enrolledStudents = leads.filter((l) => l.stage === "Enrolled").length;

    return {
      totalLeads,
      newLeads,
      interestedLeads,
      enrolledStudents,
    };
  }, [leads]);

  // Summary counts for Pipeline
  const pipelineSummary = React.useMemo<PipelineSummaryMetrics>(() => {
    const totalActive = leads.filter((l) => l.stage !== "Lost").length;
    const inCounselling = leads.filter((l) => l.stage === "Counselling").length;
    const feesDiscussed = leads.filter((l) => l.stage === "Fees Discussed").length;
    const enrolled = leads.filter((l) => l.stage === "Enrolled").length;

    return {
      totalActive,
      inCounselling,
      feesDiscussed,
      enrolled,
    };
  }, [leads]);

  // Follow-up Summary counts (strictly derived from followUpTasks and local timestamps)
  const followUpSummary = React.useMemo<FollowUpSummaryMetrics>(() => {
    const pendingTasks = followUpTasks.filter((t) => t.status === "Pending");
    const completedTasks = followUpTasks.filter((t) => t.status === "Completed");

    const todayCount = pendingTasks.filter((t) => isToday(t.scheduledAt)).length;
    const overdueCount = pendingTasks.filter((t) => isOverdue(t.scheduledAt)).length;
    const upcomingCount = pendingTasks.filter((t) => isUpcoming(t.scheduledAt)).length;

    return {
      today: todayCount,
      overdue: overdueCount,
      upcoming: upcomingCount,
      completed: completedTasks.length,
    };
  }, [followUpTasks]);

  return (
    <LeadsContext.Provider
      value={{
        leads,
        addLead,
        updateLead,
        updateLeadStage,
        deleteLead,
        isPhoneDuplicate,
        summary,
        pipelineSummary,

        followUpTasks,
        addFollowUpTask,
        rescheduleFollowUpTask,
        completeFollowUpTask,
        cancelFollowUpTask,
        followUpSummary,

        resetToInitial,
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const context = React.useContext(LeadsContext);
  if (!context) {
    throw new Error("useLeads must be used within a LeadsProvider");
  }
  return context;
}
