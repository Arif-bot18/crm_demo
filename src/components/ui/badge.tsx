import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "neutral" | "outline";
  showDot?: boolean;
}

function Badge({
  className,
  variant = "default",
  showDot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default:
      "bg-primary-light text-primary border-primary/20",
    success:
      "bg-status-success-light text-status-success border-status-success-border",
    warning:
      "bg-status-warning-light text-status-warning border-status-warning-border",
    error:
      "bg-status-error-light text-status-error border-status-error-border",
    info:
      "bg-status-info-light text-status-info border-status-info-border",
    neutral:
      "bg-slate-100 text-slate-700 border-slate-200",
    outline:
      "bg-white text-slate-700 border-border-subtle",
  };

  const dotColor = {
    default: "bg-primary",
    success: "bg-status-success",
    warning: "bg-status-warning",
    error: "bg-status-error",
    info: "bg-status-info",
    neutral: "bg-slate-500",
    outline: "bg-slate-400",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border transition-colors select-none",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {showDot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full", dotColor[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
}

export { Badge };
