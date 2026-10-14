"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GitBranch,
  CalendarClock,
  MessageSquare,
  Share2,
  BarChart3,
  GraduationCap,
  Settings,
  X,
  ShieldCheck,
  Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLeads } from "@/context/leads-context";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: "default" | "success" | "warning";
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "All Leads",
    href: "/leads",
    icon: Users,
  },
  {
    title: "Sales Pipeline",
    href: "/pipeline",
    icon: GitBranch,
  },
  {
    title: "Follow-ups",
    href: "/follow-ups",
    icon: CalendarClock,
    badge: "4 Due",
    badgeVariant: "warning",
  },
  {
    title: "WhatsApp Inbox",
    href: "/whatsapp",
    icon: MessageSquare,
    badge: "2 New",
    badgeVariant: "success",
  },
  {
    title: "Lead Sources",
    href: "/sources",
    icon: Share2,
  },
  {
    title: "Reports & Analytics",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Courses",
    href: "/courses",
    icon: GraduationCap,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { followUpSummary } = useLeads();
  const dueCount = followUpSummary.overdue + followUpSummary.today;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col bg-[#111827] text-white transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto border-r border-slate-800",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Institute & App Branding */}
        <div className="flex h-16 shrink-0 items-center justify-between px-5 border-b border-slate-800/80 bg-[#0B0F19]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-md ring-1 ring-white/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-white group-hover:text-blue-200 transition-colors">
                MedLead CRM
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Medical Coding Institute
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Admissions & Operations
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={cn(
                    "group flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-all select-none",
                    isActive
                      ? "bg-primary text-white shadow-sm shadow-primary/30"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                      )}
                    />
                    <span>{item.title}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        "px-1.5 py-0.5 text-[10px] font-semibold rounded",
                        isActive
                          ? "bg-white/20 text-white"
                          : item.badgeVariant === "success"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      )}
                    >
                      {item.href === "/follow-ups" ? `${dueCount} Due` : item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Counselor Desk Quick Info */}
        <div className="border-t border-slate-800/90 p-3 bg-[#0B0F19]/60">
          <div className="flex items-center gap-3 rounded-md px-2.5 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-slate-200 ring-2 ring-emerald-500/50">
              <Headphones className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="truncate text-xs font-medium text-slate-200">
                Counselor Helpline
              </span>
              <span className="truncate text-[10px] text-slate-400">
                WhatsApp Bot: Connected
              </span>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500" title="Bot Connected" />
          </div>
        </div>
      </aside>
    </>
  );
}
