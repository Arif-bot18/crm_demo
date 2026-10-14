"use client";

import * as React from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Bell,
  Plus,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopHeaderProps {
  onToggleSidebar: () => void;
}

export function TopHeader({ onToggleSidebar }: TopHeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border-subtle bg-white px-4 sm:px-6 shadow-subtle">
      {/* Left: Mobile hamburger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="rounded-md p-2 text-text-secondary hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search Field */}
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by student name, phone, or ID..."
            className="w-full rounded-md border border-border-subtle bg-slate-50/70 pl-9 pr-12 py-1.5 text-xs text-text-primary placeholder:text-text-muted transition-colors focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center">
            <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Quick Actions, Notifications, Counselor Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Add Lead Button */}
        <Link href="/leads">
          <Button
            size="sm"
            className="hidden sm:inline-flex bg-primary hover:bg-primary-hover text-white shadow-subtle text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Lead
          </Button>
        </Link>

        {/* Notification Bell */}
        <div className="relative">
          <button
            className="relative rounded-md p-2 text-text-secondary hover:bg-slate-100 hover:text-text-primary transition-colors"
            aria-label="Notifications"
            title="Follow-up reminders"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-warning opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-status-warning"></span>
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="hidden sm:block h-6 w-[1px] bg-border-subtle" />

        {/* Counselor Profile Menu */}
        <div className="flex items-center gap-2.5 pl-1 cursor-pointer select-none group">
          <div className="relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-semibold ring-2 ring-slate-100 group-hover:ring-primary/30 transition-all">
              PS
            </div>
            <span
              className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-status-success ring-2 ring-white"
              title="Online"
            />
          </div>

          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-text-primary leading-tight">
              Priya Sharma
            </span>
            <span className="text-[10px] text-text-secondary leading-tight">
              Senior Counselor
            </span>
          </div>

          <ChevronDown className="hidden md:block h-3.5 w-3.5 text-text-muted group-hover:text-text-secondary transition-colors" />
        </div>
      </div>
    </header>
  );
}
