/**
 * MedLead CRM - Core Domain Types
 * Medical Coding Institute CRM
 */

export type LeadSource =
  | "justdial"
  | "instagram"
  | "facebook"
  | "google"
  | "whatsapp"
  | "referral"
  | "walk_in"
  | "website"
  | "other";

export interface LeadSourceMetadata {
  id: LeadSource;
  label: string;
  category: "digital_ad" | "social" | "direct" | "aggregator" | "offline";
  colorBadge: string;
}

export type PipelineStage =
  | "new_inquiry"
  | "contacted"
  | "counseling_scheduled"
  | "counseling_completed"
  | "documents_pending"
  | "fee_pending"
  | "enrolled"
  | "lost";

export interface PipelineStageConfig {
  id: PipelineStage;
  label: string;
  order: number;
  description: string;
  badgeVariant: "info" | "warning" | "success" | "error" | "neutral";
}

export type LeadPriority = "low" | "medium" | "high" | "urgent";

export interface Counselor {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "counselor" | "senior_counselor" | "admission_head" | "admin";
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  city?: string;
  educationBackground?: string; // e.g. B.Pharm, Life Sciences, B.Sc Nursing, General Graduate
  targetCourseId?: string; // e.g. CPC Prep, Comprehensive Medical Coding
  courseName?: string;
  source: LeadSource;
  sourceCampaign?: string;
  stage: PipelineStage;
  priority: LeadPriority;
  assignedCounselor?: Counselor;
  estimatedFee?: number;
  nextFollowUpAt?: string;
  tags?: string[];
  notesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type FollowUpType = "call" | "whatsapp" | "campus_visit" | "email" | "online_meeting";
export type FollowUpStatus = "scheduled" | "completed" | "missed" | "rescheduled" | "cancelled";

export interface FollowUp {
  id: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  counselorId: string;
  counselorName: string;
  scheduledAt: string;
  type: FollowUpType;
  status: FollowUpStatus;
  notes?: string;
  outcome?: string;
  createdAt: string;
  completedAt?: string;
}

export type MessageSender = "student" | "bot" | "counselor";

export interface WhatsAppMessage {
  id: string;
  conversationId: string;
  sender: MessageSender;
  text: string;
  timestamp: string;
  deliveryStatus?: "sent" | "delivered" | "read";
}

export interface WhatsAppConversation {
  id: string;
  leadId?: string;
  phoneNumber: string;
  studentName: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  status: "bot_handling" | "counselor_active" | "resolved" | "archived";
  assignedCounselorId?: string;
  messages?: WhatsAppMessage[];
}

export interface Course {
  id: string;
  title: string;
  code: string; // e.g. CPC-2026
  durationWeeks: number;
  standardFee: number;
  certificationBody: "AAPC" | "AHIMA" | "Internal Certificate";
  isActive: boolean;
}
