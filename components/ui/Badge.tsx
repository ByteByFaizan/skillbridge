import { type HTMLAttributes } from "react";

export type BadgeVariant = "default" | "success" | "warning" | "high" | "medium" | "low";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export default function Badge({
  className = "",
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: "bg-[var(--primary)]/10 text-[var(--primary)]",
    success: "bg-emerald-100 text-emerald-800",
    warning: "bg-amber-100 text-amber-800",
    high: "bg-amber-100 text-amber-800",
    medium: "bg-blue-100 text-blue-800",
    low: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
