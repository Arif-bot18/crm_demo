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

export type PipelineStageName =
  | "New Lead"
  | "Contacted"
  | "Interested"
  | "Counselling"
  | "Fees Discussed"
  | "Enrolled"
  | "Lost";

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

export interface LeadActivity {
  id: string;
  type: "created" | "stage_change" | "call" | "whatsapp" | "note";
  description: string;
  counselor: string;
  timestamp: string;
  note?: string;
}

export interface Lead {
  id: string;
  studentName: string;
  name?: string; // alias for studentName
  email: string;
  phone: string;
  alternatePhone?: string;
  city?: string;
  educationBackground?: string; // e.g. B.Pharm, Life Sciences, B.Sc Nursing, General Graduate
  course: string;
  targetCourseId?: string;
  courseName?: string;
  source: string;
  sourceBadgeVariant?: "default" | "success" | "warning" | "error" | "info" | "neutral";
  campaignId?: string;
  campaignName?: string;
  sourceCampaign?: string;
  stage: string;
  stageBadgeVariant?: "default" | "success" | "warning" | "error" | "info" | "neutral";
  priority?: LeadPriority;
  counselor: string;
  assignedCounselor?: Counselor;
  estimatedFee?: number;
  nextFollowUp: string;
  nextFollowUpAt?: string;
  isOverdue?: boolean;
  tags?: string[];
  notes?: string;
  notesCount?: number;
  createdAt: string;
  updatedAt?: string;
  lastContactedAt?: string;
  activities?: LeadActivity[];
}

export type LeadRecord = Lead;

export type FollowUpMethod = "Phone Call" | "WhatsApp" | "Email" | "Other";
export type FollowUpTaskStatus = "Pending" | "Completed" | "Cancelled";

export interface FollowUpTask {
  id: string;
  leadId: string;
  scheduledAt: string; // ISO 8601 string, e.g. "2026-10-14T14:30:00"
  method: FollowUpMethod;
  notes?: string;
  assignedCounsellor: string;
  status: FollowUpTaskStatus;
  completedAt?: string;
  completionNotes?: string;
  createdAt: string;
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

// ==========================================
// Lead Sources & Campaign Tracking Types
// ==========================================

export type LeadSourceCategory =
  | "Aggregator"
  | "Social Ads"
  | "Search Ads"
  | "Direct / Messaging"
  | "Referral"
  | "Offline"
  | "Website"
  | "Other";

export interface ManagedLeadSource {
  id: string; // e.g. "SRC-JUSTDIAL"
  name: string; // e.g. "Justdial", "Instagram Ads"
  category: LeadSourceCategory;
  badgeVariant: "default" | "success" | "warning" | "error" | "info" | "neutral";
  isActive: boolean;
  description?: string;
  createdAt: string;
}

export type CampaignStatus = "Planned" | "Active" | "Completed" | "Paused";

export interface MarketingCampaign {
  id: string; // e.g. "CAMP-101"
  name: string; // e.g. "IG_Oct_CPC_Prep"
  sourceId: string; // references ManagedLeadSource.id
  sourceName: string; // denormalized for easy lookup
  startDate: string; // YYYY-MM-DD or ISO
  endDate?: string;
  budget: number; // Planned budget in INR
  status: CampaignStatus;
  targetAudience?: string;
  notes?: string;
  createdAt: string;
}

export interface SourcePerformanceMetric {
  sourceId: string;
  sourceName: string;
  category: LeadSourceCategory;
  badgeVariant: "default" | "success" | "warning" | "error" | "info" | "neutral";
  isActive: boolean;
  totalLeads: number;
  enrolledCount: number;
  conversionRate: number; // e.g. 15.4%
  activeCampaignsCount: number;
}

export interface CampaignPerformanceMetric {
  campaignId: string;
  campaignName: string;
  sourceId: string;
  sourceName: string;
  startDate: string;
  endDate?: string;
  budget: number;
  status: CampaignStatus;
  totalLeads: number;
  enrolledCount: number;
  conversionRate: number; // e.g. 20.0%
  costPerLead: number | null; // budget / totalLeads, null if 0 leads
}

export interface SourcesSummaryMetrics {
  totalSources: number;
  activeSources: number;
  totalCampaigns: number;
  activeCampaigns: number;
  attributedLeads: number;
  enrolledAdmissions: number;
  totalBudget: number;
  avgConversionRate: number;
}
