"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { useBookmarks } from "@/lib/hooks/useBookmarks";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

const PAGE_SIZE = 12;

export default function BookmarksPage() {
  const { bookmarks, toggleBookmark } = useBookmarks();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(bookmarks.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);

  const pageItems = useMemo(
    () => bookmarks.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE),
    [bookmarks, current]
  );

  const fillerCount = (3 - (pageItems.length % 3)) % 3;

  return (
    <div className="container py-8">
      <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-foreground">
        <Heart className="h-6 w-6 text-sakura-500" /> Truyện yêu thích
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Danh sách được lưu trên trình duyệt của bạn ({bookmarks.length} truyện).
      </p>

      {bookmarks.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-lilac-200 py-16 text-center">
          <p className="font-display text-lg font-semibold text-foreground">Chưa có truyện nào</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Nhấn biểu tượng trái tim trên bìa truyện để lưu vào đây.
          </p>
          <Button asChild className="mt-4">
            <Link href="/manga">Khám phá manga</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6">
            {pageItems.map((b) => (
              <div key={b.slug} className="group relative">
                <Link href={`/manga/${b.slug}?src=${b.source}`}>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-lilac-100 shadow-card">
                    <Image src={b.coverUrl} alt={b.title} fill className="object-cover" unoptimized />
                  </div>
                  <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-foreground">{b.title}</h3>
                </Link>
                <button
                  onClick={() =>
                    toggleBookmark({ slug: b.slug, title: b.title, coverUrl: b.coverUrl, source: b.source })
                  }
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-sakura-500 shadow-sm hover:bg-sakura-500 hover:text-white"
                  aria-label="Bỏ lưu"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {Array.from({ length: fillerCount }).map((_, i) => (
              <div key={`filler-${i}`} className="pointer-events-none invisible" aria-hidden="true" />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination page={current} totalPages={totalPages} onPageChange={setPage} className="mt-8" />
          )}
        </>
      )}
    </div>
  );
}
