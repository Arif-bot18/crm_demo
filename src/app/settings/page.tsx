import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export default function SettingsPage() {
  return (
    <ModulePlaceholder
      title="Institute & System Settings"
      moduleKey="settings"
      description="Configure counselors, admission target quotas, webhook credentials, and WhatsApp business API."
      plannedPhase="Phase 10: System Configuration"
      scopePoints={[
        "Counselor user accounts and lead round-robin distribution rules.",
        "WhatsApp Business Cloud API tokens & webhook verification secret.",
        "Justdial Lead API credentials and endpoint mapping.",
        "Institute branding, communication templates, and notification preferences.",
      ]}
    />
  );
}
