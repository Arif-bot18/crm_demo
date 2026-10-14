"use client";

import * as React from "react";
import { CheckCircle2, X } from "lucide-react";
import { Lead, FollowUpTask } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatFollowUpDate } from "@/lib/date-utils";

interface CompleteFollowUpModalProps {
  task: FollowUpTask | null;
  lead?: Lead;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (taskId: string, completionNotes?: string) => { success: boolean };
  onSuccess: (message: string) => void;
}

export function CompleteFollowUpModal({
  task,
  lead,
  isOpen,
  onClose,
  onComplete,
  onSuccess,
}: CompleteFollowUpModalProps) {
  const [outcomeNotes, setOutcomeNotes] = React.useState<string>("");

  React.useEffect(() => {
    if (isOpen) {
      setOutcomeNotes("");
    }
  }, [isOpen]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(task.id, outcomeNotes.trim() || undefined);
    onSuccess(
      `Follow-up marked complete for ${lead ? lead.studentName : "student"}. Activity logged.`
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="complete-modal-title"
    >
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl border border-border-subtle text-text-primary">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-emerald-100 text-status-success flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h2 id="complete-modal-title" className="text-base font-semibold text-text-primary">
                Complete Follow-up
              </h2>
              <p className="text-xs text-text-secondary">
                {lead ? lead.studentName : "Student"} • {task.method}
              </p>
            </div>
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
          <div className="p-3 rounded-md bg-slate-50 border border-border-subtle text-xs text-text-secondary space-y-1">
            <div className="flex justify-between">
              <span className="font-medium text-text-primary">Scheduled Time:</span>
              <span>{formatFollowUpDate(task.scheduledAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-text-primary">Counsellor:</span>
              <span>{task.assignedCounsellor}</span>
            </div>
            {task.notes && (
              <div className="pt-1 text-[11px] border-t border-slate-200">
                <span className="font-medium text-text-primary">Original Agenda:</span> {task.notes}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">
              Call Outcome & Conversation Notes
            </label>
            <Textarea
              value={outcomeNotes}
              onChange={(e) => setOutcomeNotes(e.target.value)}
              placeholder="e.g. Spoke with candidate. Agreed on batch schedule, fee installment approved, will confirm by Friday..."
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
              className="bg-status-success hover:bg-emerald-700 text-white shadow-subtle border-status-success"
            >
              Mark Completed
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
