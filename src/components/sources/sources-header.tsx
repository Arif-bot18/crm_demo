"use client";

import * as React from "react";
import { Plus, Megaphone, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

interface SourcesHeaderProps {
  onAddSource: () => void;
  onAddCampaign: () => void;
}

export function SourcesHeader({
  onAddSource,
  onAddCampaign,
}: SourcesHeaderProps) {
  return (
    <PageHeader
      title="Lead Sources & Campaign Tracking"
      description="Track channel attribution, marketing campaigns, cost per lead, and student admission conversion rates."
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Lead Attribution & Marketing" },
      ]}
      actions={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddSource}
            className="gap-1.5"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Add Channel</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onAddCampaign}
            className="gap-1.5"
          >
            <Megaphone className="h-3.5 w-3.5" />
            <span>New Campaign</span>
          </Button>
        </>
      }
    />
  );
}
