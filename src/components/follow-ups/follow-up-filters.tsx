"use client";

import * as React from "react";
import { Search, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { COUNSELOR_OPTIONS, FOLLOW_UP_METHODS } from "@/lib/demo-data";

export interface FollowUpFilterState {
  searchQuery: string;
  dateFilter: "All" | "Today" | "Overdue" | "Upcoming";
  method: string;
  status: string;
  counselor: string;
}

interface FollowUpFiltersProps {
  filters: FollowUpFilterState;
  onChange: (filters: FollowUpFilterState) => void;
  totalCount: number;
  filteredCount: number;
  onReset: () => void;
}

export function FollowUpFilters({
  filters,
  onChange,
  totalCount,
  filteredCount,
  onReset,
}: FollowUpFiltersProps) {
  const isFiltered =
    Boolean(filters.searchQuery.trim()) ||
    filters.dateFilter !== "All" ||
    Boolean(filters.method) ||
    Boolean(filters.status) ||
    Boolean(filters.counselor);

  return (
    <div className="space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-border-subtle shadow-subtle">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) =>
              onChange({ ...filters, searchQuery: e.target.value })
            }
            placeholder="Search by student name, phone, or lead ID..."
            className="w-full rounded-md border border-border-subtle bg-slate-50/70 pl-8 pr-8 py-1.5 text-xs text-text-primary placeholder:text-text-muted transition-colors focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onChange({ ...filters, searchQuery: "" })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 lg:w-auto">
          {/* Date Filter */}
          <div className="w-full sm:w-36">
            <Select
              value={filters.dateFilter}
              onChange={(e) =>
                onChange({
                  ...filters,
                  dateFilter: e.target.value as FollowUpFilterState["dateFilter"],
                })
              }
              aria-label="Filter by Timing"
            >
              <option value="All">All Dates</option>
              <option value="Today">Today</option>
              <option value="Overdue">Overdue</option>
              <option value="Upcoming">Upcoming</option>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-full sm:w-36">
            <Select
              value={filters.status}
              onChange={(e) =>
                onChange({ ...filters, status: e.target.value })
              }
              aria-label="Filter by Status"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </Select>
          </div>

          {/* Method Filter */}
          <div className="w-full sm:w-36">
            <Select
              value={filters.method}
              onChange={(e) =>
                onChange({ ...filters, method: e.target.value })
              }
              aria-label="Filter by Contact Method"
            >
              <option value="">All Methods</option>
              {FOLLOW_UP_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </Select>
          </div>

          {/* Counselor Filter */}
          <div className="w-full sm:w-36">
            <Select
              value={filters.counselor}
              onChange={(e) =>
                onChange({ ...filters, counselor: e.target.value })
              }
              aria-label="Filter by Counsellor"
            >
              <option value="">All Counsellors</option>
              {COUNSELOR_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Reset Action */}
        {isFiltered && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onReset}
            className="text-xs text-text-secondary hover:text-text-primary h-9 px-2.5 gap-1 shrink-0 self-end lg:self-auto"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      {/* Result Status Counter */}
      <div className="flex items-center justify-between text-xs text-text-secondary px-1">
        <span>
          Showing <strong className="text-text-primary font-semibold">{filteredCount}</strong> of{" "}
          <strong className="text-text-primary font-semibold">{totalCount}</strong> follow-up tasks
          {isFiltered && (
            <span className="ml-1 text-primary font-medium">(Filtered)</span>
          )}
        </span>
      </div>
    </div>
  );
}
