"use client";

import * as React from "react";
import { X, AlertCircle } from "lucide-react";
import { ManagedLeadSource, LeadSourceCategory } from "@/types/crm";
import { SOURCE_CATEGORIES } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLeads } from "@/context/leads-context";

interface SourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceToEdit?: ManagedLeadSource | null;
  onSuccess: (message: string) => void;
}

const BADGE_VARIANTS: Array<{
  value: ManagedLeadSource["badgeVariant"];
  label: string;
}> = [
  { value: "default", label: "Primary Blue" },
  { value: "success", label: "Green (Direct / Messaging)" },
  { value: "warning", label: "Amber (Aggregator / Directory)" },
  { value: "error", label: "Rose / Red (Social Ads)" },
  { value: "info", label: "Cyan / Sky (Search Ads / Web)" },
  { value: "neutral", label: "Slate / Gray (Offline / Referral)" },
];

export function SourceModal({
  isOpen,
  onClose,
  sourceToEdit,
  onSuccess,
}: SourceModalProps) {
  const { addSource, updateSource } = useLeads();
  const isEditing = Boolean(sourceToEdit);

  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState<LeadSourceCategory>("Aggregator");
  const [badgeVariant, setBadgeVariant] = React.useState<ManagedLeadSource["badgeVariant"]>("default");
  const [isActive, setIsActive] = React.useState(true);
  const [description, setDescription] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (sourceToEdit) {
      setName(sourceToEdit.name);
      setCategory(sourceToEdit.category);
      setBadgeVariant(sourceToEdit.badgeVariant);
      setIsActive(sourceToEdit.isActive);
      setDescription(sourceToEdit.description || "");
      setError(null);
    } else {
      setName("");
      setCategory("Social Ads");
      setBadgeVariant("default");
      setIsActive(true);
      setDescription("");
      setError(null);
    }
  }, [sourceToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Lead source name is required.");
      return;
    }
    if (trimmedName.length < 2) {
      setError("Lead source name must be at least 2 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && sourceToEdit) {
        const res = updateSource(sourceToEdit.id, {
          name: trimmedName,
          category,
          badgeVariant,
          isActive,
          description: description.trim() || undefined,
        });

        if (!res.success) {
          setError(res.error || "Failed to update source.");
          setIsSubmitting(false);
          return;
        }

        onSuccess(`Channel "${trimmedName}" updated successfully.`);
        onClose();
      } else {
        const res = addSource({
          name: trimmedName,
          category,
          badgeVariant,
          isActive,
          description: description.trim() || undefined,
        });

        if (!res.success) {
          setError(res.error || "Failed to add source.");
          setIsSubmitting(false);
          return;
        }

        onSuccess(`Lead channel "${trimmedName}" created successfully.`);
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
      aria-labelledby="source-modal-title"
    >
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl border border-border-subtle my-8 text-text-primary">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <div>
            <h2
              id="source-modal-title"
              className="text-base font-semibold text-text-primary"
            >
              {isEditing ? `Edit Channel (${sourceToEdit?.id})` : "Add New Lead Channel"}
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Configure attribution platform, channel category, and active status.
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

          {/* Channel Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">
              Channel / Source Name <span className="text-status-error">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Justdial, Instagram Ads, Hospital Seminar"
              autoFocus
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">
              Channel Category <span className="text-status-error">*</span>
            </label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as LeadSourceCategory)}
            >
              {SOURCE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </div>

          {/* Badge Color Variant */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">
              Badge Color Accent
            </label>
            <Select
              value={badgeVariant}
              onChange={(e) =>
                setBadgeVariant(
                  e.target.value as ManagedLeadSource["badgeVariant"]
                )
              }
            >
              {BADGE_VARIANTS.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Active Status Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is-active-toggle"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-border-subtle text-primary focus:ring-primary/20"
            />
            <label
              htmlFor="is-active-toggle"
              className="text-xs font-medium text-text-primary cursor-pointer select-none"
            >
              Channel is Active & accepting prospect inquiries
            </label>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">
              Channel Notes / Details
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Integration details, contact person, account ID, or portal URL..."
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
              {isEditing ? "Save Changes" : "Create Channel"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
