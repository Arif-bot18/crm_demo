import * as React from "react";
import { PageContainer, PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2 } from "lucide-react";

interface ModulePlaceholderProps {
  title: string;
  moduleKey: string;
  description: string;
  scopePoints: string[];
  plannedPhase: string;
}

export function ModulePlaceholder({
  title,
  moduleKey,
  description,
  scopePoints,
  plannedPhase,
}: ModulePlaceholderProps) {
  return (
    <PageContainer>
      <PageHeader
        title={title}
        description={description}
        badge={
          <Badge variant="info" showDot>
            {plannedPhase}
          </Badge>
        }
        breadcrumbs={[
          { label: "MedLead", href: "/" },
          { label: title },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Module Scope & Functional Plan</CardTitle>
            <CardDescription>
              Core requirements identified for {title} in the MedLead CRM specification.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-text-secondary leading-relaxed">
              This module will be developed in a dedicated subsequent step to maintain rigorous code quality and prevent monolithic changes.
            </p>

            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Planned Capabilities
              </h4>
              <ul className="space-y-2">
                {scopePoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-text-primary">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Architecture Status</CardTitle>
            <CardDescription>Foundation validation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-text-secondary">
            <div className="flex items-center justify-between py-2 border-b border-border-subtle">
              <span>TypeScript Contract</span>
              <Badge variant="success">Defined in @/types</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border-subtle">
              <span>Design System</span>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border-subtle">
              <span>Route Slug</span>
              <code className="text-[11px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                /{moduleKey}
              </code>
            </div>
            <div className="pt-2 flex items-center gap-2 text-text-muted">
              <Clock className="h-4 w-4" />
              <span>Pending feature step implementation</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
