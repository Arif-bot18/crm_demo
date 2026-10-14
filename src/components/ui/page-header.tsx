import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PageContainer({ className, children, ...props }: PageContainerProps) {
  return (
    <div
      className={cn(
        "w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PageHeader({
  title,
  description,
  actions,
  badge,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <div className="space-y-1.5 pb-2 border-b border-border-subtle/80">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-1.5 text-xs text-text-muted mb-2">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-300">/</span>}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="hover:text-primary transition-colors font-medium"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-text-secondary">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {description && (
            <p className="text-sm text-text-secondary mt-1">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
