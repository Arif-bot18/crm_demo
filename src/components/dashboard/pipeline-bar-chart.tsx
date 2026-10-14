import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { PipelineStageBreakdown } from "@/lib/demo-data";

interface PipelineBarChartProps {
  stages: PipelineStageBreakdown[];
}

export function PipelineBarChart({ stages }: PipelineBarChartProps) {
  // Find maximum count to scale bars proportionally
  const maxCount = Math.max(...stages.map((s) => s.count), 1);
  const totalLeads = stages.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-text-primary">
              Admission Pipeline
            </CardTitle>
            <CardDescription className="text-xs text-text-secondary">
              Current stage of your leads.
            </CardDescription>
          </div>
          <span className="text-[11px] font-medium text-text-muted bg-slate-100 px-2 py-0.5 rounded">
            {totalLeads} in Funnel
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pt-2">
        <div className="space-y-2.5">
          {stages.map((stageItem) => {
            const percentage = ((stageItem.count / maxCount) * 100).toFixed(0);
            const totalPercentage = totalLeads > 0
              ? ((stageItem.count / totalLeads) * 100).toFixed(1)
              : "0";

            return (
              <div key={stageItem.stage} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-text-primary">
                    {stageItem.stage}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-primary">
                      {stageItem.count}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      ({totalPercentage}%)
                    </span>
                  </div>
                </div>

                {/* Progress bar track */}
                <div
                  className="h-2 w-full rounded-full bg-slate-100 overflow-hidden"
                  role="progressbar"
                  aria-valuenow={stageItem.count}
                  aria-valuemin={0}
                  aria-valuemax={maxCount}
                  aria-label={`${stageItem.stage}: ${stageItem.count} leads`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: stageItem.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
