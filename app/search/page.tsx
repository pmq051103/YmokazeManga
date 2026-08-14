"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { mangaApi } from "@/lib/api";
import { MangaGrid, MangaGridSkeleton } from "@/components/manga/manga-grid";
import { Button } from "@/components/ui/button";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["search", q, page],
    queryFn: () => mangaApi.search(q, page),
    enabled: q.trim().length > 0,
  });

  return (
    <div className="container py-8">
      <h1 className="font-display text-2xl font-bold text-foreground">
        Kết quả tìm kiếm cho “{q}”
      </h1>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">
        {data ? `${data.totalItems ?? data.items.length} kết quả · nguồn: ${data.source}` : "\u00A0"}
      </p>

      {isLoading && <MangaGridSkeleton />}

      {isError && (
        <div className="rounded-2xl border border-dashed border-sakura-200 py-16 text-center text-sm text-muted-foreground">
          Không thể tìm kiếm lúc này. Vui lòng thử lại.
        </div>
      )}

      {!isLoading && !isError && data && <MangaGrid items={data.items} />}

      {data && data.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Trang trước
          </Button>
          <span className="text-sm text-muted-foreground">
            Trang {page} / {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Trang sau
          </Button>
        </div>
      )}
    </div>
  );
}
