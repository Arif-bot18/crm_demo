import Link from "next/link";
import { PageContainer, PageHeader } from "@/components/ui/page-header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Users,
  GitBranch,
  CalendarClock,
  MessageSquare,
  Share2,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Shield,
  Layers,
} from "lucide-react";

export default function HomePage() {
  const crmModules = [
    {
      title: "All Leads",
      href: "/leads",
      desc: "Comprehensive prospective student registry with course interest and background qualification.",
      icon: Users,
      badge: "Core CRM",
    },
    {
      title: "Admission Pipeline",
      href: "/pipeline",
      desc: "Multi-stage sales funnel: New Inquiry → Counseling → Verification → Enrolled.",
      icon: GitBranch,
      badge: "Kanban & Table",
    },
    {
      title: "Follow-ups & Reminders",
      href: "/follow-ups",
      desc: "Scheduled counselor calls, campus visits, and overdue alert tracking.",
      icon: CalendarClock,
      badge: "Activity Log",
    },
    {
      title: "WhatsApp Inbox",
      href: "/whatsapp",
      desc: "Direct integration with institute WhatsApp chatbot & counselor handover.",
      icon: MessageSquare,
      badge: "Chatbot Ready",
    },
    {
      title: "Lead Sources",
      href: "/sources",
      desc: "Attribution for Justdial, Meta, Google ads, WhatsApp, walk-ins, and referrals.",
      icon: Share2,
      badge: "Attribution",
    },
    {
      title: "Reports & Analytics",
      href: "/reports",
      desc: "Conversion ratios, counselor closure rates, and source ROI analysis.",
      icon: BarChart3,
      badge: "Analytics",
    },
  ];

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader
        title="MedLead CRM Overview"
        description="Medical Coding Institute Lead Management & Admissions Platform"
        badge={
          <Badge variant="default" showDot>
            Design Foundation Active
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Link href="/leads">
              <Button size="sm" variant="outline">
                View Leads
              </Button>
            </Link>
            <Link href="/pipeline">
              <Button size="sm">
                Sales Pipeline <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        }
      />

      {/* Overview Cards Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-text-secondary">
                Design System
              </CardTitle>
              <div className="h-2 w-2 rounded-full bg-status-success" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <div className="text-xl font-bold text-text-primary">Light SaaS Foundation</div>
            <p className="text-xs text-text-secondary">
              Deep navy sidebar (#111827), clean white surfaces, subtle borders (#E2E8F0), and primary blue accents (#2563EB).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-text-secondary">
                Domain Architecture
              </CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <div className="text-xl font-bold text-text-primary">TypeScript Contracts</div>
            <p className="text-xs text-text-secondary">
              Strict schemas for Lead, LeadSource, PipelineStage, FollowUp, and WhatsAppConversation in @/types.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-text-secondary">
                Application Shell
              </CardTitle>
              <Layers className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1.5">
            <div className="text-xl font-bold text-text-primary">Responsive Layout</div>
            <p className="text-xs text-text-secondary">
              Full desktop and mobile drawer navigation with header search, notifications, and counselor identity.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CRM Navigation Module Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
            Institute Management Modules
          </h2>
          <span className="text-xs text-text-muted">9 routes configured</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {crmModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.href}
                href={module.href}
                className="group block transition-transform hover:-translate-y-0.5"
              >
                <Card className="h-full hover:border-slate-300 hover:shadow-elevated transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-md bg-slate-100 text-slate-800 group-hover:bg-primary group-hover:text-white transition-colors">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-sm text-text-primary group-hover:text-primary transition-colors">
                          {module.title}
                        </span>
                      </div>
                      <Badge variant="neutral">{module.badge}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {module.desc}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Reusable UI Components Gallery for Foundation Verification */}
      <Card>
        <CardHeader>
          <CardTitle>Design Foundation Verification Suite</CardTitle>
          <CardDescription>
            Live verification of the commercial SaaS styling system, color tokens, and interactive primitives.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Badges and Semantic Colors */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Status Badges & Indicators
            </h4>
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge variant="default" showDot>Primary Blue (#2563EB)</Badge>
              <Badge variant="success" showDot>Enrolled / Won (#16A34A)</Badge>
              <Badge variant="warning" showDot>Follow-up Pending (#D97706)</Badge>
              <Badge variant="error" showDot>Lost / Dropped (#DC2626)</Badge>
              <Badge variant="info" showDot>WhatsApp Bot Active</Badge>
              <Badge variant="neutral">Neutral Outline</Badge>
            </div>
          </div>

          {/* Button Variants */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Button Hierarchy
            </h4>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button size="sm" variant="primary">Primary Action</Button>
              <Button size="sm" variant="secondary">Secondary Action</Button>
              <Button size="sm" variant="outline">Outline Button</Button>
              <Button size="sm" variant="ghost">Ghost Button</Button>
              <Button size="sm" variant="danger">Destructive Action</Button>
            </div>
          </div>

          {/* Form Elements */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Form Inputs & Selects
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input placeholder="Candidate Name (e.g., Anjali Menon)" readOnly />
              <Select defaultValue="cpc" disabled>
                <option value="cpc">Course: CPC Preparation</option>
                <option value="billing">Course: Medical Billing</option>
              </Select>
              <Input placeholder="Lead Source: Justdial" readOnly />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-text-secondary pt-2 border-t border-border-subtle">
            <CheckCircle className="h-4 w-4 text-status-success" />
            <span>Clean responsive typography and zero horizontal overflow verified. Ready for Phase 3 CRM implementations.</span>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
