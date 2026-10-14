"use client";

import * as React from "react";
import {
  Calendar,
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
  SearchX,
} from "lucide-react";
import { Lead } from "@/types/crm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LeadsTableProps {
  leads: Lead[];
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onResetFilters: () => void;
}

export function LeadsTable({
  leads,
  onView,
  onEdit,
  onDelete,
  onResetFilters,
}: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <SearchX className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-text-primary">
              No matching leads found
            </h3>
            <p className="text-xs text-text-secondary max-w-sm">
              No student leads match your current search query or filter selection. Try adjusting your filters.
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
          <table className="w-full min-w-[850px] text-left text-xs">
            <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-text-secondary border-b border-border-subtle">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Lead ID
                </th>
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
                  Source
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Pipeline Stage
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Assigned Counsellor
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Next Follow-up
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle bg-white">
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Lead ID */}
                  <td className="px-4 py-3 font-mono text-[11px] font-medium text-text-muted whitespace-nowrap">
                    {lead.id}
                  </td>

                  {/* Student */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-700 shrink-0">
                        {lead.studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-text-primary text-xs">
                          {lead.studentName}
                        </span>
                        {lead.email && (
                          <span className="text-[11px] text-text-muted flex items-center gap-1">
                            <Mail className="h-2.5 w-2.5 inline" />
                            {lead.email}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                    <span className="font-mono text-[11px] flex items-center gap-1">
                      <Phone className="h-3 w-3 text-text-muted shrink-0" />
                      {lead.phone}
                    </span>
                  </td>

                  {/* Course */}
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                    <span
                      className="truncate max-w-[170px] inline-block font-medium"
                      title={lead.course}
                    >
                      {lead.course}
                    </span>
                  </td>

                  {/* Source */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge variant={lead.sourceBadgeVariant || "neutral"}>
                      {lead.source}
                    </Badge>
                  </td>

                  {/* Pipeline Stage */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge variant={lead.stageBadgeVariant || "neutral"} showDot>
                      {lead.stage}
                    </Badge>
                  </td>

                  {/* Assigned Counsellor */}
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap font-medium">
                    {lead.counselor}
                  </td>

                  {/* Next Follow-up */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs ${
                        lead.isOverdue
                          ? "font-semibold text-status-error"
                          : "text-text-secondary"
                      }`}
                    >
                      <Calendar className="h-3.5 w-3.5 text-text-muted shrink-0" />
                      {lead.nextFollowUp}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      {/* View Button */}
                      <button
                        onClick={() => onView(lead)}
                        className="rounded p-1.5 text-text-secondary hover:bg-slate-100 hover:text-text-primary transition-colors"
                        title="View Lead Details"
                        aria-label={`View details for ${lead.studentName}`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => onEdit(lead)}
                        className="rounded p-1.5 text-text-secondary hover:bg-slate-100 hover:text-primary transition-colors"
                        title="Edit Lead"
                        aria-label={`Edit ${lead.studentName}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDelete(lead)}
                        className="rounded p-1.5 text-text-secondary hover:bg-red-50 hover:text-status-error transition-colors"
                        title="Delete Lead"
                        aria-label={`Delete ${lead.studentName}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
