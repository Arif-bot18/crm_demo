"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FollowUpHeaderProps {
  onScheduleClick: () => void;
}

export function FollowUpHeader({ onScheduleClick }: FollowUpHeaderProps) {
  return (
    <div className="space-y-3 pb-2 border-b border-border-subtle/80">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-1.5 text-xs text-text-muted">
        <Link href="/" className="hover:text-primary transition-colors font-medium">
          Dashboard
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-text-secondary">Follow-ups & Reminders</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Follow-ups & Reminders
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Stay on top of student inquiries and never miss a scheduled follow-up.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            size="sm"
            onClick={onScheduleClick}
            className="text-xs gap-1.5 h-9 bg-primary hover:bg-primary-hover text-white shadow-subtle"
          >
            <Plus className="h-4 w-4" />
            Schedule Follow-up
          </Button>
        </div>
      </div>

      {/* Counselor Workflow Notice */}
      <div className="flex items-center gap-2 p-2.5 rounded-md bg-slate-50 border border-border-subtle text-xs text-text-secondary">
        <Info className="h-4 w-4 text-primary shrink-0" />
        <span>
          This module tracks the planned contact schedule for each prospective student. Follow-ups are conducted directly by counselors via call, WhatsApp, or email.
        </span>
      </div>
    </div>
  );
}
