import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export default function FollowUpsPage() {
  return (
    <ModulePlaceholder
      title="Follow-ups & Reminders"
      moduleKey="follow-ups"
      description="Counselor scheduling desk for student calls, campus counseling visits, and demo sessions."
      plannedPhase="Phase 5: Follow-up Management"
      scopePoints={[
        "Overdue, Today, and Upcoming task filters for counselors.",
        "One-click call logging with outcome notes and next action date.",
        "Automated WhatsApp reminder triggers prior to scheduled counseling sessions.",
        "Supervisor view of missed or unaddressed inquiries.",
      ]}
    />
  );
}
