import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Section({
  title,
  subtitle,
  href,
  icon,
  children,
  className,
  bare = false,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Skip the built-in `container py-8` wrapper — use when the section is
   * already placed inside a container (e.g. a column of a grid layout). */
  bare?: boolean;
}) {
  return (
    <section className={cn(!bare && "container py-8", className)}>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-display text-2xl font-bold text-foreground">
            {icon}
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {href && (
          <Link
            href={href}
            className="flex shrink-0 items-center gap-1 text-sm font-semibold text-lilac-600 hover:text-lilac-700"
          >
            Xem tất cả <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
