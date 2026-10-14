"use client";

import * as React from "react";
import { X, AlertCircle } from "lucide-react";
import { Lead, FollowUpMethod } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { COUNSELOR_OPTIONS, FOLLOW_UP_METHODS } from "@/lib/demo-data";
import { toDateTimeLocalString } from "@/lib/date-utils";

interface ScheduleFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  onSchedule: (taskData: {
    leadId: string;
    scheduledAt: string;
    method: FollowUpMethod;
    assignedCounsellor: string;
    notes?: string;
  }) => { success: boolean; error?: string };
  onSuccess: (message: string) => void;
}

export function ScheduleFollowUpModal({
  isOpen,
  onClose,
  leads,
  onSchedule,
  onSuccess,
}: ScheduleFollowUpModalProps) {
  // Default to tomorrow 10:00 AM
  const getDefaultDateTime = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    return toDateTimeLocalString(d);
  };

  const [selectedLeadId, setSelectedLeadId] = React.useState<string>(
    leads[0]?.id || ""
  );
  const [scheduledAt, setScheduledAt] = React.useState<string>(getDefaultDateTime());
  const [method, setMethod] = React.useState<FollowUpMethod>("Phone Call");
  const [assignedCounsellor, setAssignedCounsellor] = React.useState<string>(
    leads[0]?.counselor || COUNSELOR_OPTIONS[0]
  );
  const [notes, setNotes] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // When selected lead changes, sync counselor to the lead's assigned counselor
  React.useEffect(() => {
    if (selectedLeadId) {
      const lead = leads.find((l) => l.id === selectedLeadId);
      if (lead?.counselor) {
        setAssignedCounsellor(lead.counselor);
      }
    }
  }, [selectedLeadId, leads]);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedLeadId(leads[0]?.id || "");
      setScheduledAt(getDefaultDateTime());
      setMethod("Phone Call");
      setAssignedCounsellor(leads[0]?.counselor || COUNSELOR_OPTIONS[0]);
      setNotes("");
      setError(null);
    }
  }, [isOpen, leads]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedLeadId) {
      setError("Please select a student lead.");
      return;
    }

    if (!scheduledAt) {
      setError("Please select a follow-up date and time.");
      return;
    }

    const scheduledDate = new Date(scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      setError("Please enter a valid scheduled date and time.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = onSchedule({
        leadId: selectedLeadId,
        scheduledAt: scheduledDate.toISOString(),
        method,
        assignedCounsellor,
        notes: notes.trim() || undefined,
      });

      if (!res.success) {
        setError(res.error || "Failed to schedule follow-up.");
        setIsSubmitting(false);
        return;
      }

      const lead = leads.find((l) => l.id === selectedLeadId);
      onSuccess(
        `Follow-up scheduled successfully for ${lead ? lead.studentName : selectedLeadId}.`
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-lg bg-white shadow-xl border border-border-subtle my-8 text-text-primary">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <div>
            <h2 id="schedule-modal-title" className="text-base font-semibold text-text-primary">
              Schedule Follow-up
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Plan the next contact interaction with a prospective student inquiry.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-status-error-light border border-status-error-border text-status-error text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Student Selector */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">
              Select Student Lead <span className="text-status-error">*</span>
            </label>
            <Select
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
            >
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.studentName} ({l.phone}) — {l.course}
                </option>
              ))}
            </Select>
          </div>

          {/* Date & Time */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">
              Scheduled Date & Time <span className="text-status-error">*</span>
            </label>
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="text-xs font-mono"
            />
          </div>

          {/* Method & Counsellor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-primary">
                Contact Method <span className="text-status-error">*</span>
              </label>
              <Select
                value={method}
                onChange={(e) => setMethod(e.target.value as FollowUpMethod)}
              >
                {FOLLOW_UP_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-primary">
                Assigned Counsellor <span className="text-status-error">*</span>
              </label>
              <Select
                value={assignedCounsellor}
                onChange={(e) => setAssignedCounsellor(e.target.value)}
              >
                {COUNSELOR_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">
              Follow-up Agenda / Notes
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Call to discuss course fee installment structure or confirm campus visit..."
              rows={3}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-subtle">
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
              size="sm"
              isLoading={isSubmitting}
              className="bg-primary hover:bg-primary-hover text-white"
            >
              Schedule Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
