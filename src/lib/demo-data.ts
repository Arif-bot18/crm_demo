/**
 * MedLead CRM - Demonstration Dataset
 *
 * NOTE: This is typed demonstration data used for MVP presentation
 * and UI validation before live database/API endpoints are connected.
 * Do not treat these records as live customer data.
 */

import { Lead, LeadActivity } from "@/types/crm";

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

export type RecentLeadRecord = Lead;

export type DateRangeOption = "Today" | "Last 7 days" | "This month" | "Last month";

export const SOURCE_OPTIONS = [
  "Justdial",
  "Instagram Organic",
  "Instagram Ads",
  "Facebook Organic",
  "Facebook Ads",
  "Google Ads",
  "Google Search",
  "WhatsApp",
  "Referral",
  "Walk-in",
  "Phone Call",
  "Other",
] as const;

export const COURSE_OPTIONS = [
  "Comprehensive Medical Coding",
  "CPC Exam Preparation",
  "Medical Billing & Coding",
  "Advanced ICD-10 Coding",
  "Medical Coding Foundation",
] as const;

export const PIPELINE_STAGES = [
  "New Lead",
  "Contacted",
  "Interested",
  "Counselling",
  "Fees Discussed",
  "Enrolled",
  "Lost",
] as const;

export const COUNSELOR_OPTIONS = [
  "Priya Sharma",
  "Dr. Sarah Chen",
  "Amit Patel",
  "Rajesh Kumar",
] as const;

export function getSourceBadgeVariant(
  source: string
): "default" | "success" | "warning" | "error" | "info" | "neutral" {
  const s = source.toLowerCase();
  if (s.includes("justdial")) return "warning";
  if (s.includes("instagram")) return "error";
  if (s.includes("facebook")) return "default";
  if (s.includes("google")) return "default";
  if (s.includes("whatsapp")) return "success";
  if (s.includes("referral")) return "neutral";
  if (s.includes("walk-in") || s.includes("walk in")) return "neutral";
  return "neutral";
}

export function getStageBadgeVariant(
  stage: string
): "default" | "success" | "warning" | "error" | "info" | "neutral" {
  switch (stage) {
    case "New Lead":
      return "default";
    case "Contacted":
      return "warning";
    case "Interested":
      return "info";
    case "Counselling":
      return "info";
    case "Fees Discussed":
      return "warning";
    case "Enrolled":
      return "success";
    case "Lost":
      return "error";
    default:
      return "neutral";
  }
}

