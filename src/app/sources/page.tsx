"use client";

import * as React from "react";
import { CheckCircle2, X, Share2, Megaphone } from "lucide-react";
import { ManagedLeadSource, MarketingCampaign } from "@/types/crm";
import { PageContainer } from "@/components/ui/page-header";
import { useLeads } from "@/context/leads-context";
import { SourcesSummaryCards } from "@/components/sources/sources-summary-cards";
import { SourcesHeader } from "@/components/sources/sources-header";
import { LeadSourcesTable } from "@/components/sources/lead-sources-table";
import { CampaignsTable } from "@/components/sources/campaigns-table";
import { SourceModal } from "@/components/sources/source-modal";
import { CampaignModal } from "@/components/sources/campaign-modal";
import { DeleteCampaignModal } from "@/components/sources/delete-campaign-modal";

export default function SourcesPage() {
  const { sources, campaigns, sourcesSummary, toggleSourceActive } = useLeads();

  // Active view tab: "sources" | "campaigns"
  const [activeTab, setActiveTab] = React.useState<"sources" | "campaigns">(
    "sources"
  );

  // Modals state
  const [isSourceModalOpen, setIsSourceModalOpen] = React.useState(false);
  const [sourceToEdit, setSourceToEdit] = React.useState<ManagedLeadSource | null>(
    null
  );

  const [isCampaignModalOpen, setIsCampaignModalOpen] = React.useState(false);
  const [campaignToEdit, setCampaignToEdit] =
    React.useState<MarketingCampaign | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [campaignToDelete, setCampaignToDelete] =
    React.useState<MarketingCampaign | null>(null);

  // Notification toast/alert state
  const [notification, setNotification] = React.useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const handleOpenAddSource = () => {
    setSourceToEdit(null);
    setIsSourceModalOpen(true);
  };

  const handleOpenEditSource = (source: ManagedLeadSource) => {
    setSourceToEdit(source);
    setIsSourceModalOpen(true);
  };

  const handleOpenAddCampaign = () => {
    setCampaignToEdit(null);
    setIsCampaignModalOpen(true);
  };

  const handleOpenEditCampaign = (campaign: MarketingCampaign) => {
    setCampaignToEdit(campaign);
    setIsCampaignModalOpen(true);
  };

  const handleOpenDeleteCampaign = (campaign: MarketingCampaign) => {
    setCampaignToDelete(campaign);
    setIsDeleteModalOpen(true);
  };

  const handleToggleSourceActive = (id: string) => {
    const target = sources.find((s) => s.id === id);
    const nextState = target ? !target.isActive : true;
    toggleSourceActive(id);
    showNotification(
      `Channel "${target?.name || id}" is now ${nextState ? "active" : "inactive"}.`
    );
  };

  return (
    <PageContainer className="space-y-6">
      {/* 1. Temporary Success Alert Toast */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-between p-3.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs shadow-subtle animate-in fade-in duration-200"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-emerald-700 hover:text-emerald-900 p-0.5 rounded transition-colors"
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 2. Page Header with Action Buttons */}
      <SourcesHeader
        onAddSource={handleOpenAddSource}
        onAddCampaign={handleOpenAddCampaign}
      />

      {/* 3. Four Core KPI Metrics Cards */}
      <SourcesSummaryCards summary={sourcesSummary} />

      {/* 4. Tab Selector Navigation */}
      <div className="flex items-center gap-2 border-b border-border-subtle pb-px">
        <button
          onClick={() => setActiveTab("sources")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all -mb-px ${
            activeTab === "sources"
              ? "border-primary text-primary bg-primary/5 rounded-t-md"
              : "border-transparent text-text-secondary hover:text-text-primary hover:border-slate-300"
          }`}
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>Lead Sources & Channels</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === "sources"
                ? "bg-primary text-white"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {sources.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("campaigns")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all -mb-px ${
            activeTab === "campaigns"
              ? "border-primary text-primary bg-primary/5 rounded-t-md"
              : "border-transparent text-text-secondary hover:text-text-primary hover:border-slate-300"
          }`}
        >
          <Megaphone className="h-3.5 w-3.5" />
          <span>Marketing Campaigns</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeTab === "campaigns"
                ? "bg-primary text-white"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {campaigns.length}
          </span>
        </button>
      </div>

      {/* 5. Active Tab View: Sources Table vs Campaigns Table */}
      {activeTab === "sources" ? (
        <LeadSourcesTable
          onEditSource={handleOpenEditSource}
          onToggleActive={handleToggleSourceActive}
        />
      ) : (
        <CampaignsTable
          onEditCampaign={handleOpenEditCampaign}
          onDeleteCampaign={handleOpenDeleteCampaign}
        />
      )}

      {/* 6. Modals */}
      <SourceModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        sourceToEdit={sourceToEdit}
        onSuccess={showNotification}
      />

      <CampaignModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        campaignToEdit={campaignToEdit}
        onSuccess={showNotification}
      />

      <DeleteCampaignModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        campaign={campaignToDelete}
        onSuccess={showNotification}
      />
    </PageContainer>
  );
}
