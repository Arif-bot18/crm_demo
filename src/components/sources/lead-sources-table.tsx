"use client";

import * as React from "react";
import {
  Search,
  Edit2,
  CheckCircle,
  XCircle,
  Megaphone,
  Share2,
  Filter,
} from "lucide-react";
import {
  ManagedLeadSource,
  SourcePerformanceMetric,
  LeadSourceCategory,
} from "@/types/crm";
import { SOURCE_CATEGORIES } from "@/lib/demo-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useLeads } from "@/context/leads-context";

interface LeadSourcesTableProps {
  onEditSource: (source: ManagedLeadSource) => void;
  onToggleActive: (id: string) => void;
}

export function LeadSourcesTable({
  onEditSource,
  onToggleActive,
}: LeadSourcesTableProps) {
  const { sources, sourceMetrics } = useLeads();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [statusFilter, setStatusFilter] = React.useState<string>("All");

  // Filter sources
  const filteredMetrics = React.useMemo(() => {
    return sourceMetrics.filter((m) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = m.sourceName.toLowerCase().includes(q);
        const matchesCat = m.category.toLowerCase().includes(q);
        const matchesId = m.sourceId.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesId) return false;
      }

      // 2. Category Filter
      if (selectedCategory !== "All" && m.category !== selectedCategory) {
        return false;
      }

      // 3. Status Filter
      if (statusFilter === "Active" && !m.isActive) return false;
      if (statusFilter === "Inactive" && m.isActive) return false;

      return true;
    });
  }, [sourceMetrics, searchQuery, selectedCategory, statusFilter]);

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-border-subtle shadow-subtle">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search channel by name, category, or ID..."
            className="w-full rounded-md border border-border-subtle bg-slate-50/70 pl-8 pr-8 py-1.5 text-xs text-text-primary placeholder:text-text-muted transition-colors focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary text-xs"
              aria-label="Clear channel search"
            >
              ×
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-text-muted" />
            <span className="text-xs font-medium text-text-secondary">
              Category:
            </span>
          </div>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-40"
          >
            <option value="All">All Categories</option>
            {SOURCE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-28"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg border border-border-subtle shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-border-subtle text-text-secondary uppercase font-semibold text-[11px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Channel / Source</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Inquiries</th>
                <th className="px-4 py-3 text-right">Admissions</th>
                <th className="px-4 py-3">Conversion Rate</th>
                <th className="px-4 py-3 text-center">Campaigns</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-primary">
              {filteredMetrics.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-text-muted"
                  >
                    <Share2 className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-medium text-text-secondary">
                      No lead sources found
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      Try adjusting your search criteria or category filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredMetrics.map((metric) => {
                  const sourceRecord = sources.find(
                    (s) => s.id === metric.sourceId
                  );

                  return (
                    <tr
                      key={metric.sourceId}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Channel Name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={metric.badgeVariant}
                            showDot
                            className="font-medium"
                          >
                            {metric.sourceName}
                          </Badge>
                          <span className="text-[10px] text-text-muted font-mono">
                            {metric.sourceId}
                          </span>
                        </div>
                        {sourceRecord?.description && (
                          <p className="text-[11px] text-text-muted line-clamp-1 mt-1 max-w-xs">
                            {sourceRecord.description}
                          </p>
                        )}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5 text-text-secondary">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
                          {metric.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        {metric.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Inquiries / Leads */}
                      <td className="px-4 py-3.5 text-right font-semibold text-text-primary">
                        {metric.totalLeads}
                      </td>

                      {/* Admissions */}
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
                      <td className="px-4 py-3.5 min-w-[140px]">
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

                      {/* Active Campaigns */}
                      <td className="px-4 py-3.5 text-center">
                        {metric.activeCampaignsCount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                            <Megaphone className="h-3 w-3" />
                            {metric.activeCampaignsCount}
                          </span>
                        ) : (
                          <span className="text-text-muted text-[11px]">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onToggleActive(metric.sourceId)}
                            title={
                              metric.isActive
                                ? "Deactivate channel"
                                : "Activate channel"
                            }
                            className={`p-1.5 rounded transition-colors ${
                              metric.isActive
                                ? "text-emerald-600 hover:bg-emerald-50"
                                : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            }`}
                          >
                            {metric.isActive ? (
                              <CheckCircle className="h-3.5 w-3.5" />
                            ) : (
                              <XCircle className="h-3.5 w-3.5" />
                            )}
                          </button>
                          {sourceRecord && (
                            <button
                              onClick={() => onEditSource(sourceRecord)}
                              title="Edit Channel Configuration"
                              className="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-slate-100 transition-colors"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
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
            of {sourceMetrics.length} total channels
          </span>
          <span className="text-[11px] text-text-muted">
            Conversion rate updates automatically whenever leads enroll.
          </span>
        </div>
      </div>
    </div>
  );
}
