/**
 * MedLead CRM - Date and Time Utilities
 * Local calendar day and timestamp comparisons for follow-ups and reminders
 */

export function parseDate(dateInput: string | Date | undefined | null): Date | null {
  if (!dateInput) return null;
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return isNaN(d.getTime()) ? null : d;
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function isToday(dateInput: string | Date): boolean {
  const d = parseDate(dateInput);
  if (!d) return false;
  return isSameDay(d, new Date());
}

export function isTomorrow(dateInput: string | Date): boolean {
  const d = parseDate(dateInput);
  if (!d) return false;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isSameDay(d, tomorrow);
}

export function isYesterday(dateInput: string | Date): boolean {
  const d = parseDate(dateInput);
  if (!d) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(d, yesterday);
}

export function isOverdue(dateInput: string | Date): boolean {
  const d = parseDate(dateInput);
  if (!d) return false;
  return d.getTime() < Date.now();
}

/**
 * Returns true if date is after the end of the current local calendar day (after 23:59:59.999 today)
 */
export function isUpcoming(dateInput: string | Date): boolean {
  const d = parseDate(dateInput);
  if (!d) return false;
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  return d.getTime() > endOfToday.getTime();
}

/**
 * Clean human-readable display of date and time
 * e.g., "Today, 3:15 PM" or "Tomorrow, 11:00 AM" or "Oct 16, 2026, 2:00 PM"
 */
export function formatFollowUpDate(dateInput: string | Date | undefined): string {
  const d = parseDate(dateInput);
  if (!d) return dateInput ? String(dateInput) : "Not Scheduled";

  const timeString = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday(d)) {
    return `Today, ${timeString}`;
  }
  if (isTomorrow(d)) {
    return `Tomorrow, ${timeString}`;
  }
  if (isYesterday(d)) {
    return `Yesterday, ${timeString}`;
  }

  const dateString = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });

  return `${dateString}, ${timeString}`;
}

/**
 * Format Date object to "YYYY-MM-DDTHH:mm" for <input type="datetime-local" />
 */
export function toDateTimeLocalString(date: Date): string {
  const pad = (num: number) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export type TimingStatus = "overdue" | "today" | "upcoming" | "completed" | "cancelled";

export function getTaskTimingStatus(
  scheduledAt: string,
  status: "Pending" | "Completed" | "Cancelled"
): TimingStatus {
  if (status === "Completed") return "completed";
  if (status === "Cancelled") return "cancelled";

  const d = parseDate(scheduledAt);
  if (!d) return "upcoming";

  if (isOverdue(d)) return "overdue";
  if (isToday(d)) return "today";
  return "upcoming";
}
