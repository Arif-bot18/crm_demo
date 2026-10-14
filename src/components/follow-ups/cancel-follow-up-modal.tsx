"use client";

import * as React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Lead, FollowUpTask } from "@/types/crm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CancelFollowUpModalProps {
  task: FollowUpTask | null;
  lead?: Lead;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (taskId: string, reason?: string) => { success: boolean };
  onSuccess: (message: string) => void;
}

export function CancelFollowUpModal({
  task,
  lead,
  isOpen,
  onClose,
  onConfirmCancel,
  onSuccess,
}: CancelFollowUpModalProps) {
  const [reason, setReason] = React.useState<string>("");

  React.useEffect(() => {
    if (isOpen) {
      setReason("");
    }
  }, [isOpen]);

  if (!isOpen || !task) return null;

  const handleConfirm = () => {
    onConfirmCancel(task.id, reason.trim() || undefined);
    onSuccess(
      `Task ${task.id} for ${lead ? lead.studentName : "student"} marked as Cancelled.`
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-modal-title"
    >
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl border border-border-subtle text-text-primary">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded p-1 text-text-muted hover:text-text-primary hover:bg-slate-100"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-status-warning">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div className="space-y-2">
            <h3 id="cancel-modal-title" className="text-base font-semibold text-text-primary">
              Cancel Follow-up Task
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Are you sure you want to cancel the scheduled follow-up for{" "}
              <strong className="text-text-primary font-semibold">
                {lead ? lead.studentName : task.leadId}
              </strong>
              ? The record will remain archived as Cancelled in the inquiry history.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <label className="text-xs font-semibold text-text-primary">
            Cancellation Reason (Optional)
          </label>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Student enrolled in another track or asked not to call back..."
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-border-subtle">
          <Button size="sm" variant="outline" onClick={onClose}>
            Back
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={handleConfirm}
          >
            Cancel Task
          </Button>
        </div>
      </div>
    </div>
  );
}
