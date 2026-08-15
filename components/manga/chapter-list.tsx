"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDownAZ, ArrowUpAZ, BookOpen, BookmarkCheck } from "lucide-react";
import { Chapter, MangaSource } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { useReadingHistory } from "@/lib/hooks/useReadingHistory";
import { cn } from "@/lib/utils/cn";

const PAGE_SIZE = 30;

export function ChapterList({
  chapters,
  mangaSlug,
  source,
}: {
  chapters: Chapter[];
  mangaSlug: string;
  source: MangaSource;
}) {
  const [desc, setDesc] = useState(true);
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);
  const didAutoJump = useRef(false);
  const { history } = useReadingHistory();

  const current = history.find((h) => h.slug === mangaSlug);

  const sorted = useMemo(() => {
    const copy = [...chapters];
    copy.sort((a, b) => parseFloat(a.number) - parseFloat(b.number));
    return desc ? copy.reverse() : copy;
  }, [chapters, desc]);

  const readingChapter = useMemo(() => {
    if (!current) return undefined;
    return (
      sorted.find((c) => c.id === current.chapterId) ??
      sorted.find((c) => c.number === current.chapterNumber)
    );
  }, [sorted, current]);

  const totalPages = Math.max(1, Math.ceil(chapters.length / PAGE_SIZE));

  // Jump straight to the page holding the chapter the user is currently reading.
  useEffect(() => {
    if (didAutoJump.current || !readingChapter) return;
    const idx = sorted.findIndex((c) => c.id === readingChapter.id);
    if (idx >= 0) {
      didAutoJump.current = true;
      setPage(Math.floor(idx / PAGE_SIZE) + 1);
    }
  }, [readingChapter, sorted]);

  const pageChapters = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, page]);

  const goToPage = (next: number) => {
    setPage(next);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (chapters.length === 0) {
    return <p className="text-sm text-muted-foreground">Chưa có chương nào được cập nhật.</p>;
  }

  return (
    <div>
      {current && readingChapter && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-sakura-200 bg-gradient-to-r from-sakura-50 via-lilac-50 to-skyy-50 p-3 shadow-sm">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sakura-500 shadow-sm">
              <BookmarkCheck className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-sakura-600">
                Bạn đang đọc
              </p>
              <p className="truncate text-sm font-semibold text-foreground">
                Chương {readingChapter.number}
                {readingChapter.title ? ` — ${readingChapter.title}` : ""}
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="shrink-0">
            <Link
              href={`/manga/${mangaSlug}/${encodeURIComponent(readingChapter.id)}?src=${source}`}
            >
              <BookOpen className="h-3.5 w-3.5" /> Đọc tiếp
            </Link>
          </Button>
        </div>
      )}

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{chapters.length} chương</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setDesc((d) => !d);
            setPage(1);
          }}
        >
          {desc ? <ArrowDownAZ className="h-4 w-4" /> : <ArrowUpAZ className="h-4 w-4" />}
          {desc ? "Mới nhất trước" : "Cũ nhất trước"}
        </Button>
      </div>

      <div ref={listRef} className="scroll-mt-24">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {pageChapters.map((c) => {
            const isReading = !!readingChapter && c.id === readingChapter.id;
            return (
              <Link
                key={c.id}
                href={`/manga/${mangaSlug}/${encodeURIComponent(c.id)}?src=${source}`}
                title={c.title ? `Chương ${c.number} — ${c.title}` : `Chương ${c.number}`}
                className={cn(
                  "relative flex min-h-12 items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-center text-xs font-medium transition-colors",
                  isReading
                    ? "border-sakura-300 bg-sakura-50 text-sakura-700 shadow-sm"
                    : "border-lilac-100 bg-white text-foreground hover:border-lilac-300 hover:bg-lilac-50"
                )}
              >
                <BookOpen className="h-3 w-3 shrink-0" />
                <span className="truncate">Chương {c.number}</span>
                {isReading && (
                  <span className="absolute -top-2 rounded-full bg-gradient-to-r from-sakura-400 to-lilac-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                    Đang đọc
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={goToPage}
        className="mt-4"
      />
    </div>
  );
}
