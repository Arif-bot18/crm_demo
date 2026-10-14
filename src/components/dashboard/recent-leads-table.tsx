import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Phone, Calendar } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RecentLeadRecord } from "@/lib/demo-data";

interface RecentLeadsTableProps {
  leads: RecentLeadRecord[];
}

export function RecentLeadsTable({ leads }: RecentLeadsTableProps) {
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4">
        <div>
          <CardTitle className="text-base font-semibold text-text-primary">
            Recent Leads
          </CardTitle>
          <CardDescription className="text-xs text-text-secondary mt-0.5">
            Latest student inquiries and their current status.
          </CardDescription>
        </div>
        <Link href="/leads">
          <Button size="sm" variant="outline" className="text-xs gap-1.5 h-8">
            View All
            <ArrowUpRight className="h-3.5 w-3.5 text-text-muted" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-text-secondary border-y border-border-subtle">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Student Name
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Phone
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Course Interest
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Source
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Pipeline Stage
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Counsellor
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Next Follow-up
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle bg-white">
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Student Name */}
                  <td className="px-5 py-3.5 font-medium text-text-primary whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-700">
                        {lead.studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()}
                      </div>
                      <span>{lead.studentName}</span>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-3.5 text-text-secondary whitespace-nowrap">
                    <span className="font-mono text-[11px]">{lead.phone}</span>
                  </td>

                  {/* Course */}
                  <td className="px-4 py-3.5 text-text-secondary whitespace-nowrap">
                    <span className="truncate max-w-[200px] inline-block" title={lead.course}>
                      {lead.course}
                    </span>
                  </td>

                  {/* Source */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <Badge variant={lead.sourceBadgeVariant}>
                      {lead.source}
                    </Badge>
                  </td>

                  {/* Pipeline Stage */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <Badge variant={lead.stageBadgeVariant} showDot>
                      {lead.stage}
                    </Badge>
                  </td>

                  {/* Counsellor */}
                  <td className="px-4 py-3.5 text-text-secondary whitespace-nowrap">
                    {lead.counselor}
                  </td>

                  {/* Next Follow-up */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs ${
                        lead.isOverdue
                          ? "font-semibold text-status-error"
                          : "text-text-secondary"
                      }`}
                    >
                      <Calendar className="h-3.5 w-3.5 text-text-muted" />
                      {lead.nextFollowUp}
                    </span>
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
