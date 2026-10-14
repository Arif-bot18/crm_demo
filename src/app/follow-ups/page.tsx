"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";
import { Lead, FollowUpTask } from "@/types/crm";
import { PageContainer } from "@/components/ui/page-header";
import { useLeads } from "@/context/leads-context";
import { FollowUpSummaryCards } from "@/components/follow-ups/follow-up-summary-cards";
import { FollowUpHeader } from "@/components/follow-ups/follow-up-header";
import {
  FollowUpFilters,
  FollowUpFilterState,
} from "@/components/follow-ups/follow-up-filters";
import { FollowUpTable } from "@/components/follow-ups/follow-up-table";
import { ScheduleFollowUpModal } from "@/components/follow-ups/schedule-follow-up-modal";
import { RescheduleFollowUpModal } from "@/components/follow-ups/reschedule-follow-up-modal";
import { CompleteFollowUpModal } from "@/components/follow-ups/complete-follow-up-modal";
import { CancelFollowUpModal } from "@/components/follow-ups/cancel-follow-up-modal";
import { LeadDetailsModal } from "@/components/leads/lead-details-modal";
import { normalizePhoneNumber } from "@/lib/demo-data";
import { isToday, isOverdue, isUpcoming } from "@/lib/date-utils";

export default function FollowUpsPage() {
  const router = useRouter();
  const {
    leads,
    followUpTasks,
    followUpSummary,
    addFollowUpTask,
    rescheduleFollowUpTask,
    completeFollowUpTask,
    cancelFollowUpTask,
  } = useLeads();

  // Filters State
  const [filters, setFilters] = React.useState<FollowUpFilterState>({
    searchQuery: "",
    dateFilter: "All",
    method: "",
    status: "",
    counselor: "",
  });

  // Modal States
  const [isScheduleOpen, setIsScheduleOpen] = React.useState(false);

  const [taskToReschedule, setTaskToReschedule] = React.useState<FollowUpTask | null>(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = React.useState(false);

  const [taskToComplete, setTaskToComplete] = React.useState<FollowUpTask | null>(null);
  const [isCompleteOpen, setIsCompleteOpen] = React.useState(false);

  const [taskToCancel, setTaskToCancel] = React.useState<FollowUpTask | null>(null);
  const [isCancelOpen, setIsCancelOpen] = React.useState(false);

  const [selectedLeadForDetails, setSelectedLeadForDetails] = React.useState<Lead | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

  // Success alert state
  const [notification, setNotification] = React.useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Filter computation
  const filteredTasks = React.useMemo(() => {
    return followUpTasks.filter((task) => {
      const lead = leads.find((l) => l.id === task.leadId);

      // 1. Search across student name, phone, lead ID, task ID
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const normQ = normalizePhoneNumber(q);
        const normLeadPhone = lead ? normalizePhoneNumber(lead.phone) : "";

        const matchName = Boolean(lead?.studentName.toLowerCase().includes(q));
        const matchId =
          task.leadId.toLowerCase().includes(q) ||
          task.id.toLowerCase().includes(q);
        const matchPhone = Boolean(
          lead?.phone.toLowerCase().includes(q) ||
            (normQ.length > 2 && normLeadPhone.includes(normQ))
        );

        if (!matchName && !matchId && !matchPhone) {
          return false;
        }
      }

      // 2. Date / Timing Filter
      if (filters.dateFilter !== "All") {
        if (filters.dateFilter === "Today") {
          if (!isToday(task.scheduledAt) || task.status !== "Pending") {
            return false;
          }
        } else if (filters.dateFilter === "Overdue") {
          if (!isOverdue(task.scheduledAt) || task.status !== "Pending") {
            return false;
          }
        } else if (filters.dateFilter === "Upcoming") {
          if (!isUpcoming(task.scheduledAt) || task.status !== "Pending") {
            return false;
          }
        }
      }

      // 3. Method Filter
      if (filters.method && task.method !== filters.method) {
        return false;
      }

      // 4. Status Filter
      if (filters.status && task.status !== filters.status) {
        return false;
      }

      // 5. Counselor Filter
      if (filters.counselor && task.assignedCounsellor !== filters.counselor) {
        return false;
      }

      return true;
    });
  }, [followUpTasks, leads, filters]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      dateFilter: "All",
      method: "",
      status: "",
      counselor: "",
    });
  };

  return (
    <PageContainer className="space-y-6">
      {/* Toast Notification Alert */}
      {notification && (
        <div className="flex items-center justify-between p-3.5 rounded-lg bg-status-success-light border border-status-success-border text-status-success text-xs shadow-subtle animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="font-medium">{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="rounded p-1 hover:bg-emerald-100 text-status-success transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <FollowUpHeader onScheduleClick={() => setIsScheduleOpen(true)} />

      {/* Dynamic Summary Cards */}
      <FollowUpSummaryCards summary={followUpSummary} />

      {/* Multi-Factor Search & Filters */}
      <FollowUpFilters
        filters={filters}
        onChange={setFilters}
        totalCount={followUpTasks.length}
        filteredCount={filteredTasks.length}
        onReset={handleResetFilters}
      />

      {/* Follow-up Tasks Table */}
      <FollowUpTable
        tasks={filteredTasks}
        leads={leads}
        onComplete={(task) => {
          setTaskToComplete(task);
          setIsCompleteOpen(true);
        }}
        onReschedule={(task) => {
          setTaskToReschedule(task);
          setIsRescheduleOpen(true);
        }}
        onCancel={(task) => {
          setTaskToCancel(task);
          setIsCancelOpen(true);
        }}
        onViewLeadDetails={(lead) => {
          setSelectedLeadForDetails(lead);
          setIsDetailsOpen(true);
        }}
        onResetFilters={handleResetFilters}
      />

      {/* Schedule Follow-up Modal */}
      <ScheduleFollowUpModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        leads={leads}
        onSchedule={addFollowUpTask}
        onSuccess={showNotification}
      />

      {/* Reschedule Modal */}
      <RescheduleFollowUpModal
        isOpen={isRescheduleOpen}
        onClose={() => {
          setIsRescheduleOpen(false);
          setTaskToReschedule(null);
        }}
        task={taskToReschedule}
        lead={leads.find((l) => l.id === taskToReschedule?.leadId)}
        onReschedule={rescheduleFollowUpTask}
        onSuccess={showNotification}
      />

      {/* Mark Complete Modal */}
      <CompleteFollowUpModal
        isOpen={isCompleteOpen}
        onClose={() => {
          setIsCompleteOpen(false);
          setTaskToComplete(null);
        }}
        task={taskToComplete}
        lead={leads.find((l) => l.id === taskToComplete?.leadId)}
        onComplete={completeFollowUpTask}
        onSuccess={showNotification}
      />

      {/* Cancel Confirmation Modal */}
      <CancelFollowUpModal
        isOpen={isCancelOpen}
        onClose={() => {
          setIsCancelOpen(false);
          setTaskToCancel(null);
        }}
        task={taskToCancel}
        lead={leads.find((l) => l.id === taskToCancel?.leadId)}
        onConfirmCancel={cancelFollowUpTask}
        onSuccess={showNotification}
      />

      {/* Reusable Lead Details Modal */}
      <LeadDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedLeadForDetails(null);
        }}
        lead={selectedLeadForDetails}
        onEdit={() => {
          setIsDetailsOpen(false);
          router.push("/leads");
        }}
      />
    </PageContainer>
  );
}
