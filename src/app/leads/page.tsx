"use client";

import * as React from "react";
import { Plus, Download, CheckCircle2, X } from "lucide-react";
import { Lead } from "@/types/crm";
import { PageContainer, PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { useLeads } from "@/context/leads-context";
import { LeadsSummaryCards } from "@/components/leads/leads-summary-cards";
import {
  LeadsFilters,
  LeadsFilterState,
} from "@/components/leads/leads-filters";
import { LeadsTable } from "@/components/leads/leads-table";
import { LeadFormModal } from "@/components/leads/lead-form-modal";
import { LeadDetailsModal } from "@/components/leads/lead-details-modal";
import { DeleteLeadModal } from "@/components/leads/delete-lead-modal";
import { exportLeadsToCSV } from "@/lib/csv-export";
import { normalizePhoneNumber } from "@/lib/demo-data";

export default function LeadsPage() {
  const { leads, summary, deleteLead } = useLeads();

  // Filter state
  const [filters, setFilters] = React.useState<LeadsFilterState>({
    searchQuery: "",
    source: "",
    stage: "",
    counselor: "",
  });

  // Modal states
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [leadToEdit, setLeadToEdit] = React.useState<Lead | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [selectedLeadForDetails, setSelectedLeadForDetails] =
    React.useState<Lead | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [leadToDelete, setLeadToDelete] = React.useState<Lead | null>(null);

  // Success Notification state
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  // Filter computation
  const filteredLeads = React.useMemo(() => {
    return leads.filter((lead) => {
      // 1. Search Query across Name, Phone, Email, Lead ID
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const normQuery = normalizePhoneNumber(query);
        const normLeadPhone = normalizePhoneNumber(lead.phone);

        const matchName = lead.studentName.toLowerCase().includes(query);
        const matchEmail = Boolean(lead.email && lead.email.toLowerCase().includes(query));
        const matchId = lead.id.toLowerCase().includes(query);
        const matchPhone =
          lead.phone.toLowerCase().includes(query) ||
          (normQuery.length > 2 && normLeadPhone.includes(normQuery));

        if (!matchName && !matchEmail && !matchId && !matchPhone) {
          return false;
        }
      }

      // 2. Source filter
      if (filters.source && lead.source !== filters.source) {
        return false;
      }

      // 3. Stage filter
      if (filters.stage && lead.stage !== filters.stage) {
        return false;
      }

      // 4. Counselor filter
      if (filters.counselor && lead.counselor !== filters.counselor) {
        return false;
      }

      return true;
    });
  }, [leads, filters]);

  // Handler functions
  const handleOpenAddModal = () => {
    setLeadToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (lead: Lead) => {
    setLeadToEdit(lead);
    setIsFormOpen(true);
  };

  const handleOpenDetails = (lead: Lead) => {
    setSelectedLeadForDetails(lead);
    setIsDetailsOpen(true);
  };

  const handleOpenDelete = (lead: Lead) => {
    setLeadToDelete(lead);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = (leadId: string) => {
    deleteLead(leadId);
    showNotification(`Lead "${leadId}" has been deleted from active inquiries.`);
  };

  const handleExportCSV = () => {
    exportLeadsToCSV(filteredLeads, "medlead-leads.csv");
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      source: "",
      stage: "",
      counselor: "",
    });
  };

  return (
    <PageContainer className="space-y-6">
      {/* Success Notification Alert */}
      {successMessage && (
        <div className="flex items-center justify-between p-3.5 rounded-lg bg-status-success-light border border-status-success-border text-status-success text-xs shadow-subtle animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="rounded p-1 hover:bg-emerald-100 text-status-success transition-colors"
            aria-label="Dismiss message"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Page Header with Actions */}
      <PageHeader
        title="All Leads"
        description="Manage student inquiries and track their admission progress."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "All Leads" },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportCSV}
              className="text-xs gap-1.5 h-9"
            >
              <Download className="h-3.5 w-3.5 text-text-muted" />
              Export
            </Button>
            <Button
              size="sm"
              onClick={handleOpenAddModal}
              className="text-xs gap-1.5 h-9 bg-primary hover:bg-primary-hover text-white shadow-subtle"
            >
              <Plus className="h-4 w-4" />
              Add Lead
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <LeadsSummaryCards summary={summary} />

      {/* Search and Filters */}
      <LeadsFilters
        filters={filters}
        onChange={setFilters}
        totalCount={leads.length}
        filteredCount={filteredLeads.length}
        onReset={handleResetFilters}
      />

      {/* Leads Table */}
      <LeadsTable
        leads={filteredLeads}
        onView={handleOpenDetails}
        onEdit={handleOpenEditModal}
        onDelete={handleOpenDelete}
        onResetFilters={handleResetFilters}
      />

      {/* Add / Edit Lead Modal */}
      <LeadFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setLeadToEdit(null);
        }}
        leadToEdit={leadToEdit}
        onSuccess={showNotification}
      />

      {/* View Lead Details Modal */}
      <LeadDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedLeadForDetails(null);
        }}
        lead={selectedLeadForDetails}
        onEdit={(lead) => {
          setIsDetailsOpen(false);
          handleOpenEditModal(lead);
        }}
      />

      {/* Delete Lead Confirmation Modal */}
      <DeleteLeadModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setLeadToDelete(null);
        }}
        lead={leadToDelete}
        onConfirm={handleConfirmDelete}
      />
    </PageContainer>
  );
}
