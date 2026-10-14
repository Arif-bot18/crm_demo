"use client";

import * as React from "react";
import { Lead, LeadActivity } from "@/types/crm";
import {
  INITIAL_DEMO_LEADS,
  getSourceBadgeVariant,
  getStageBadgeVariant,
  normalizePhoneNumber,
  formatIndianPhoneNumber,
} from "@/lib/demo-data";

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
  deleteLead: (id: string) => { success: boolean; error?: string };
  isPhoneDuplicate: (phone: string, excludeId?: string) => boolean;
  summary: {
    totalLeads: number;
    newLeads: number;
    interestedLeads: number;
    enrolledStudents: number;
  };
  resetToInitial: () => void;
}

const LeadsContext = React.createContext<LeadsContextType | undefined>(undefined);

export function LeadsProvider({ children }: { children: React.ReactNode }) {
  // In-memory state for demonstration leads. Clearly non-persistent across hard reloads.
  const [leads, setLeads] = React.useState<Lead[]>(INITIAL_DEMO_LEADS);

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

  const addLead = React.useCallback(
    (
      newLeadData: Omit<
        Lead,
        "id" | "createdAt" | "sourceBadgeVariant" | "stageBadgeVariant"
      >
    ) => {
      // Check phone uniqueness
      if (isPhoneDuplicate(newLeadData.phone)) {
        return {
          success: false,
          error: "A lead with this phone number already exists in the system.",
        };
      }

      // Generate next readable ID, e.g. LEAD-108
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
      // Check phone uniqueness if phone is updated
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

  const deleteLead = React.useCallback((id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    return { success: true };
  }, []);

  const resetToInitial = React.useCallback(() => {
    setLeads(INITIAL_DEMO_LEADS);
  }, []);

  // Calculate dynamic metrics from loaded demonstration dataset
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

  return (
    <LeadsContext.Provider
      value={{
        leads,
        addLead,
        updateLead,
        deleteLead,
        isPhoneDuplicate,
        summary,
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
