"use client";

import * as React from "react";
import { AlertTriangle, X } from "lucide-react";
import { MarketingCampaign } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { useLeads } from "@/context/leads-context";

interface DeleteCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: MarketingCampaign | null;
  onSuccess: (message: string) => void;
}

export function DeleteCampaignModal({
  isOpen,
  onClose,
  campaign,
  onSuccess,
}: DeleteCampaignModalProps) {
  const { deleteCampaign, leads } = useLeads();
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (!isOpen || !campaign) return null;

  const attributedLeadsCount = leads.filter(
    (l) =>
      l.campaignId === campaign.id ||
      (l.campaignName &&
        l.campaignName.toLowerCase() === campaign.name.toLowerCase())
  ).length;

  const handleDelete = () => {
    setIsDeleting(true);
    try {
      const res = deleteCampaign(campaign.id);
      if (res.success) {
        onSuccess(`Campaign "${campaign.name}" removed successfully.`);
        onClose();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-campaign-title"
    >
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl border border-border-subtle my-8 text-text-primary p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-status-error-light text-status-error">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3
                id="delete-campaign-title"
                className="text-base font-semibold text-text-primary"
              >
                Delete Campaign
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                {campaign.name} ({campaign.id})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 text-xs text-text-secondary leading-relaxed space-y-2">
          <p>
            Are you sure you want to remove this campaign record? This will remove
            its budget tracking and timeline entries.
          </p>
          {attributedLeadsCount > 0 && (
            <div className="p-2.5 rounded bg-status-warning-light border border-status-warning-border text-status-warning text-xs font-medium">
              Note: {attributedLeadsCount} existing student lead
              {attributedLeadsCount > 1 ? "s" : ""} will remain in the CRM with
              their historical campaign name preserved.
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-3 border-t border-border-subtle">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            isLoading={isDeleting}
            onClick={handleDelete}
          >
            Delete Campaign
          </Button>
        </div>
      </div>
    </div>
  );
}
