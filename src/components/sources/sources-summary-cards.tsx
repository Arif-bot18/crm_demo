"use client";

import * as React from "react";
import { Share2, Megaphone, Users, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SourcesSummaryMetrics } from "@/types/crm";

interface SourcesSummaryCardsProps {
  summary: SourcesSummaryMetrics;
}

export function SourcesSummaryCards({ summary }: SourcesSummaryCardsProps) {
  const cards = [
    {
      title: "Total Lead Channels",
      value: summary.totalSources,
      supportingText: `${summary.activeSources} channels active & receiving inquiries`,
      icon: Share2,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50 border border-blue-100",
    },
    {
      title: "Active Campaigns",
      value: summary.activeCampaigns,
      supportingText: `₹${summary.totalBudget.toLocaleString("en-IN")} allocated budget`,
      icon: Megaphone,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50 border border-amber-100",
    },
    {
      title: "Attributed Inquiries",
      value: summary.attributedLeads,
      supportingText: "From digital ads, portals & referrals",
      icon: Users,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50 border border-indigo-100",
    },
    {
      title: "Enrolled Admissions",
      value: summary.enrolledAdmissions,
      supportingText: `${summary.avgConversionRate}% channel conversion rate`,
      icon: Award,
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
                <div className="text-2xl font-bold text-text-primary tracking-tight">
                  {card.value}
                </div>
                <p className="text-[11px] text-text-muted mt-1">
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
