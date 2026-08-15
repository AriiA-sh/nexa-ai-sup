import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  trend?: string;
  icon: LucideIcon;
  className?: string;
}

export function StatCard({ label, value, hint, trend, icon: Icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card/60 p-5 transition-colors hover:border-primary/30",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-4 text-primary" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        {trend && <span className="font-medium text-accent">{trend}</span>}
        {hint && <span className="truncate">{hint}</span>}
      </div>
    </div>
  );
}
