"use client";

import * as React from "react";
import {
  Phone,
  MessageSquare,
  Mail,
  HelpCircle,
  Calendar,
  Check,
  CalendarClock,
  Ban,
  Eye,
  SearchX,
} from "lucide-react";
import { Lead, FollowUpTask, FollowUpMethod } from "@/types/crm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatFollowUpDate, getTaskTimingStatus } from "@/lib/date-utils";

interface FollowUpTableProps {
  tasks: FollowUpTask[];
  leads: Lead[];
  onComplete: (task: FollowUpTask) => void;
  onReschedule: (task: FollowUpTask) => void;
  onCancel: (task: FollowUpTask) => void;
  onViewLeadDetails: (lead: Lead) => void;
  onResetFilters: () => void;
}

export function FollowUpTable({
  tasks,
  leads,
  onComplete,
  onReschedule,
  onCancel,
  onViewLeadDetails,
  onResetFilters,
}: FollowUpTableProps) {
  // Helper to resolve lead record by leadId
  const getLeadForTask = (leadId: string): Lead | undefined => {
    return leads.find((l) => l.id === leadId);
  };

  const getMethodIcon = (method: FollowUpMethod) => {
    switch (method) {
      case "Phone Call":
        return <Phone className="h-3 w-3 text-blue-600" />;
      case "WhatsApp":
        return <MessageSquare className="h-3 w-3 text-emerald-600" />;
      case "Email":
        return <Mail className="h-3 w-3 text-purple-600" />;
      default:
        return <HelpCircle className="h-3 w-3 text-slate-500" />;
    }
  };

  const renderStatusBadge = (task: FollowUpTask) => {
    const timing = getTaskTimingStatus(task.scheduledAt, task.status);

    if (timing === "completed") {
      return (
        <Badge variant="success" showDot>
          Completed
        </Badge>
      );
    }
    if (timing === "cancelled") {
      return (
        <Badge variant="neutral">
          Cancelled
        </Badge>
      );
    }
    if (timing === "overdue") {
      return (
        <Badge variant="error" showDot>
          Overdue
        </Badge>
      );
    }
    if (timing === "today") {
      return (
        <Badge variant="warning" showDot>
          Due Today
        </Badge>
      );
    }
    return (
      <Badge variant="info">
        Upcoming
      </Badge>
    );
  };

  if (tasks.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <SearchX className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-text-primary">
              No follow-up tasks found
            </h3>
            <p className="text-xs text-text-secondary max-w-sm">
              No scheduled reminders match your current search query or filter settings.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onResetFilters}
            className="text-xs mt-2"
          >
            Clear All Filters
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden shadow-card">
      <CardContent className="p-0">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-xs">
            <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-text-secondary border-b border-border-subtle">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Student Details
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Phone
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Course
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Source / Stage
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Scheduled Date & Time
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Method
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Assigned Counsellor
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle bg-white">
              {tasks.map((task) => {
                const lead = getLeadForTask(task.leadId);
                const timing = getTaskTimingStatus(task.scheduledAt, task.status);
                const isPending = task.status === "Pending";

                return (
                  <tr
                    key={task.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Student Name & ID */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-700 shrink-0">
                          {lead
                            ? lead.studentName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .substring(0, 2)
                                .toUpperCase()
                            : "NA"}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-text-primary text-xs">
                            {lead ? lead.studentName : "Unknown Lead"}
                          </span>
                          <span className="text-[11px] font-mono text-text-muted">
                            {task.leadId} • {task.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap font-mono text-[11px]">
                      {lead ? lead.phone : "—"}
                    </td>

                    {/* Course */}
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                      <span
                        className="truncate max-w-[150px] inline-block font-medium"
                        title={lead?.course}
                      >
                        {lead ? lead.course : "—"}
                      </span>
                    </td>

                    {/* Source & Stage Badges */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {lead && (
                          <>
                            <Badge
                              variant={lead.sourceBadgeVariant || "neutral"}
                              className="text-[10px] px-1.5 py-0"
                            >
                              {lead.source}
                            </Badge>
                            <Badge
                              variant={lead.stageBadgeVariant || "neutral"}
                              className="text-[10px] px-1.5 py-0"
                            >
                              {lead.stage}
                            </Badge>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Scheduled Date & Time */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span
                          className={`font-medium flex items-center gap-1.5 ${
                            timing === "overdue"
                              ? "text-status-error font-semibold"
                              : "text-text-primary"
                          }`}
                        >
                          <Calendar className="h-3 w-3 text-text-muted" />
                          {formatFollowUpDate(task.scheduledAt)}
                        </span>
                        {task.notes && (
                          <span
                            className="text-[10px] text-text-muted truncate max-w-[200px]"
                            title={task.notes}
                          >
                            Note: {task.notes}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Method */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 rounded bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700">
                        {getMethodIcon(task.method)}
                        <span>{task.method}</span>
                      </div>
                    </td>

                    {/* Assigned Counsellor */}
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap font-medium">
                      {task.assignedCounsellor}
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {renderStatusBadge(task)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        {isPending && (
                          <>
                            {/* Complete Action */}
                            <button
                              onClick={() => onComplete(task)}
                              className="rounded p-1.5 text-text-secondary hover:bg-emerald-50 hover:text-status-success transition-colors"
                              title="Mark Complete"
                              aria-label="Mark task as completed"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>

                            {/* Reschedule Action */}
                            <button
                              onClick={() => onReschedule(task)}
                              className="rounded p-1.5 text-text-secondary hover:bg-blue-50 hover:text-primary transition-colors"
                              title="Reschedule Follow-up"
                              aria-label="Reschedule follow-up"
                            >
                              <CalendarClock className="h-3.5 w-3.5" />
                            </button>

                            {/* Cancel Action */}
                            <button
                              onClick={() => onCancel(task)}
                              className="rounded p-1.5 text-text-secondary hover:bg-red-50 hover:text-status-error transition-colors"
                              title="Cancel Task"
                              aria-label="Cancel follow-up task"
                            >
                              <Ban className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}

                        {/* View Lead Details Action */}
                        {lead && (
                          <button
                            onClick={() => onViewLeadDetails(lead)}
                            className="rounded p-1.5 text-text-secondary hover:bg-slate-100 hover:text-text-primary transition-colors"
                            title="View Student Record"
                            aria-label={`View details for ${lead.studentName}`}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
