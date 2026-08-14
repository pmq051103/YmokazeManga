"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { History, Trash2 } from "lucide-react";
import { useReadingHistory } from "@/lib/hooks/useReadingHistory";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

const PAGE_SIZE = 10;

export default function HistoryPage() {
  const { history, clearHistory } = useReadingHistory();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(history.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);

  const pageItems = useMemo(
    () => history.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE),
    [history, current]
  );

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-bold text-foreground">
          <History className="h-6 w-6 text-skyy-500" /> Lịch sử đọc truyện
        </h1>
        {history.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearHistory}>
            <Trash2 className="h-4 w-4" /> Xóa lịch sử
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-lilac-200 py-16 text-center">
          <p className="font-display text-lg font-semibold text-foreground">Chưa có lịch sử</p>
          <p className="mt-1 text-sm text-muted-foreground">Truyện bạn đọc gần đây sẽ hiện ở đây.</p>
          <Button asChild className="mt-4">
            <Link href="/manga">Bắt đầu đọc</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-3">
            {pageItems.map((h) => (
              <Link
                key={h.slug}
                href={`/manga/${h.slug}/${encodeURIComponent(h.chapterId)}?src=${h.source}`}
                className="flex items-center gap-4 rounded-2xl border border-lilac-100 bg-white p-3 shadow-sm transition-colors hover:bg-lilac-50"
              >
                <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl bg-lilac-100">
                  <Image src={h.coverUrl} alt={h.title} fill className="object-cover" unoptimized />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">{h.title}</p>
                  <p className="text-sm text-muted-foreground">Đang đọc chương {h.chapterNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(h.readAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </Link>
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
