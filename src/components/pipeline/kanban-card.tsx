"use client";

import * as React from "react";
import {
  Calendar,
  Phone,
  Eye,
  BookOpen,
  ArrowRight,
  GripVertical,
} from "lucide-react";
import { Lead } from "@/types/crm";
import { Badge } from "@/components/ui/badge";
import { PIPELINE_STAGES } from "@/lib/demo-data";

interface KanbanCardProps {
  lead: Lead;
  onViewDetails: (lead: Lead) => void;
  onStageChange: (leadId: string, newStage: string) => void;
  onDragStart: (e: React.DragEvent, leadId: string) => void;
}

export function KanbanCard({
  lead,
  onViewDetails,
  onStageChange,
  onDragStart,
}: KanbanCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-lg border border-border-subtle bg-white p-3.5 shadow-subtle hover:shadow-card hover:border-slate-300 transition-all cursor-grab active:cursor-grabbing select-none"
    >
      {/* Top Row: Lead ID & Source Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <GripVertical className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-400 shrink-0" />
          <span className="font-mono text-[11px] font-semibold text-text-muted">
            {lead.id}
          </span>
        </div>
        <Badge variant={lead.sourceBadgeVariant || "neutral"} className="text-[10px] px-1.5 py-0.2">
          {lead.source}
        </Badge>
      </div>

      {/* Student Name & Phone */}
      <div className="space-y-0.5 mb-2.5">
        <h4 className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors truncate">
          {lead.studentName}
        </h4>
        <div className="flex items-center gap-1 text-[11px] font-mono text-text-secondary">
          <Phone className="h-2.5 w-2.5 text-text-muted shrink-0" />
          <span>{lead.phone}</span>
        </div>
      </div>

      {/* Course */}
      <div className="flex items-start gap-1.5 text-[11px] text-text-secondary mb-3">
        <BookOpen className="h-3 w-3 text-slate-400 shrink-0 mt-0.5" />
        <span className="truncate leading-tight font-medium" title={lead.course}>
          {lead.course}
        </span>
      </div>

      {/* Counselor & Follow-up Details */}
      <div className="pt-2 border-t border-border-subtle/80 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-text-muted truncate max-w-[120px]">
          <div className="h-4 w-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-600">
            {lead.counselor
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)}
          </div>
          <span className="truncate text-text-secondary">{lead.counselor}</span>
        </div>

        <div
          className={`flex items-center gap-1 font-medium ${
            lead.isOverdue ? "text-status-error font-semibold" : "text-text-muted"
          }`}
        >
          <Calendar className="h-3 w-3 shrink-0" />
          <span className="text-[10px]">{lead.nextFollowUp.split(",")[0]}</span>
        </div>
      </div>

      {/* Card Actions & Stage Dropdown */}
      <div className="mt-2.5 pt-2 border-t border-border-subtle/60 flex items-center justify-between gap-2">
        <button
          onClick={() => onViewDetails(lead)}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-text-secondary hover:text-primary transition-colors"
          title="View full lead record"
          aria-label={`View details for ${lead.studentName}`}
        >
          <Eye className="h-3 w-3" />
          <span>Details</span>
        </button>

        {/* Accessible Quick Stage Move Dropdown */}
        <div className="relative">
          <select
            value={lead.stage}
            onChange={(e) => onStageChange(lead.id, e.target.value)}
            className="text-[10px] h-6 rounded border border-border-subtle bg-slate-50 pl-1.5 pr-5 py-0.5 text-text-secondary hover:text-text-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            aria-label={`Move stage for ${lead.studentName}`}
          >
            {PIPELINE_STAGES.map((stg) => (
              <option key={stg} value={stg}>
                Move to: {stg}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
