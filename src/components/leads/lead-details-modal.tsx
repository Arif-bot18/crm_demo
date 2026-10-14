"use client";

import * as React from "react";
import {
  X,
  Phone,
  Mail,
  Calendar,
  Clock,
  User,
  BookOpen,
  Share2,
  Pencil,
  FileText,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Lead } from "@/types/crm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LeadDetailsModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
}

export function LeadDetailsModal({
  lead,
  isOpen,
  onClose,
  onEdit,
}: LeadDetailsModalProps) {
  if (!isOpen || !lead) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="details-title"
    >
      <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl border border-border-subtle my-8 text-text-primary">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              {lead.studentName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="details-title" className="text-base font-bold text-text-primary">
                  {lead.studentName}
                </h2>
                <Badge variant={lead.stageBadgeVariant || "neutral"} showDot>
                  {lead.stage}
                </Badge>
              </div>
              <span className="text-xs font-mono text-text-muted">
                Lead ID: {lead.id}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs gap-1.5 h-8"
              onClick={() => {
                onClose();
                onEdit(lead);
              }}
            >
              <Pencil className="h-3 w-3" />
              Edit Lead
            </Button>
            <button
              onClick={onClose}
              className="rounded p-1 text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors"
              aria-label="Close details"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="px-6 py-5 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50/70 border border-border-subtle">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Phone Number
              </span>
              <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-text-primary">
                <Phone className="h-3.5 w-3.5 text-primary" />
                <span>{lead.phone}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Email Address
              </span>
              <div className="flex items-center gap-1.5 text-xs text-text-primary">
                <Mail className="h-3.5 w-3.5 text-primary" />
                <span>{lead.email || "Not Provided"}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Academic & Attribution Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Interested Course
              </span>
              <div className="flex items-center gap-1.5 font-medium text-text-primary">
                <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                <span>{lead.course}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Lead Source & Campaign
              </span>
              <div className="flex items-center gap-2">
                <Badge variant={lead.sourceBadgeVariant || "neutral"}>
                  {lead.source}
                </Badge>
                {lead.campaignName && (
                  <span className="text-text-muted text-[11px] truncate max-w-[150px]">
                    ({lead.campaignName})
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Assigned Counsellor
              </span>
              <div className="flex items-center gap-1.5 font-medium text-text-primary">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span>{lead.counselor}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Next Follow-up
              </span>
              <div className="flex items-center gap-1.5 font-medium text-text-primary">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span className={lead.isOverdue ? "text-status-error font-semibold" : ""}>
                  {lead.nextFollowUp}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Created On
              </span>
              <div className="flex items-center gap-1.5 text-text-secondary">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>{lead.createdAt}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Last Contacted
              </span>
              <div className="flex items-center gap-1.5 text-text-secondary">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>{lead.lastContactedAt || "No contact logged yet"}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Notes */}
          <div className="space-y-1.5 pt-3 border-t border-border-subtle">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Counsellor Notes
            </span>
            <div className="p-3 rounded-md bg-slate-50 border border-border-subtle text-xs text-text-secondary leading-relaxed">
              {lead.notes || "No notes recorded for this candidate."}
            </div>
          </div>

          {/* Section 4: Activity History Timeline */}
          <div className="space-y-2 pt-3 border-t border-border-subtle">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-primary" />
                Activity History
              </span>
              <span className="text-[10px] text-text-muted bg-slate-100 px-1.5 py-0.5 rounded">
                Demonstration Log
              </span>
            </div>

            {lead.activities && lead.activities.length > 0 ? (
              <div className="space-y-3 pl-2 border-l-2 border-slate-200 mt-2">
                {lead.activities.map((act) => (
                  <div key={act.id} className="relative pl-4 space-y-0.5">
                    <div className="absolute -left-[13px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-white" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-text-primary">
                        {act.description}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        {act.timestamp}
                      </span>
                    </div>
                    <div className="text-[11px] text-text-secondary">
                      By: <span className="font-medium">{act.counselor}</span>
                    </div>
                    {act.note && (
                      <p className="text-[11px] italic text-text-muted mt-1 bg-slate-50 p-1.5 rounded border border-slate-100">
                        &quot;{act.note}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted italic">
                No activity history logged for this inquiry.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-border-subtle bg-slate-50/50">
          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
