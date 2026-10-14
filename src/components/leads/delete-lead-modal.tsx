"use client";

import * as React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Lead } from "@/types/crm";
import { Button } from "@/components/ui/button";

interface DeleteLeadModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (leadId: string) => void;
}

export function DeleteLeadModal({
  lead,
  isOpen,
  onClose,
  onConfirm,
}: DeleteLeadModalProps) {
  if (!isOpen || !lead) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-title"
    >
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl border border-border-subtle text-text-primary">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded p-1 text-text-muted hover:text-text-primary hover:bg-slate-100"
          aria-label="Cancel deletion"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-status-error">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div className="space-y-2">
            <h3 id="delete-title" className="text-base font-semibold text-text-primary">
              Delete Lead Confirmation
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Are you sure you want to delete lead{" "}
              <strong className="text-text-primary font-semibold">
                {lead.id} ({lead.studentName})
              </strong>
              ? This action will remove the student inquiry record from the active CRM roster.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-border-subtle">
          <Button size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              onConfirm(lead.id);
              onClose();
            }}
          >
            Delete Lead
          </Button>
        </div>
      </div>
    </div>
  );
}
