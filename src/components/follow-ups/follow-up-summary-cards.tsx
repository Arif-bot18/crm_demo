import * as React from "react";
import { Clock, AlertTriangle, Calendar, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FollowUpSummaryMetrics } from "@/context/leads-context";

interface FollowUpSummaryCardsProps {
  summary: FollowUpSummaryMetrics;
}

export function FollowUpSummaryCards({ summary }: FollowUpSummaryCardsProps) {
  const cards = [
    {
      title: "Today's Follow-ups",
      value: summary.today,
      supportingText: "Scheduled for today's calendar day",
      icon: Clock,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50 border border-amber-100",
    },
    {
      title: "Overdue",
      value: summary.overdue,
      supportingText: "Require immediate counselor attention",
      icon: AlertTriangle,
      iconColor: "text-status-error",
      iconBg: "bg-red-50 border border-red-100",
    },
    {
      title: "Upcoming",
      value: summary.upcoming,
      supportingText: "Scheduled after today",
      icon: Calendar,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50 border border-blue-100",
    },
    {
      title: "Completed",
      value: summary.completed,
      supportingText: "Successfully logged interactions",
      icon: CheckCircle2,
      iconColor: "text-status-success",
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
