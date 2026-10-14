import { Lead } from "@/types/crm";

/**
 * Exports an array of Lead objects to a cleanly formatted RFC 4180 CSV file.
 * Handles commas, quotation marks, and line breaks safely.
 */
export function exportLeadsToCSV(leads: Lead[], filename = "medlead-leads.csv") {
  if (leads.length === 0) {
    alert("No leads match the current filters to export.");
    return;
  }

  const headers = [
    "Lead ID",
    "Student Name",
    "Phone",
    "Email",
    "Course Interest",
    "Lead Source",
    "Campaign",
    "Pipeline Stage",
    "Assigned Counsellor",
    "Next Follow-up",
    "Created Date",
    "Notes",
  ];

  const escapeCell = (val: string | number | boolean | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const stringVal = String(val).replace(/"/g, '""');
    return `"${stringVal}"`;
  };

  const rows = leads.map((lead) =>
    [
      escapeCell(lead.id),
      escapeCell(lead.studentName),
      escapeCell(lead.phone),
      escapeCell(lead.email),
      escapeCell(lead.course),
      escapeCell(lead.source),
      escapeCell(lead.campaignName || "Direct"),
      escapeCell(lead.stage),
      escapeCell(lead.counselor),
      escapeCell(lead.nextFollowUp),
      escapeCell(lead.createdAt),
      escapeCell(lead.notes || ""),
    ].join(",")
  );

  // UTF-8 BOM (\uFEFF) ensures special characters and Excel formatting render correctly
  const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
