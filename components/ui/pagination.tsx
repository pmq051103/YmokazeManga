"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

type PageItem = number | "ellipsis";

function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, totalPages]);
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
    pages.add(i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items: PageItem[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) items.push("ellipsis");
    items.push(p);
    prev = p;
  }
  return items;
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  const items = useMemo(() => getPageItems(page, totalPages), [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Phân trang"
      className={cn("flex items-center justify-center gap-2", className)}
    >
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Trang trước"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="hidden items-center gap-1.5 sm:flex">
        {items.map((item, i) =>
          item === "ellipsis" ? (
            <span key={`e-${i}`} className="px-1 text-sm text-muted-foreground">
              …
            </span>
          ) : (
            <Button
              key={item}
              variant={item === page ? "default" : "outline"}
              size="icon"
              className="h-9 w-9 text-sm"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
            >
              {item}
            </Button>
          )
        )}
      </div>

      <span className="text-sm font-medium text-muted-foreground sm:hidden">
        Trang {page} / {totalPages}
      </span>

      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Trang sau"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
