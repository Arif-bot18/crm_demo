import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export default function WhatsAppPage() {
  return (
    <ModulePlaceholder
      title="WhatsApp Chatbot & Inbox"
      moduleKey="whatsapp"
      description="Two-way student conversation threads connecting existing chatbot logic with human counselor desk."
      plannedPhase="Phase 6: WhatsApp Integration"
      scopePoints={[
        "Real-time incoming inquiries received via webhook.",
        "Chatbot auto-response state vs. Counselor handover state toggle.",
        "Quick template responses for fee structure, syllabus PDF, and batch timings.",
        "Full conversation transcript linked to the student's CRM profile.",
      ]}
    />
  );
}
