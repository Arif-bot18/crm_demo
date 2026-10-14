import * as React from "react";
import { Users, UserPlus, Sparkles, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LeadsSummaryCardsProps {
  summary: {
    totalLeads: number;
    newLeads: number;
    interestedLeads: number;
    enrolledStudents: number;
  };
}

export function LeadsSummaryCards({ summary }: LeadsSummaryCardsProps) {
  const cards = [
    {
      title: "Total Leads",
      value: summary.totalLeads,
      supportingText: "Inquiries registered",
      icon: Users,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50 border border-blue-100",
    },
    {
      title: "New Leads",
      value: summary.newLeads,
      supportingText: "Awaiting initial contact",
      icon: UserPlus,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50 border border-indigo-100",
    },
    {
      title: "Interested Leads",
      value: summary.interestedLeads,
      supportingText: "Counseling & fee discussion",
      icon: Sparkles,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50 border border-amber-100",
    },
    {
      title: "Enrolled Students",
      value: summary.enrolledStudents,
      supportingText: "Confirmed admissions",
      icon: GraduationCap,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-50 border border-emerald-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="flex flex-col justify-between">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-text-secondary tracking-tight">
                  {card.title}
                </span>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-md ${card.iconBg}`}
                >
                  <Icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-2xl font-bold tracking-tight text-text-primary">
                  {card.value.toLocaleString()}
                </div>
                <p className="text-xs text-text-muted mt-1">
                  {card.supportingText}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
