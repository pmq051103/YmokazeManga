"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";
import { mangaApi, MangaListParams } from "@/lib/api";
import { MangaGrid, MangaGridSkeleton } from "@/components/manga/manga-grid";
import { Pagination } from "@/components/ui/pagination";
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

  const genre = searchParams.get("genre") ?? "";
  const genreLabel = searchParams.get("label") ?? "";
  const status = (searchParams.get("status") ?? "") as MangaListParams["status"] | "";
  const sort = (searchParams.get("sort") ?? "updated") as NonNullable<MangaListParams["sort"]>;
  const page = Math.max(1, Number.parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const { data: genresData } = useQuery({ queryKey: ["genres"], queryFn: () => mangaApi.genres() });

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    if (key === "genre") next.delete("label");
    next.delete("page");
    router.push(`/manga?${next.toString()}`);
  }

  function goToPage(p: number) {
    const next = new URLSearchParams(searchParams.toString());
    next.set("page", String(p));
    router.push(`/manga?${next.toString()}`);
  }

  const queryKey = useMemo(() => ["manga-list", { genre, status, sort, page }], [genre, status, sort, page]);

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () =>
      genre
        ? mangaApi.listByGenre(genre, page)
        : mangaApi.list({ page, status: status || undefined, sort }),
  });

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page, genre, status, sort]);

  const items = data?.items ?? [];

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

      <div className="mb-6 flex flex-col items-stretch gap-3 rounded-2xl border border-lilac-100 bg-white/70 p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex items-center gap-2 sm:hidden">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-lilac-500" />
          <span className="text-sm font-semibold text-foreground">Bộ lọc</span>
        </div>
        <SlidersHorizontal className="hidden h-4 w-4 text-lilac-500 sm:block" />

        <div className="w-full sm:w-44">
          <Select value={genre} onChange={(e) => updateParam("genre", e.target.value)}>
            <option value="">Tất cả thể loại</option>
            {genresData?.items.map((g) => (
              <option key={g.id} value={g.slug}>
                {g.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="w-full sm:w-44">
          <Select value={status} onChange={(e) => updateParam("status", e.target.value)}>
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="w-full sm:w-44">
          <Select value={sort} onChange={(e) => updateParam("sort", e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>

        {(genre || status || sort !== "updated") && (
          <Button variant="ghost" size="sm" className="w-full sm:w-auto" onClick={() => router.push("/manga")}>
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

      {!isLoading && !isError && data && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          onPageChange={goToPage}
          className="mt-8"
        />
      )}
    </div>
  );
}
