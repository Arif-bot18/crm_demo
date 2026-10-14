import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export default function ReportsPage() {
  return (
    <ModulePlaceholder
      title="Reports & Admission Analytics"
      moduleKey="reports"
      description="Executive analytics for conversion rates, counselor performance, revenue forecasts, and marketing ROI."
      plannedPhase="Phase 8: Reports & Reporting"
      scopePoints={[
        "Monthly and batch-wise admission conversion funnel.",
        "Counselor performance metrics: average response time, call volume, closure rate.",
        "Source effectiveness: Justdial vs. Digital Ads vs. Organic Referrals.",
        "Attendance management is explicitly excluded as specified in project scope.",
      ]}
    />
  );
}
