"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { TopHeader } from "./top-header";

export interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-workspace font-sans text-text-primary antialiased">
      {/* Deep Navy Responsive Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Column */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <TopHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {/* Main Content Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
