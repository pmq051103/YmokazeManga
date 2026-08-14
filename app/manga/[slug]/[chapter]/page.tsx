"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  List,
  Loader2,
  ArrowUp,
} from "lucide-react";
import { mangaApi, MangaSource } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useReadingHistory } from "@/lib/hooks/useReadingHistory";
import { ReaderImage } from "@/components/reader/reader-image";

export default function ReaderPage() {
  const params = useParams<{ slug: string; chapter: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const source = (searchParams.get("src") ?? "otruyen") as MangaSource;
  const chapterId = decodeURIComponent(params.chapter);
  const mangaSlug = params.slug;

  const [showTop, setShowTop] = useState(false);
  const { recordProgress } = useReadingHistory();

  const { data: manga } = useQuery({
    queryKey: ["manga-detail", mangaSlug, source],
    queryFn: () => mangaApi.detail(mangaSlug, source),
  });

  const sortedChapters = useMemo(() => {
    if (!manga) return [];
    return [...manga.chapters].sort((a, b) => parseFloat(a.number) - parseFloat(b.number));
  }, [manga]);

  const currentIndex = sortedChapters.findIndex((c) => c.id === chapterId);
  const current = sortedChapters[currentIndex];
  const prevChapter = currentIndex > 0 ? sortedChapters[currentIndex - 1] : undefined;
  const nextChapter =
    currentIndex >= 0 && currentIndex < sortedChapters.length - 1
      ? sortedChapters[currentIndex + 1]
      : undefined;

  const {
    data: chapterPages,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["chapter-pages", chapterId, mangaSlug, source],
    queryFn: () => mangaApi.chapterPages(chapterId, mangaSlug, source),
  });

  useEffect(() => {
    if (!manga || !current) return;
    recordProgress({
      slug: manga.slug,
      title: manga.title,
      coverUrl: manga.coverUrl,
      source: manga.source,
      chapterId: current.id,
      chapterNumber: current.number,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manga?.slug, current?.id]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 800);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function goToChapter(id: string) {
    router.push(`/manga/${mangaSlug}/${encodeURIComponent(id)}?src=${source}`);
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="bg-[#f7f4ff]">
      <header className="sticky top-0 z-40 border-b border-lilac-100 bg-white/90 backdrop-blur-md">
        <div className="container flex h-14 items-center justify-between gap-2">
          <Link
            href={`/manga/${mangaSlug}?src=${source}`}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-lilac-600"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden truncate sm:inline max-w-[180px]">{manga?.title ?? "Quay lại"}</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={!prevChapter}
              onClick={() => prevChapter && goToChapter(prevChapter.id)}
              aria-label="Chương trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="w-40 sm:w-48">
              <Select value={current?.id ?? ""} onChange={(e) => goToChapter(e.target.value)}>
                {sortedChapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    Chương {c.number}
                  </option>
                ))}
              </Select>
            </div>

            <Button
              variant="outline"
              size="icon"
              disabled={!nextChapter}
              onClick={() => nextChapter && goToChapter(nextChapter.id)}
              aria-label="Chương sau"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Link
            href={`/manga/${mangaSlug}?src=${source}`}
            className="hidden items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-lilac-600 sm:flex"
          >
            <List className="h-4 w-4" /> Danh sách chương
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl flex-col items-center py-4">
        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-24">
            <Loader2 className="h-8 w-8 animate-spin text-lilac-400" />
            <p className="text-sm text-muted-foreground">Đang tải trang truyện...</p>
          </div>
        )}

        {isError && (
          <div className="py-24 text-center">
            <p className="font-display text-lg font-semibold text-foreground">
              Không thể tải chương này
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Cả hai nguồn dữ liệu đều gặp sự cố. Vui lòng thử lại sau.
            </p>
          </div>
        )}

        {chapterPages?.pages.map((src, i) => (
          <ReaderImage key={src + i} src={src} index={i + 1} total={chapterPages.pages.length} />
        ))}

        {!isLoading && chapterPages && (
          <div className="mt-8 flex w-full max-w-xl flex-col items-center gap-3 px-4 pb-16">
            <p className="text-sm text-muted-foreground">Bạn đã đọc hết chương {current?.number}</p>
            <div className="flex w-full gap-3">
              <Button
                variant="outline"
                className="flex-1"
                disabled={!prevChapter}
                onClick={() => prevChapter && goToChapter(prevChapter.id)}
              >
                <ChevronLeft className="h-4 w-4" /> Chương trước
              </Button>
              <Button
                className="flex-1"
                disabled={!nextChapter}
                onClick={() => nextChapter && goToChapter(nextChapter.id)}
              >
                Chương sau <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sakura-400 to-lilac-500 text-white shadow-soft"
          aria-label="Lên đầu trang"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
