"use client";

import * as React from "react";
import { PageContainer } from "@/components/ui/page-header";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { LeadSourceChart } from "@/components/dashboard/lead-source-chart";
import { PipelineBarChart } from "@/components/dashboard/pipeline-bar-chart";
import { RecentLeadsTable } from "@/components/dashboard/recent-leads-table";
import { QuickInsight } from "@/components/dashboard/quick-insight";
import {
  DateRangeOption,
  DEMO_SUMMARY_DATA,
  DEMO_LEAD_SOURCES,
  DEMO_PIPELINE_STAGES,
  DEMO_RECENT_LEADS,
} from "@/lib/demo-data";

export default function DashboardPage() {
  const [selectedRange, setSelectedRange] = React.useState<DateRangeOption>("This month");

  const currentSummary = DEMO_SUMMARY_DATA[selectedRange] || DEMO_SUMMARY_DATA["This month"];

  return (
    <PageContainer className="space-y-6">
      {/* 1. Header with Interactive Date Range Selector */}
      <DashboardHeader
        selectedRange={selectedRange}
        onRangeChange={setSelectedRange}
      />

      {/* 2. Four Key Summary Cards */}
      <SummaryCards data={currentSummary} />

      {/* 3. Visual Charts Grid (Lead Sources Donut & Admission Pipeline Bars) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <LeadSourceChart sources={DEMO_LEAD_SOURCES} />
        <PipelineBarChart stages={DEMO_PIPELINE_STAGES} />
      </div>

      {/* 4. Full-Width Recent Leads Table */}
      <RecentLeadsTable leads={DEMO_RECENT_LEADS} />

      {/* 5. Compact Quick Insight Panel */}
      <QuickInsight />
    </PageContainer>
  );
}
