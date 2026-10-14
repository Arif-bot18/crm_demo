"use client";

import * as React from "react";
import { Lead } from "@/types/crm";
import { PIPELINE_STAGES } from "@/lib/demo-data";
import { KanbanCard } from "./kanban-card";
import { Inbox } from "lucide-react";

interface KanbanBoardProps {
  leads: Lead[];
  onStageChange: (leadId: string, newStage: string) => void;
  onViewDetails: (lead: Lead) => void;
}

const STAGE_CONFIGS: Record<
  string,
  {
    borderClass: string;
    badgeBg: string;
    headerBg: string;
    dotColor: string;
  }
> = {
  "New Lead": {
    borderClass: "border-t-blue-500",
    badgeBg: "bg-blue-100 text-blue-800",
    headerBg: "bg-blue-50/50",
    dotColor: "bg-blue-500",
  },
  "Contacted": {
    borderClass: "border-t-cyan-500",
    badgeBg: "bg-cyan-100 text-cyan-800",
    headerBg: "bg-cyan-50/50",
    dotColor: "bg-cyan-500",
  },
  "Interested": {
    borderClass: "border-t-indigo-500",
    badgeBg: "bg-indigo-100 text-indigo-800",
    headerBg: "bg-indigo-50/50",
    dotColor: "bg-indigo-500",
  },
  "Counselling": {
    borderClass: "border-t-purple-500",
    badgeBg: "bg-purple-100 text-purple-800",
    headerBg: "bg-purple-50/50",
    dotColor: "bg-purple-500",
  },
  "Fees Discussed": {
    borderClass: "border-t-amber-500",
    badgeBg: "bg-amber-100 text-amber-800",
    headerBg: "bg-amber-50/50",
    dotColor: "bg-amber-500",
  },
  "Enrolled": {
    borderClass: "border-t-emerald-500",
    badgeBg: "bg-emerald-100 text-emerald-800",
    headerBg: "bg-emerald-50/50",
    dotColor: "bg-emerald-500",
  },
  "Lost": {
    borderClass: "border-t-rose-500",
    badgeBg: "bg-rose-100 text-rose-800",
    headerBg: "bg-rose-50/50",
    dotColor: "bg-rose-500",
  },
};

export function KanbanBoard({
  leads,
  onStageChange,
  onViewDetails,
}: KanbanBoardProps) {
  const [dragOverStage, setDragOverStage] = React.useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData("text/plain", leadId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverStage !== stage) {
      setDragOverStage(stage);
    }
  };

  const handleDragLeave = (e: React.DragEvent, stage: string) => {
    // Only clear if leaving to outside the column
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (dragOverStage === stage) {
      setDragOverStage(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    setDragOverStage(null);
    const leadId = e.dataTransfer.getData("text/plain");
    if (leadId) {
      onStageChange(leadId, targetStage);
    }
  };

  return (
    <div className="w-full">
      {/* Horizontally Scrollable Kanban Viewport */}
      <div className="w-full overflow-x-auto pb-6 pt-1">
        <div className="inline-flex gap-4 min-w-full items-start">
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = leads.filter((l) => l.stage === stage);
            const isDraggingOver = dragOverStage === stage;
            const config = STAGE_CONFIGS[stage] || {
              borderClass: "border-t-slate-400",
              badgeBg: "bg-slate-100 text-slate-800",
              headerBg: "bg-slate-50",
              dotColor: "bg-slate-400",
            };

            return (
              <div
                key={stage}
                onDragOver={(e) => handleDragOver(e, stage)}
                onDragLeave={(e) => handleDragLeave(e, stage)}
                onDrop={(e) => handleDrop(e, stage)}
                className={`flex flex-col w-72 shrink-0 rounded-lg border border-border-subtle bg-slate-50/60 shadow-subtle transition-all border-t-4 ${
                  config.borderClass
                } ${
                  isDraggingOver
                    ? "ring-2 ring-primary/40 bg-blue-50/40 border-primary"
                    : ""
                }`}
              >
                {/* Column Header */}
                <div
                  className={`flex items-center justify-between px-3.5 py-3 border-b border-border-subtle rounded-t-sm ${config.headerBg}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${config.dotColor}`}
                      aria-hidden="true"
                    />
                    <h3 className="text-xs font-bold text-text-primary">
                      {stage}
                    </h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${config.badgeBg}`}
                  >
                    {stageLeads.length}
                  </span>
                </div>

                {/* Column Card Stream & Drop Zone */}
                <div className="p-2.5 space-y-2.5 min-h-[380px] max-h-[calc(100vh-280px)] overflow-y-auto">
                  {stageLeads.length > 0 ? (
                    stageLeads.map((lead) => (
                      <KanbanCard
                        key={lead.id}
                        lead={lead}
                        onViewDetails={onViewDetails}
                        onStageChange={onStageChange}
                        onDragStart={handleDragStart}
                      />
                    ))
                  ) : (
                    <div
                      className={`h-36 rounded-lg border-2 border-dashed flex flex-col items-center justify-center p-4 text-center transition-colors ${
                        isDraggingOver
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-slate-200 text-text-muted"
                      }`}
                    >
                      <Inbox className="h-5 w-5 mb-1.5 opacity-60" />
                      <span className="text-[11px] font-medium">
                        {isDraggingOver ? "Drop lead here" : "No leads in this stage"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
