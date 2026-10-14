import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export default function LeadsPage() {
  return (
    <ModulePlaceholder
      title="All Leads Management"
      moduleKey="leads"
      description="Central registry for prospective student inquiries, counselor assignments, and contact details."
      plannedPhase="Phase 3: Lead Management"
      scopePoints={[
        "Search, filter, and sort student leads by date, source, counselor, and admission priority.",
        "Candidate qualification metadata: Life Sciences, Nursing, B.Pharm, or other graduation backgrounds.",
        "Quick status updates, lead notes log, and direct WhatsApp contact action.",
        "Lead import and CSV/Excel export for admissions auditing.",
      ]}
    />
  );
}
