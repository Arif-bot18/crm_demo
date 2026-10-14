import * as React from "react";
import { Lightbulb, Info } from "lucide-react";

export function QuickInsight() {
  return (
    <div className="rounded-lg border border-border-subtle bg-white p-4 shadow-subtle">
      <div className="flex items-start gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-50 border border-amber-200 text-amber-600 mt-0.5">
          <Lightbulb className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
              Quick Insight
            </h4>
            <span className="text-[10px] text-text-muted bg-slate-100 px-1.5 py-0.5 rounded">
              Demonstration Mode
            </span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Several leads are awaiting follow-up today. Reviewing prioritized inquiries from Justdial and WhatsApp will help ensure interested student candidates receive prompt counseling and documentation guidance.
          </p>
        </div>
      </div>
    </div>
  );
}
