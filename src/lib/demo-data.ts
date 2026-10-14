/**
 * MedLead CRM - Demonstration Dataset
 *
 * NOTE: This is typed demonstration data used for MVP presentation
 * and UI validation before live database/API endpoints are connected.
 * Do not treat these records as live customer data.
 */

export interface DashboardSummaryData {
  totalLeads: number;
  newLeadsToday: number;
  followUpsDue: number;
  admissions: number;
}

export interface LeadSourceBreakdown {
  id: string;
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface PipelineStageBreakdown {
  stage: string;
  count: number;
  color: string;
}

export interface RecentLeadRecord {
  id: string;
  studentName: string;
  phone: string;
  course: string;
  source: string;
  sourceBadgeVariant: "default" | "success" | "warning" | "error" | "info" | "neutral";
  stage: string;
  stageBadgeVariant: "default" | "success" | "warning" | "error" | "info" | "neutral";
  counselor: string;
  nextFollowUp: string;
  isOverdue?: boolean;
}

export type DateRangeOption = "Today" | "Last 7 days" | "This month" | "Last month";

export const DEMO_SUMMARY_DATA: Record<DateRangeOption, DashboardSummaryData> = {
  "Today": {
    totalLeads: 18,
    newLeadsToday: 18,
    followUpsDue: 12,
    admissions: 3,
  },
  "Last 7 days": {
    totalLeads: 74,
    newLeadsToday: 18,
    followUpsDue: 12,
    admissions: 11,
  },
  "This month": {
    totalLeads: 248,
    newLeadsToday: 18,
    followUpsDue: 12,
    admissions: 36,
  },
  "Last month": {
    totalLeads: 215,
    newLeadsToday: 0,
    followUpsDue: 0,
    admissions: 42,
  },
};

export const DEMO_LEAD_SOURCES: LeadSourceBreakdown[] = [
  { id: "justdial", name: "Justdial", count: 62, percentage: 25.0, color: "#EA580C" },
  { id: "instagram", name: "Instagram Ads", count: 48, percentage: 19.4, color: "#DB2777" },
  { id: "google", name: "Google Ads", count: 38, percentage: 15.3, color: "#2563EB" },
  { id: "whatsapp", name: "WhatsApp", count: 34, percentage: 13.7, color: "#16A34A" },
  { id: "facebook", name: "Facebook Ads", count: 28, percentage: 11.3, color: "#4F46E5" },
  { id: "referral", name: "Referral", count: 18, percentage: 7.3, color: "#7C3AED" },
  { id: "walk_in", name: "Walk-in", count: 12, percentage: 4.8, color: "#0D9488" },
  { id: "other", name: "Other", count: 8, percentage: 3.2, color: "#64748B" },
];

export const DEMO_PIPELINE_STAGES: PipelineStageBreakdown[] = [
  { stage: "New Lead", count: 42, color: "#3B82F6" },
  { stage: "Contacted", count: 58, color: "#06B6D4" },
  { stage: "Interested", count: 46, color: "#6366F1" },
  { stage: "Counselling", count: 34, color: "#8B5CF6" },
  { stage: "Fees Discussed", count: 22, color: "#F59E0B" },
  { stage: "Enrolled", count: 36, color: "#16A34A" },
  { stage: "Lost", count: 10, color: "#EF4444" },
];

export const DEMO_RECENT_LEADS: RecentLeadRecord[] = [
  {
    id: "LEAD-101",
    studentName: "Ahmed Khan",
    phone: "+91 98451 23456",
    course: "Comprehensive Medical Coding",
    source: "Justdial",
    sourceBadgeVariant: "warning",
    stage: "Interested",
    stageBadgeVariant: "info",
    counselor: "Priya Sharma",
    nextFollowUp: "Today, 2:30 PM",
    isOverdue: false,
  },
  {
    id: "LEAD-102",
    studentName: "Priya Sharma",
    phone: "+91 97123 45678",
    course: "CPC Exam Preparation",
    source: "Instagram Ads",
    sourceBadgeVariant: "error",
    stage: "New Lead",
    stageBadgeVariant: "default",
    counselor: "Priya Sharma",
    nextFollowUp: "Today, 3:15 PM",
    isOverdue: false,
  },
  {
    id: "LEAD-103",
    studentName: "Rahul Verma",
    phone: "+91 98204 56789",
    course: "Medical Billing & Coding",
    source: "Facebook Ads",
    sourceBadgeVariant: "default",
    stage: "Counselling",
    stageBadgeVariant: "info",
    counselor: "Amit Patel",
    nextFollowUp: "Tomorrow, 11:00 AM",
    isOverdue: false,
  },
  {
    id: "LEAD-104",
    studentName: "Sana Begum",
    phone: "+91 99887 65432",
    course: "Advanced ICD-10 Coding",
    source: "Referral",
    sourceBadgeVariant: "neutral",
    stage: "Enrolled",
    stageBadgeVariant: "success",
    counselor: "Dr. Sarah Chen",
    nextFollowUp: "Completed",
    isOverdue: false,
  },
  {
    id: "LEAD-105",
    studentName: "Vikram S",
    phone: "+91 98440 11223",
    course: "Medical Coding Foundation",
    source: "Google Ads",
    sourceBadgeVariant: "default",
    stage: "Contacted",
    stageBadgeVariant: "warning",
    counselor: "Amit Patel",
    nextFollowUp: "Today, 5:00 PM",
    isOverdue: true,
  },
  {
    id: "LEAD-106",
    studentName: "Divya Nair",
    phone: "+91 98112 33445",
    course: "Comprehensive Medical Coding",
    source: "WhatsApp",
    sourceBadgeVariant: "success",
    stage: "Fees Discussed",
    stageBadgeVariant: "warning",
    counselor: "Priya Sharma",
    nextFollowUp: "Oct 16, 10:30 AM",
    isOverdue: false,
  },
  {
    id: "LEAD-107",
    studentName: "Deepa Krishnan",
    phone: "+91 97334 55667",
    course: "CPC Exam Preparation",
    source: "Walk-in",
    sourceBadgeVariant: "neutral",
    stage: "Contacted",
    stageBadgeVariant: "default",
    counselor: "Dr. Sarah Chen",
    nextFollowUp: "Oct 16, 2:00 PM",
    isOverdue: false,
  },
];
