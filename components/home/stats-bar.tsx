import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface StatItem {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
}

function formatNumber(n: number): string {
  return n.toLocaleString("vi-VN");
}

export function StatsBar({ stats }: { stats: StatItem[] }) {
  if (stats.length === 0) return null;

  return (
    <section className="container py-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ label, value, suffix, icon: Icon }, i) => (
          <div
            key={label}
            className={cn(
              "flex items-center gap-3 rounded-2xl border border-lilac-100 bg-white/70 p-4 shadow-sm",
              i === 0 && "sm:rounded-l-2xl"
            )}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sakura-100 to-lilac-100 text-lilac-600">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-xl font-extrabold text-foreground sm:text-2xl">
                {formatNumber(value)}
                {suffix}
              </p>
              <p className="truncate text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
