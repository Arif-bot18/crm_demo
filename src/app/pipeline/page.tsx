import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export default function PipelinePage() {
  return (
    <ModulePlaceholder
      title="Admission Sales Pipeline"
      moduleKey="pipeline"
      description="Visual Kanban and table pipeline tracking student conversions across admission stages."
      plannedPhase="Phase 4: Sales Pipeline"
      scopePoints={[
        "Kanban columns: New Inquiry → Contacted → Counseling Scheduled → Counseling Done → Documents Pending → Fee Pending → Enrolled → Lost.",
        "Drag-and-drop or one-click stage progression with fee collection status.",
        "Drop-off reason tracking (fee constraint, location, timing, competitor).",
        "Stage velocity and bottle-neck detection for counselor performance.",
      ]}
    />
  );
}
