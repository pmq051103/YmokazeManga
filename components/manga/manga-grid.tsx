import { MangaSummary } from "@/lib/api";
import { MangaCard } from "./manga-card";
import { Skeleton } from "@/components/ui/skeleton";

export function MangaGrid({ items }: { items: MangaSummary[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-lilac-200 py-16 text-center">
        <p className="font-display text-lg font-semibold text-foreground">Chưa có kết quả</p>
        <p className="text-sm text-muted-foreground">Thử đổi bộ lọc hoặc từ khóa khác nhé.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((m) => (
        <MangaCard key={`${m.source}-${m.id}`} manga={m} />
      ))}
    </div>
  );
}

export function MangaGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[3/4] w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
          <Skeleton className="mt-1 h-3 w-2/5" />
        </div>
      ))}
    </div>
  );
}