/**
 * Normalizes phone numbers to standard 10 digits for accurate uniqueness comparison
 * Handles +91, 0 prefix, hyphens, and whitespace.
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  // If starts with 91 and has 12 digits (country code + 10 digits)
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return cleaned.slice(2);
  }
  // If starts with 0 and has 11 digits
  if (cleaned.length === 11 && cleaned.startsWith("0")) {
    return cleaned.slice(1);
  }
  return cleaned;
}

export function formatIndianPhoneNumber(rawPhone: string): string {
  const norm = normalizePhoneNumber(rawPhone);
  if (norm.length === 10) {
    return `+91 ${norm.slice(0, 5)} ${norm.slice(5)}`;
  }
  return rawPhone;
}

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

export const INITIAL_DEMO_LEADS: Lead[] = [
  {
    id: "LEAD-101",
    studentName: "Ahmed Khan",
    email: "ahmed.khan@example.com",
    phone: "+91 98451 23456",
    course: "Comprehensive Medical Coding",
    source: "Justdial",
    sourceBadgeVariant: "warning",
    campaignName: "Justdial Healthcare Portal",
    stage: "Interested",
    stageBadgeVariant: "info",
    counselor: "Priya Sharma",
    nextFollowUp: "Today, 2:30 PM",
    isOverdue: false,
    notes: "Interested in upcoming weekend batch. Has B.Sc Zoology background. Requested syllabus breakdown.",
    createdAt: "2026-10-12 10:15 AM",
    lastContactedAt: "2026-10-13 04:30 PM",
    activities: [
      {
        id: "ACT-1",
        type: "created",
        description: "Lead captured from Justdial verified portal inquiry",
        counselor: "System Automated",
        timestamp: "2026-10-12 10:15 AM",
      },
      {
        id: "ACT-2",
        type: "call",
        description: "Initial discovery call completed. Student confirmed medical science background.",
        counselor: "Priya Sharma",
        timestamp: "2026-10-13 04:30 PM",
        note: "Candidate is positive, asked about AAPC exam voucher cost.",
      },
    ],
  },
  {
    id: "LEAD-102",
    studentName: "Priya Sharma",
    email: "priya.student@example.com",
    phone: "+91 97123 45678",
    course: "CPC Exam Preparation",
    source: "Instagram Ads",
    sourceBadgeVariant: "error",
    campaignName: "IG_Oct_CPC_Prep",
    stage: "New Lead",
    stageBadgeVariant: "default",
    counselor: "Priya Sharma",
    nextFollowUp: "Today, 3:15 PM",
    isOverdue: false,
    notes: "Fresh inquiry submitted via Instagram lead form. Needs course overview and demo session link.",
    createdAt: "2026-10-14 09:20 AM",
    activities: [
      {
        id: "ACT-3",
        type: "created",
        description: "Inquiry generated from Instagram Lead Generation Campaign",
        counselor: "System Automated",
        timestamp: "2026-10-14 09:20 AM",
      },
    ],
  },
  {
    id: "LEAD-103",
    studentName: "Rahul Verma",
    email: "rahul.verma@example.com",
    phone: "+91 98204 56789",
    course: "Medical Billing & Coding",
    source: "Facebook Ads",
    sourceBadgeVariant: "default",
    campaignName: "FB_RCM_LeadGen",
    stage: "Counselling",
    stageBadgeVariant: "info",
    counselor: "Amit Patel",
    nextFollowUp: "Tomorrow, 11:00 AM",
    isOverdue: false,
    notes: "In-person campus counseling scheduled for tomorrow morning. Parent will attend.",
    createdAt: "2026-10-10 02:40 PM",
    lastContactedAt: "2026-10-12 11:00 AM",
    activities: [
      {
        id: "ACT-4",
        type: "created",
        description: "Inquiry received from Facebook Lead Ad",
        counselor: "System Automated",
        timestamp: "2026-10-10 02:40 PM",
      },
      {
        id: "ACT-5",
        type: "call",
        description: "Counselling session scheduled with student and parent.",
        counselor: "Amit Patel",
        timestamp: "2026-10-12 11:00 AM",
      },
    ],
  },
  {
    id: "LEAD-104",
    studentName: "Sana Begum",
    email: "sana.begum@example.com",
    phone: "+91 99887 65432",
    course: "Advanced ICD-10 Coding",
    source: "Referral",
    sourceBadgeVariant: "neutral",
    campaignName: "Alumni_Referral_Zoya",
    stage: "Enrolled",
    stageBadgeVariant: "success",
    counselor: "Dr. Sarah Chen",
    nextFollowUp: "Completed",
    isOverdue: false,
    notes: "Successfully enrolled for November batch. First installment fee paid via UPI.",
    createdAt: "2026-10-05 11:30 AM",
    lastContactedAt: "2026-10-13 02:00 PM",
    activities: [
      {
        id: "ACT-6",
        type: "created",
        description: "Direct referral by former student Zoya Khan (CPC Certified)",
        counselor: "Dr. Sarah Chen",
        timestamp: "2026-10-05 11:30 AM",
      },
      {
        id: "ACT-7",
        type: "stage_change",
        description: "Student submitted admission form and fee token. Stage moved to Enrolled.",
        counselor: "Dr. Sarah Chen",
        timestamp: "2026-10-13 02:00 PM",
      },
    ],
  },
  {
    id: "LEAD-105",
    studentName: "Vikram S",
    email: "vikram.sundaram@example.com",
    phone: "+91 98440 11223",
    course: "Medical Coding Foundation",
    source: "Google Ads",
    sourceBadgeVariant: "default",
    campaignName: "Search_MedicalCoding_Bangalore",
    stage: "Contacted",
    stageBadgeVariant: "warning",
    counselor: "Amit Patel",
    nextFollowUp: "Today, 5:00 PM",
    isOverdue: true,
    notes: "Spoke yesterday. Call disconnected during fee discussion. Needs urgent callback today.",
    createdAt: "2026-10-11 04:00 PM",
    lastContactedAt: "2026-10-13 05:15 PM",
    activities: [
      {
        id: "ACT-8",
        type: "created",
        description: "Google Search Ad click inquiry",
        counselor: "System Automated",
        timestamp: "2026-10-11 04:00 PM",
      },
      {
        id: "ACT-9",
        type: "call",
        description: "Follow-up call disconnected. Scheduled callback.",
        counselor: "Amit Patel",
        timestamp: "2026-10-13 05:15 PM",
      },
    ],
  },
  {
    id: "LEAD-106",
    studentName: "Divya Nair",
    email: "divya.nair@example.com",
    phone: "+91 98112 33445",
    course: "Comprehensive Medical Coding",
    source: "WhatsApp",
    sourceBadgeVariant: "success",
    campaignName: "WA_Chatbot_Direct",
    stage: "Fees Discussed",
    stageBadgeVariant: "warning",
    counselor: "Priya Sharma",
    nextFollowUp: "Oct 16, 10:30 AM",
    isOverdue: false,
    notes: "Fee installment plan approved by center director. Sent fee link on WhatsApp.",
    createdAt: "2026-10-08 01:15 PM",
    lastContactedAt: "2026-10-13 03:00 PM",
    activities: [
      {
        id: "ACT-10",
        type: "whatsapp",
        description: "Initiated automated chatbot chat on WhatsApp, transferred to counselor",
        counselor: "WhatsApp Bot",
        timestamp: "2026-10-08 01:15 PM",
      },
      {
        id: "ACT-11",
        type: "note",
        description: "Fee installment plan approved: 2 payments of ₹22,500.",
        counselor: "Priya Sharma",
        timestamp: "2026-10-13 03:00 PM",
      },
    ],
  },
  {
    id: "LEAD-107",
    studentName: "Deepa Krishnan",
    email: "deepa.k@example.com",
    phone: "+91 97334 55667",
    course: "CPC Exam Preparation",
    source: "Walk-in",
    sourceBadgeVariant: "neutral",
    campaignName: "Campus_Direct_Visit",
    stage: "Contacted",
    stageBadgeVariant: "default",
    counselor: "Dr. Sarah Chen",
    nextFollowUp: "Oct 16, 2:00 PM",
    isOverdue: false,
    notes: "Visited institute with parent. Currently working as hospital pharmacist, looking for CPC career growth.",
    createdAt: "2026-10-13 03:30 PM",
    lastContactedAt: "2026-10-13 04:00 PM",
    activities: [
      {
        id: "ACT-12",
        type: "created",
        description: "Direct walk-in visit at center front desk",
        counselor: "Dr. Sarah Chen",
        timestamp: "2026-10-13 03:30 PM",
      },
    ],
  },
];

export const DEMO_RECENT_LEADS: Lead[] = INITIAL_DEMO_LEADS;
