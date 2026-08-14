"use client";

import { useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { mangaApi, MangaListParams } from "@/lib/api";
import { MangaGrid, MangaGridSkeleton } from "@/components/manga/manga-grid";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const SORT_OPTIONS = [
  { value: "updated", label: "Mới cập nhật" },
  { value: "newest", label: "Mới đăng" },
  { value: "title", label: "Tên A-Z" },
  { value: "rating", label: "Đánh giá cao" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "ongoing", label: "Đang tiến hành" },
  { value: "completed", label: "Hoàn thành" },
  { value: "hiatus", label: "Tạm ngưng" },
];

export default function MangaListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const genre = searchParams.get("genre") ?? "";
  const genreLabel = searchParams.get("label") ?? "";
  const status = (searchParams.get("status") ?? "") as MangaListParams["status"] | "";
  const sort = (searchParams.get("sort") ?? "updated") as NonNullable<MangaListParams["sort"]>;

  const { data: genresData } = useQuery({ queryKey: ["genres"], queryFn: () => mangaApi.genres() });

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key === "genre") next.delete("label");
    router.push(`/manga?${next.toString()}`);
  }

  const queryKey = useMemo(() => ["manga-list", { genre, status, sort }], [genre, status, sort]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteQuery({
      queryKey,
      queryFn: ({ pageParam = 1 }) =>
        genre
          ? mangaApi.listByGenre(genre, pageParam)
          : mangaApi.list({ page: pageParam, status: status || undefined, sort }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    });

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const items = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {genreLabel ? `Thể loại: ${genreLabel}` : "Danh sách Manga"}
          </h1>
          <p className="text-sm text-muted-foreground">Lọc theo thể loại, trạng thái và sắp xếp theo ý thích.</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-lilac-100 bg-white/70 p-4 shadow-sm">
        <SlidersHorizontal className="h-4 w-4 text-lilac-500" />

        <div className="w-44">
          <Select value={genre} onChange={(e) => updateParam("genre", e.target.value)}>
            <option value="">Tất cả thể loại</option>
            {genresData?.items.map((g) => (
              <option key={g.id} value={g.slug}>
                {g.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="w-44">
          <Select value={status} onChange={(e) => updateParam("status", e.target.value)}>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="w-44">
          <Select value={sort} onChange={(e) => updateParam("sort", e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>

        {(genre || status || sort !== "updated") && (
          <Button variant="ghost" size="sm" onClick={() => router.push("/manga")}>
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {isLoading && <MangaGridSkeleton />}

      {isError && !isLoading && (
        <div className="rounded-2xl border border-dashed border-sakura-200 py-16 text-center text-sm text-muted-foreground">
          Không thể tải dữ liệu từ cả OTruyen và MangaDex. Vui lòng thử lại sau.
        </div>
      )}

      {!isLoading && !isError && <MangaGrid items={items} />}

      <div ref={loadMoreRef} className="mt-8 flex justify-center">
        {isFetchingNextPage && <Loader2 className="h-6 w-6 animate-spin text-lilac-400" />}
        {!hasNextPage && items.length > 0 && (
          <p className="text-sm text-muted-foreground">Đã hiển thị toàn bộ kết quả.</p>
        )}
      </div>
    </div>
  );
}
