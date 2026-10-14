import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export default function SourcesPage() {
  return (
    <ModulePlaceholder
      title="Lead Source Attribution"
      moduleKey="sources"
      description="Channel-wise attribution tracking for Justdial, Meta ads, Google ads, WhatsApp, referrals, and walk-ins."
      plannedPhase="Phase 7: Lead Sources"
      scopePoints={[
        "Justdial lead webhook receiver and API integration.",
        "Meta & Google ad campaign attribution with UTM parameters.",
        "Student referral rewards and offline walk-in logging.",
        "Cost-per-lead (CPL) and source conversion efficiency metrics.",
      ]}
    />
  );
}
