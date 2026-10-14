"use client";

import * as React from "react";
import { Search, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  SOURCE_OPTIONS,
  PIPELINE_STAGES,
  COUNSELOR_OPTIONS,
} from "@/lib/demo-data";

export interface LeadsFilterState {
  searchQuery: string;
  source: string;
  stage: string;
  counselor: string;
}

interface LeadsFiltersProps {
  filters: LeadsFilterState;
  onChange: (filters: LeadsFilterState) => void;
  totalCount: number;
  filteredCount: number;
  onReset: () => void;
}

export function LeadsFilters({
  filters,
  onChange,
  totalCount,
  filteredCount,
  onReset,
}: LeadsFiltersProps) {
  const isFiltered =
    Boolean(filters.searchQuery.trim()) ||
    Boolean(filters.source) ||
    Boolean(filters.stage) ||
    Boolean(filters.counselor);

  return (
    <div className="space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-border-subtle shadow-subtle">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) =>
              onChange({ ...filters, searchQuery: e.target.value })
            }
            placeholder="Search by student name, phone, email, or lead ID..."
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

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 lg:w-auto">
          {/* Source Filter */}
          <div className="w-full sm:w-40">
            <Select
              value={filters.source}
              onChange={(e) =>
                onChange({ ...filters, source: e.target.value })
              }
              aria-label="Filter by Lead Source"
            >
              <option value="">All Sources</option>
              {SOURCE_OPTIONS.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </Select>
          </div>

          {/* Pipeline Stage Filter */}
          <div className="w-full sm:w-40">
            <Select
              value={filters.stage}
              onChange={(e) =>
                onChange({ ...filters, stage: e.target.value })
              }
              aria-label="Filter by Pipeline Stage"
            >
              <option value="">All Stages</option>
              {PIPELINE_STAGES.map((stg) => (
                <option key={stg} value={stg}>
                  {stg}
                </option>
              ))}
            </Select>
          </div>

          {/* Counsellor Filter */}
          <div className="w-full sm:w-40">
            <Select
              value={filters.counselor}
              onChange={(e) =>
                onChange({ ...filters, counselor: e.target.value })
              }
              aria-label="Filter by Counsellor"
            >
              <option value="">All Counsellors</option>
              {COUNSELOR_OPTIONS.map((cns) => (
                <option key={cns} value={cns}>
                  {cns}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onReset}
            className="text-xs text-text-secondary hover:text-text-primary h-9 px-2.5 gap-1 shrink-0 self-end lg:self-auto"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Filters
          </Button>
        )}
      </div>

      {/* Result Count Status Bar */}
      <div className="flex items-center justify-between text-xs text-text-secondary px-1">
        <span>
          Showing <strong className="text-text-primary font-semibold">{filteredCount}</strong> of{" "}
          <strong className="text-text-primary font-semibold">{totalCount}</strong> student inquiries
          {isFiltered && (
            <span className="ml-1 text-primary font-medium">(Filtered)</span>
          )}
        </span>
      </div>
    </div>
  );
}
