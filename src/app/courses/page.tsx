import { ModulePlaceholder } from "@/components/layout/module-placeholder";

export default function CoursesPage() {
  return (
    <ModulePlaceholder
      title="Courses & Programs"
      moduleKey="courses"
      description="Medical Coding Institute program catalog, certification tracks, batch timelines, and standard fees."
      plannedPhase="Phase 9: Course Catalog"
      scopePoints={[
        "Course catalog: CPC Prep, Comprehensive Medical Coding, Medical Billing & Revenue Cycle, Advanced ICD-10.",
        "Batch schedules (Weekday / Weekend / Online batches).",
        "Fee structures, certification exam fees (AAPC / AHIMA), and installment options.",
        "Course syllabus and brochure quick-send links for counselors.",
      ]}
    />
  );
}
