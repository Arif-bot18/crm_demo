"use client";

import * as React from "react";
import {
  Search,
  Edit2,
  Trash2,
  Megaphone,
  Calendar,
  Filter,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  MarketingCampaign,
  CampaignPerformanceMetric,
  CampaignStatus,
} from "@/types/crm";
import { CAMPAIGN_STATUSES, getSourceBadgeVariant } from "@/lib/demo-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useLeads } from "@/context/leads-context";

interface CampaignsTableProps {
  onEditCampaign: (campaign: MarketingCampaign) => void;
  onDeleteCampaign: (campaign: MarketingCampaign) => void;
}

export function CampaignsTable({
  onEditCampaign,
  onDeleteCampaign,
}: CampaignsTableProps) {
  const { campaigns, campaignMetrics, sources } = useLeads();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSourceId, setSelectedSourceId] = React.useState<string>("All");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("All");

  const filteredMetrics = React.useMemo(() => {
    return campaignMetrics.filter((m) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = m.campaignName.toLowerCase().includes(q);
        const matchesSource = m.sourceName.toLowerCase().includes(q);
        const matchesId = m.campaignId.toLowerCase().includes(q);
        if (!matchesName && !matchesSource && !matchesId) return false;
      }

      // 2. Source Filter
      if (selectedSourceId !== "All" && m.sourceId !== selectedSourceId) {
        return false;
      }

      // 3. Status Filter
      if (selectedStatus !== "All" && m.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [campaignMetrics, searchQuery, selectedSourceId, selectedStatus]);

  const getStatusBadgeVariant = (
    status: CampaignStatus
  ): "success" | "warning" | "info" | "neutral" => {
    switch (status) {
      case "Active":
        return "success";
      case "Planned":
        return "neutral";
      case "Completed":
        return "info";
      case "Paused":
        return "warning";
      default:
        return "neutral";
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search & Status / Channel Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-border-subtle shadow-subtle">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaign by name, tag, or ID..."
            className="w-full rounded-md border border-border-subtle bg-slate-50/70 pl-8 pr-8 py-1.5 text-xs text-text-primary placeholder:text-text-muted transition-colors focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary text-xs"
              aria-label="Clear campaign search"
            >
              ×
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-text-muted" />
            <span className="text-xs font-medium text-text-secondary">
              Filter:
            </span>
          </div>

          <Select
            value={selectedSourceId}
            onChange={(e) => setSelectedSourceId(e.target.value)}
            className="w-40"
          >
            <option value="All">All Channels</option>
            {sources.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>

          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-32"
          >
            <option value="All">All Statuses</option>
            {CAMPAIGN_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-lg border border-border-subtle shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-border-subtle text-text-secondary uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Campaign / Platform</th>
                <th className="px-4 py-3">Timeline</th>
                <th className="px-4 py-3 text-right">Budget (₹)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Leads</th>
                <th className="px-4 py-3 text-right">Admissions</th>
                <th className="px-4 py-3">Conversion Rate</th>
                <th className="px-4 py-3 text-right">Cost / Lead (CPL)</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-primary">
              {filteredMetrics.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-12 text-center text-text-muted"
                  >
                    <Megaphone className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-medium text-text-secondary">
                      No marketing campaigns found
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      Create your first marketing campaign to track budget and conversion.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredMetrics.map((metric) => {
                  const campaignRecord = campaigns.find(
                    (c) => c.id === metric.campaignId
                  );

                  return (
                    <tr
                      key={metric.campaignId}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Campaign Name & Source Badge */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-text-primary">
                            {metric.campaignName}
                          </span>
                          <span className="text-[10px] text-text-muted font-mono">
                            {metric.campaignId}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={getSourceBadgeVariant(metric.sourceName)}
                            className="text-[10px] py-0"
                          >
                            {metric.sourceName}
                          </Badge>
                          {campaignRecord?.targetAudience && (
                            <span className="text-[11px] text-text-muted line-clamp-1 max-w-xs">
                              {campaignRecord.targetAudience}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Timeline */}
                      <td className="px-4 py-3.5 text-text-secondary">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Calendar className="h-3.5 w-3.5 text-text-muted shrink-0" />
                          <span>
                            {metric.startDate}
                            {metric.endDate ? ` → ${metric.endDate}` : " (Ongoing)"}
                          </span>
                        </div>
                      </td>

                      {/* Budget */}
                      <td className="px-4 py-3.5 text-right font-medium text-text-primary">
                        ₹{metric.budget.toLocaleString("en-IN")}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <Badge
                          variant={getStatusBadgeVariant(metric.status)}
                          showDot
                          className="font-medium"
                        >
                          {metric.status}
                        </Badge>
                      </td>

                      {/* Leads Count */}
                      <td className="px-4 py-3.5 text-right font-semibold text-text-primary">
                        {metric.totalLeads}
                      </td>

                      {/* Enrolled Count */}
                      <td className="px-4 py-3.5 text-right">
                        {metric.enrolledCount > 0 ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-status-success-light text-status-success">
                            {metric.enrolledCount}
                          </span>
                        ) : (
                          <span className="text-text-muted">0</span>
                        )}
                      </td>

                      {/* Conversion Rate */}
                      <td className="px-4 py-3.5 min-w-[130px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200/50">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width: `${Math.min(100, metric.conversionRate)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium text-text-secondary w-10 text-right">
                            {metric.conversionRate}%
                          </span>
                        </div>
                      </td>

                      {/* Cost Per Lead */}
                      <td className="px-4 py-3.5 text-right font-medium">
                        {metric.costPerLead !== null ? (
                          <span className="text-text-primary">
                            ₹{metric.costPerLead.toLocaleString("en-IN")}
                          </span>
                        ) : (
                          <span className="text-text-muted text-[11px]">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {campaignRecord && (
                            <>
                              <button
                                onClick={() => onEditCampaign(campaignRecord)}
                                title="Edit Campaign"
                                className="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteCampaign(campaignRecord)}
                                title="Delete Campaign"
                                className="p-1.5 rounded text-text-muted hover:text-status-error hover:bg-status-error-light transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 bg-slate-50/70 border-t border-border-subtle text-xs text-text-secondary flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Showing <strong className="text-text-primary">{filteredMetrics.length}</strong>{" "}
            of {campaignMetrics.length} campaigns
          </span>
          <span className="text-[11px] text-text-muted">
            Cost-per-lead is calculated in real time: Budget ÷ Attributed Leads.
          </span>
        </div>
      </div>
    </div>
  );
}
