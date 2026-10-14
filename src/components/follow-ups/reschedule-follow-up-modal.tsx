"use client";

import * as React from "react";
import { X, AlertCircle } from "lucide-react";
import { Lead, FollowUpTask, FollowUpMethod } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FOLLOW_UP_METHODS } from "@/lib/demo-data";
import { toDateTimeLocalString, parseDate } from "@/lib/date-utils";

interface RescheduleFollowUpModalProps {
  task: FollowUpTask | null;
  lead?: Lead;
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (
    taskId: string,
    newScheduledAt: string,
    method?: FollowUpMethod,
    notes?: string
  ) => { success: boolean; error?: string };
  onSuccess: (message: string) => void;
}

export function RescheduleFollowUpModal({
  task,
  lead,
  isOpen,
  onClose,
  onReschedule,
  onSuccess,
}: RescheduleFollowUpModalProps) {
  const [scheduledAt, setScheduledAt] = React.useState<string>("");
  const [method, setMethod] = React.useState<FollowUpMethod>("Phone Call");
  const [notes, setNotes] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (task) {
      const d = parseDate(task.scheduledAt) || new Date();
      setScheduledAt(toDateTimeLocalString(d));
      setMethod(task.method);
      setNotes(task.notes || "");
      setError(null);
    }
  }, [task, isOpen]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!scheduledAt) {
      setError("Please select a new date and time.");
      return;
    }

    const newDate = new Date(scheduledAt);
    if (isNaN(newDate.getTime())) {
      setError("Please enter a valid scheduled date.");
      return;
    }

    const res = onReschedule(
      task.id,
      newDate.toISOString(),
      method,
      notes.trim() || undefined
    );

    if (!res.success) {
      setError(res.error || "Failed to reschedule task.");
      return;
    }

    onSuccess(
      `Task ${task.id} rescheduled for ${lead ? lead.studentName : "student"}.`
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reschedule-modal-title"
    >
      <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl border border-border-subtle p-6 text-text-primary">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div>
            <h2 id="reschedule-modal-title" className="text-base font-semibold text-text-primary">
              Reschedule Follow-up
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Task ID: {task.id} • {lead ? lead.studentName : "Student"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-text-muted hover:text-text-primary hover:bg-slate-100"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {error && (
            <div className="p-3 rounded-md bg-status-error-light border border-status-error-border text-status-error text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">
              New Date & Time <span className="text-status-error">*</span>
            </label>
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">
              Contact Method
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
              Updated Notes / Reason
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Student requested to connect in the evening after work shift..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-subtle">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-primary hover:bg-primary-hover text-white"
            >
              Update Schedule
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
