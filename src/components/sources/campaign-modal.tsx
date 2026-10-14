"use client";

import * as React from "react";
import { X, AlertCircle } from "lucide-react";
import { MarketingCampaign, CampaignStatus } from "@/types/crm";
import { CAMPAIGN_STATUSES } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLeads } from "@/context/leads-context";

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignToEdit?: MarketingCampaign | null;
  onSuccess: (message: string) => void;
}

export function CampaignModal({
  isOpen,
  onClose,
  campaignToEdit,
  onSuccess,
}: CampaignModalProps) {
  const { sources, addCampaign, updateCampaign } = useLeads();
  const isEditing = Boolean(campaignToEdit);

  const [name, setName] = React.useState("");
  const [sourceId, setSourceId] = React.useState("");
  const [budget, setBudget] = React.useState<number | "">(25000);
  const [status, setStatus] = React.useState<CampaignStatus>("Active");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [targetAudience, setTargetAudience] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Initialize form state
  React.useEffect(() => {
    if (campaignToEdit) {
      setName(campaignToEdit.name);
      setSourceId(campaignToEdit.sourceId);
      setBudget(campaignToEdit.budget);
      setStatus(campaignToEdit.status);
      setStartDate(campaignToEdit.startDate);
      setEndDate(campaignToEdit.endDate || "");
      setTargetAudience(campaignToEdit.targetAudience || "");
      setNotes(campaignToEdit.notes || "");
      setError(null);
    } else {
      const defaultSource = sources.find((s) => s.isActive) || sources[0];
      const todayStr = new Date().toISOString().split("T")[0];
      setName("");
      setSourceId(defaultSource ? defaultSource.id : "");
      setBudget(25000);
      setStatus("Active");
      setStartDate(todayStr);
      setEndDate("");
      setTargetAudience("");
      setNotes("");
      setError(null);
    }
  }, [campaignToEdit, isOpen, sources]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Campaign name is required.");
      return;
    }
    if (trimmedName.length < 2) {
      setError("Campaign name must be at least 2 characters.");
      return;
    }

    if (!sourceId) {
      setError("Please select a marketing platform / lead channel.");
      return;
    }

    const numBudget = Number(budget);
    if (isNaN(numBudget) || numBudget < 0) {
      setError("Planned budget must be a positive number or zero.");
      return;
    }

    if (!startDate) {
      setError("Campaign start date is required.");
      return;
    }

    if (endDate && endDate < startDate) {
      setError("End date cannot be earlier than start date.");
      return;
    }

    setIsSubmitting(true);
    try {
      const matchedSource = sources.find((s) => s.id === sourceId);
      const sourceName = matchedSource ? matchedSource.name : "Other";

      if (isEditing && campaignToEdit) {
        const res = updateCampaign(campaignToEdit.id, {
          name: trimmedName,
          sourceId,
          sourceName,
          budget: numBudget,
          status,
          startDate,
          endDate: endDate.trim() || undefined,
          targetAudience: targetAudience.trim() || undefined,
          notes: notes.trim() || undefined,
        });

        if (!res.success) {
          setError(res.error || "Failed to update campaign.");
          setIsSubmitting(false);
          return;
        }

        onSuccess(`Campaign "${trimmedName}" updated successfully.`);
        onClose();
      } else {
        const res = addCampaign({
          name: trimmedName,
          sourceId,
          sourceName,
          budget: numBudget,
          status,
          startDate,
          endDate: endDate.trim() || undefined,
          targetAudience: targetAudience.trim() || undefined,
          notes: notes.trim() || undefined,
        });

        if (!res.success) {
          setError(res.error || "Failed to create campaign.");
          setIsSubmitting(false);
          return;
        }

        onSuccess(`Campaign "${trimmedName}" launched successfully.`);
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="campaign-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-lg bg-white shadow-xl border border-border-subtle my-8 text-text-primary">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <div>
            <h2
              id="campaign-modal-title"
              className="text-base font-semibold text-text-primary"
            >
              {isEditing
                ? `Edit Campaign (${campaignToEdit?.id})`
                : "Create Marketing Campaign"}
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Set budget, marketing source, duration, and target audience persona.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-status-error-light border border-status-error-border text-status-error text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Campaign Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">
              Campaign Name / UTM Tag <span className="text-status-error">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. IG_Nov_CPC_CrashCourse or Google_Search_Bangalore"
              autoFocus
            />
          </div>

          {/* Row 2: Lead Channel & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-primary">
                Lead Channel / Platform <span className="text-status-error">*</span>
              </label>
              <Select
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
              >
                {sources.map((src) => (
                  <option key={src.id} value={src.id}>
                    {src.name} {!src.isActive ? "(Inactive)" : ""}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-primary">
                Campaign Status <span className="text-status-error">*</span>
              </label>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as CampaignStatus)}
              >
                {CAMPAIGN_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Row 3: Budget & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-primary">
                Budget (₹ INR) <span className="text-status-error">*</span>
              </label>
              <Input
                type="number"
                min="0"
                step="500"
                value={budget}
                onChange={(e) =>
                  setBudget(e.target.value === "" ? "" : Number(e.target.value))
                }
                placeholder="25000"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-primary">
                Start Date <span className="text-status-error">*</span>
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-primary">
                End Date (Optional)
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Target Audience */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">
              Target Audience / Degree Focus
            </label>
            <Input
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. B.Pharm, B.Sc Biotech, Nursing graduates seeking CPC certification"
            />
          </div>

          {/* Campaign Strategy / Notes */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">
              Strategy & Creative Notes
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Video reel topics, CPC salary hook, voucher inclusions, or ad spend notes..."
              rows={3}
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              {isEditing ? "Save Campaign" : "Launch Campaign"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
