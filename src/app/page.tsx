"use client";

import * as React from "react";
import { PageContainer } from "@/components/ui/page-header";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { LeadSourceChart } from "@/components/dashboard/lead-source-chart";
import { PipelineBarChart } from "@/components/dashboard/pipeline-bar-chart";
import { RecentLeadsTable } from "@/components/dashboard/recent-leads-table";
import { QuickInsight } from "@/components/dashboard/quick-insight";
import { useLeads } from "@/context/leads-context";
import {
  DateRangeOption,
  DEMO_SUMMARY_DATA,
  DEMO_LEAD_SOURCES,
  DEMO_PIPELINE_STAGES,
} from "@/lib/demo-data";

export default function DashboardPage() {
  const { leads } = useLeads();
  const [selectedRange, setSelectedRange] = React.useState<DateRangeOption>("This month");

  const currentSummary = DEMO_SUMMARY_DATA[selectedRange] || DEMO_SUMMARY_DATA["This month"];

  // Dynamically calculate pipeline stages from shared leads state
  const dynamicPipelineStages = React.useMemo(() => {
    return DEMO_PIPELINE_STAGES.map((stageItem) => ({
      ...stageItem,
      count: leads.filter((l) => l.stage === stageItem.stage).length,
    }));
  }, [leads]);

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
        <PipelineBarChart stages={dynamicPipelineStages} />
      </div>

      {/* 4. Full-Width Recent Leads Table from Shared State */}
      <RecentLeadsTable leads={leads.slice(0, 7)} />

      {/* 5. Compact Quick Insight Panel */}
      <QuickInsight />
    </PageContainer>
  );
}
