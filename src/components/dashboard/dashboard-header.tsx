"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import { DateRangeOption } from "@/lib/demo-data";

interface DashboardHeaderProps {
  selectedRange: DateRangeOption;
  onRangeChange: (range: DateRangeOption) => void;
}

const DATE_OPTIONS: DateRangeOption[] = [
  "Today",
  "Last 7 days",
  "This month",
  "Last month",
];

export function DashboardHeader({
  selectedRange,
  onRangeChange,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border-subtle/80">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Dashboard
        </h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Here&apos;s what&apos;s happening with your leads and admissions.
        </p>
      </div>

      {/* Date-Range Selector */}
      <div className="flex items-center gap-2 self-start sm:self-auto">
        <div className="relative inline-flex items-center">
          <Calendar className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-text-muted" />
          <select
            value={selectedRange}
            onChange={(e) => onRangeChange(e.target.value as DateRangeOption)}
            className="h-9 appearance-none rounded-md border border-border-subtle bg-white pl-8 pr-8 py-1.5 text-xs font-medium text-text-primary shadow-subtle transition-colors hover:border-slate-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Filter dashboard by date range"
          >
            {DATE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-2.5 flex items-center text-text-muted">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
