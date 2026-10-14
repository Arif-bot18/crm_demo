"use client";

import * as React from "react";
import {
  Lead,
  LeadActivity,
  FollowUpTask,
  FollowUpMethod,
  FollowUpTaskStatus,
  ManagedLeadSource,
  MarketingCampaign,
  SourcePerformanceMetric,
  CampaignPerformanceMetric,
  SourcesSummaryMetrics,
} from "@/types/crm";
import {
  INITIAL_DEMO_LEADS,
  INITIAL_DEMO_FOLLOW_UPS,
  INITIAL_DEMO_SOURCES,
  INITIAL_DEMO_CAMPAIGNS,
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

  // Sources & Campaigns state & actions
  sources: ManagedLeadSource[];
  campaigns: MarketingCampaign[];
  addSource: (
    sourceData: Omit<ManagedLeadSource, "id" | "createdAt">
  ) => { success: boolean; error?: string };
  updateSource: (
    id: string,
    updatedFields: Partial<ManagedLeadSource>
  ) => { success: boolean; error?: string };
  toggleSourceActive: (id: string) => { success: boolean; error?: string };
  addCampaign: (
    campaignData: Omit<MarketingCampaign, "id" | "createdAt">
  ) => { success: boolean; error?: string };
  updateCampaign: (
    id: string,
    updatedFields: Partial<MarketingCampaign>
  ) => { success: boolean; error?: string };
  deleteCampaign: (id: string) => { success: boolean; error?: string };
  sourceMetrics: SourcePerformanceMetric[];
  campaignMetrics: CampaignPerformanceMetric[];
  sourcesSummary: SourcesSummaryMetrics;

  resetToInitial: () => void;
}

const LeadsContext = React.createContext<LeadsContextType | undefined>(undefined);

