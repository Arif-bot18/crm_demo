"use client";

import * as React from "react";
import Link from "next/link";
import {
  Kanban,
  Table as TableIcon,
  Search,
  X,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type PipelineViewMode = "kanban" | "table";

interface PipelineHeaderProps {
  viewMode: PipelineViewMode;
  onViewModeChange: (mode: PipelineViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalFiltered: number;
  totalLeads: number;
}

export function PipelineHeader({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  totalFiltered,
  totalLeads,
}: PipelineHeaderProps) {
  return (
    <div className="space-y-4 pb-2 border-b border-border-subtle/80">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-1.5 text-xs text-text-muted">
        <Link href="/" className="hover:text-primary transition-colors font-medium">
          Dashboard
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-text-secondary">Admission Pipeline</span>
      </nav>

      {/* Main Title & Action Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Admission Pipeline
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Track student inquiries from their first contact to enrollment.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          {/* View Toggle */}
          <div className="inline-flex items-center rounded-lg border border-border-subtle bg-slate-100 p-0.5 text-xs">
            <button
              onClick={() => onViewModeChange("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === "kanban"
                  ? "bg-white text-primary shadow-subtle"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              aria-label="Switch to Kanban View"
            >
              <Kanban className="h-3.5 w-3.5" />
              Kanban
            </button>
            <button
              onClick={() => onViewModeChange("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                viewMode === "table"
                  ? "bg-white text-primary shadow-subtle"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              aria-label="Switch to Table View"
            >
              <TableIcon className="h-3.5 w-3.5" />
              Table
            </button>
          </div>

          {/* Link to All Leads */}
          <Link href="/leads">
            <Button size="sm" variant="outline" className="text-xs gap-1.5 h-9">
              <Users className="h-3.5 w-3.5 text-text-muted" />
              All Leads
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search leads by student name, phone, or ID..."
            className="w-full rounded-md border border-border-subtle bg-white pl-8 pr-8 py-1.5 text-xs text-text-primary placeholder:text-text-muted transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-subtle"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status Counter */}
        <div className="text-xs text-text-secondary shrink-0">
          Showing <strong className="text-text-primary font-semibold">{totalFiltered}</strong> of{" "}
          <strong className="text-text-primary font-semibold">{totalLeads}</strong> leads
          {searchQuery && (
            <span className="ml-1 text-primary font-medium">(Filtered)</span>
          )}
        </div>
      </div>
    </div>
  );
}
