"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";
import { Lead } from "@/types/crm";
import { PageContainer } from "@/components/ui/page-header";
import { useLeads } from "@/context/leads-context";
import { PipelineSummaryCards } from "@/components/pipeline/pipeline-summary-cards";
import {
  PipelineHeader,
  PipelineViewMode,
} from "@/components/pipeline/pipeline-header";
import { KanbanBoard } from "@/components/pipeline/kanban-board";
import { PipelineTableView } from "@/components/pipeline/pipeline-table-view";
import { LeadDetailsModal } from "@/components/leads/lead-details-modal";
import { normalizePhoneNumber } from "@/lib/demo-data";

export default function PipelinePage() {
  const router = useRouter();
  const { leads, pipelineSummary, updateLeadStage } = useLeads();

  const [viewMode, setViewMode] = React.useState<PipelineViewMode>("kanban");
  const [searchQuery, setSearchQuery] = React.useState("");

  const [selectedLeadForDetails, setSelectedLeadForDetails] =
    React.useState<Lead | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

  const [notification, setNotification] = React.useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Filter leads based on search query
  const filteredLeads = React.useMemo(() => {
    if (!searchQuery.trim()) return leads;

    const q = searchQuery.toLowerCase().trim();
    const normQ = normalizePhoneNumber(q);

    return leads.filter((lead) => {
      const matchName = lead.studentName.toLowerCase().includes(q);
      const matchId = lead.id.toLowerCase().includes(q);
      const matchEmail = Boolean(lead.email && lead.email.toLowerCase().includes(q));
      const normLeadPhone = normalizePhoneNumber(lead.phone);
      const matchPhone =
        lead.phone.toLowerCase().includes(q) ||
        (normQ.length > 2 && normLeadPhone.includes(normQ));

      return matchName || matchId || matchEmail || matchPhone;
    });
  }, [leads, searchQuery]);

  // Stage transition handler
  const handleStageChange = (leadId: string, newStage: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.stage === newStage) return;

    const res = updateLeadStage(leadId, newStage);
    if (res.success) {
      showNotification(
        `Lead ${leadId} (${lead.studentName}) moved to "${newStage}".`
      );
    }
  };

  const handleViewDetails = (lead: Lead) => {
    setSelectedLeadForDetails(lead);
    setIsDetailsOpen(true);
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
      <PipelineHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalFiltered={filteredLeads.length}
        totalLeads={leads.length}
      />

      {/* Pipeline Summary Cards */}
      <PipelineSummaryCards summary={pipelineSummary} />

      {/* Main View: Kanban Board vs Table */}
      {viewMode === "kanban" ? (
        <KanbanBoard
          leads={filteredLeads}
          onStageChange={handleStageChange}
          onViewDetails={handleViewDetails}
        />
      ) : (
        <PipelineTableView
          leads={filteredLeads}
          onStageChange={handleStageChange}
          onViewDetails={handleViewDetails}
          onResetSearch={() => setSearchQuery("")}
        />
      )}

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