export function LeadsProvider({ children }: { children: React.ReactNode }) {
  // In-memory state for demonstration leads. Clearly non-persistent across hard reloads.
  const [leads, setLeads] = React.useState<Lead[]>(INITIAL_DEMO_LEADS);
  const [followUpTasks, setFollowUpTasks] = React.useState<FollowUpTask[]>(
    INITIAL_DEMO_FOLLOW_UPS
  );
  const [sources, setSources] = React.useState<ManagedLeadSource[]>(
    INITIAL_DEMO_SOURCES
  );
  const [campaigns, setCampaigns] = React.useState<MarketingCampaign[]>(
    INITIAL_DEMO_CAMPAIGNS
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

  // --- Sources & Campaigns Actions ---

  const addSource = React.useCallback(
    (sourceData: Omit<ManagedLeadSource, "id" | "createdAt">) => {
      const trimmedName = sourceData.name.trim();
      if (!trimmedName) {
        return { success: false, error: "Source name is required." };
      }
      if (
        sources.some(
          (s) => s.name.toLowerCase() === trimmedName.toLowerCase()
        )
      ) {
        return {
          success: false,
          error: "A source with this name already exists in the system.",
        };
      }

      const idSlug = trimmedName.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
      const id = `SRC-${idSlug || Date.now()}`;
      const now = new Date();
      const createdAt = now.toISOString().split("T")[0];

      const newSource: ManagedLeadSource = {
        ...sourceData,
        id,
        name: trimmedName,
        createdAt,
      };

      setSources((prev) => [...prev, newSource]);
      return { success: true };
    },
    [sources]
  );

  const updateSource = React.useCallback(
    (id: string, updatedFields: Partial<ManagedLeadSource>) => {
      let prevName = "";
      const existing = sources.find((s) => s.id === id);
      if (existing) {
        prevName = existing.name;
      }

      if (updatedFields.name) {
        const trimmedName = updatedFields.name.trim();
        if (!trimmedName) {
          return { success: false, error: "Source name cannot be empty." };
        }
        const duplicate = sources.some(
          (s) =>
            s.id !== id &&
            s.name.toLowerCase() === trimmedName.toLowerCase()
        );
        if (duplicate) {
          return {
            success: false,
            error: "Another source with this name already exists.",
          };
        }
      }

      setSources((prev) =>
        prev.map((source) => {
          if (source.id !== id) return source;
          const updated = { ...source, ...updatedFields };
          if (updatedFields.name) {
            updated.name = updatedFields.name.trim();
          }
          return updated;
        })
      );

      // If source name changed, update denormalized sourceName on campaigns and leads
      if (updatedFields.name && prevName && updatedFields.name.trim() !== prevName) {
        const newName = updatedFields.name.trim();
        setCampaigns((prev) =>
          prev.map((c) => (c.sourceId === id ? { ...c, sourceName: newName } : c))
        );
        setLeads((prev) =>
          prev.map((l) =>
            l.source.toLowerCase() === prevName.toLowerCase()
              ? { ...l, source: newName, sourceBadgeVariant: getSourceBadgeVariant(newName) }
              : l
          )
        );
      }

      return { success: true };
    },
    [sources]
  );

  const toggleSourceActive = React.useCallback((id: string) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
    return { success: true };
  }, []);

  const addCampaign = React.useCallback(
    (campaignData: Omit<MarketingCampaign, "id" | "createdAt">) => {
      const trimmedName = campaignData.name.trim();
      if (!trimmedName) {
        return { success: false, error: "Campaign name is required." };
      }
      if (
        campaigns.some(
          (c) => c.name.toLowerCase() === trimmedName.toLowerCase()
        )
      ) {
        return {
          success: false,
          error: "A campaign with this name already exists in the system.",
        };
      }

      const maxNum = campaigns.reduce((max, c) => {
        const num = parseInt(c.id.replace("CAMP-", ""), 10);
        return isNaN(num) ? max : Math.max(max, num);
      }, 100);

      const nextId = `CAMP-${maxNum + 1}`;
      const now = new Date();
      const createdAt = now.toISOString().split("T")[0];

      // Match source name from sources
      const matchedSource = sources.find((s) => s.id === campaignData.sourceId);
      const sourceName = matchedSource
        ? matchedSource.name
        : campaignData.sourceName || "Other";

      const newCampaign: MarketingCampaign = {
        ...campaignData,
        id: nextId,
        name: trimmedName,
        sourceName,
        budget: Math.max(0, Number(campaignData.budget) || 0),
        createdAt,
      };

      setCampaigns((prev) => [newCampaign, ...prev]);
      return { success: true };
    },
    [campaigns, sources]
  );

  const updateCampaign = React.useCallback(
    (id: string, updatedFields: Partial<MarketingCampaign>) => {
      if (updatedFields.name) {
        const trimmedName = updatedFields.name.trim();
        if (!trimmedName) {
          return { success: false, error: "Campaign name cannot be empty." };
        }
        const duplicate = campaigns.some(
          (c) =>
            c.id !== id &&
            c.name.toLowerCase() === trimmedName.toLowerCase()
        );
        if (duplicate) {
          return {
            success: false,
            error: "Another campaign with this name already exists.",
          };
        }
      }

      setCampaigns((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          let sourceName = c.sourceName;
          if (updatedFields.sourceId && updatedFields.sourceId !== c.sourceId) {
            const matched = sources.find((s) => s.id === updatedFields.sourceId);
            if (matched) sourceName = matched.name;
          }
          return {
            ...c,
            ...updatedFields,
            sourceName,
            name: updatedFields.name ? updatedFields.name.trim() : c.name,
            budget:
              updatedFields.budget !== undefined
                ? Math.max(0, Number(updatedFields.budget) || 0)
                : c.budget,
          };
        })
      );

      return { success: true };
    },
    [campaigns, sources]
  );

  const deleteCampaign = React.useCallback((id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    return { success: true };
  }, []);

  const resetToInitial = React.useCallback(() => {
    setLeads(INITIAL_DEMO_LEADS);
    setFollowUpTasks(INITIAL_DEMO_FOLLOW_UPS);
    setSources(INITIAL_DEMO_SOURCES);
    setCampaigns(INITIAL_DEMO_CAMPAIGNS);
  }, []);

  // Channel-wise performance metrics computed dynamically from leads
  const sourceMetrics = React.useMemo<SourcePerformanceMetric[]>(() => {
    return sources.map((source) => {
      const sNameLower = source.name.toLowerCase();
      const matchedLeads = leads.filter(
        (l) => l.source && l.source.toLowerCase() === sNameLower
      );
      const enrolledCount = matchedLeads.filter(
        (l) => l.stage === "Enrolled"
      ).length;
      const conversionRate =
        matchedLeads.length > 0
          ? Math.round((enrolledCount / matchedLeads.length) * 1000) / 10
          : 0;
      const activeCampaignsCount = campaigns.filter(
        (c) => c.sourceId === source.id && c.status === "Active"
      ).length;

      return {
        sourceId: source.id,
        sourceName: source.name,
        category: source.category,
        badgeVariant: source.badgeVariant,
        isActive: source.isActive,
        totalLeads: matchedLeads.length,
        enrolledCount,
        conversionRate,
        activeCampaignsCount,
      };
    });
  }, [sources, leads, campaigns]);

  // Campaign performance metrics computed dynamically from leads
  const campaignMetrics = React.useMemo<CampaignPerformanceMetric[]>(() => {
    return campaigns.map((campaign) => {
      const cNameLower = campaign.name.toLowerCase();
      const matchedLeads = leads.filter((l) => {
        if (l.campaignId && l.campaignId === campaign.id) return true;
        if (l.campaignName && l.campaignName.toLowerCase() === cNameLower)
          return true;
        return false;
      });

      const enrolledCount = matchedLeads.filter(
        (l) => l.stage === "Enrolled"
      ).length;
      const conversionRate =
        matchedLeads.length > 0
          ? Math.round((enrolledCount / matchedLeads.length) * 1000) / 10
          : 0;
      const costPerLead =
        matchedLeads.length > 0
          ? Math.round(campaign.budget / matchedLeads.length)
          : null;

      return {
        campaignId: campaign.id,
        campaignName: campaign.name,
        sourceId: campaign.sourceId,
        sourceName: campaign.sourceName,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        budget: campaign.budget,
        status: campaign.status,
        totalLeads: matchedLeads.length,
        enrolledCount,
        conversionRate,
        costPerLead,
      };
    });
  }, [campaigns, leads]);

  // High-level Sources & Campaigns summary metrics
  const sourcesSummary = React.useMemo<SourcesSummaryMetrics>(() => {
    const totalSources = sources.length;
    const activeSources = sources.filter((s) => s.isActive).length;
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter((c) => c.status === "Active").length;
    const attributedLeads = leads.filter((l) => Boolean(l.source)).length;
    const enrolledAdmissions = leads.filter(
      (l) => l.stage === "Enrolled"
    ).length;
    const totalBudget = campaigns
      .filter((c) => c.status === "Active")
      .reduce((sum, c) => sum + (c.budget || 0), 0);
    const avgConversionRate =
      leads.length > 0
        ? Math.round((enrolledAdmissions / leads.length) * 1000) / 10
        : 0;

    return {
      totalSources,
      activeSources,
      totalCampaigns,
      activeCampaigns,
      attributedLeads,
      enrolledAdmissions,
      totalBudget,
      avgConversionRate,
    };
  }, [sources, campaigns, leads]);

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

        sources,
        campaigns,
        addSource,
        updateSource,
        toggleSourceActive,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        sourceMetrics,
        campaignMetrics,
        sourcesSummary,

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
