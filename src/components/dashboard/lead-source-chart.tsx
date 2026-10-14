import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { LeadSourceBreakdown } from "@/lib/demo-data";

interface LeadSourceChartProps {
  sources: LeadSourceBreakdown[];
}

export function LeadSourceChart({ sources }: LeadSourceChartProps) {
  const totalLeads = sources.reduce((acc, curr) => acc + curr.count, 0);

  // SVG Donut geometry
  const size = 160;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-text-primary">
          Lead Sources
        </CardTitle>
        <CardDescription className="text-xs text-text-secondary">
          Where your student inquiries are coming from.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pt-2">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
          {/* SVG Donut */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90"
              role="img"
              aria-label={`Donut chart representing distribution across ${sources.length} lead sources`}
            >
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke="#F1F5F9"
                strokeWidth={strokeWidth}
              />
              {sources.map((source) => {
                const fraction = totalLeads > 0 ? source.count / totalLeads : 0;
                const dashLength = fraction * circumference;
                const currentOffset = cumulativeOffset;
                cumulativeOffset += dashLength;

                return (
                  <circle
                    key={source.id}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={source.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                    strokeDashoffset={-currentOffset}
                    className="transition-all duration-300 hover:opacity-85"
                  />
                );
              })}
            </svg>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xl font-bold tracking-tight text-text-primary">
                {totalLeads}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                Total Leads
              </span>
            </div>
          </div>

          {/* Legend Grid */}
          <div className="w-full sm:w-auto flex-1 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            {sources.map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between gap-2 p-1 rounded hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: source.color }}
                    aria-hidden="true"
                  />
                  <span className="truncate text-xs font-medium text-text-secondary">
                    {source.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 text-right">
                  <span className="font-semibold text-text-primary">
                    {source.count}
                  </span>
                  <span className="text-[10px] text-text-muted">
                    ({source.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
