"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownAZ, ArrowUpAZ, BookOpen } from "lucide-react";
import { Chapter, MangaSource } from "@/lib/api";
import { Button } from "@/components/ui/button";

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

  const sorted = useMemo(() => {
    const copy = [...chapters];
    copy.sort((a, b) => parseFloat(a.number) - parseFloat(b.number));
    return desc ? copy.reverse() : copy;
  }, [chapters, desc]);

  if (chapters.length === 0) {
    return <p className="text-sm text-muted-foreground">Chưa có chương nào được cập nhật.</p>;
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{chapters.length} chương</p>
        <Button variant="ghost" size="sm" onClick={() => setDesc((d) => !d)}>
          {desc ? <ArrowDownAZ className="h-4 w-4" /> : <ArrowUpAZ className="h-4 w-4" />}
          {desc ? "Mới nhất trước" : "Cũ nhất trước"}
        </Button>
      </div>

      <div className="max-h-[28rem] divide-y divide-lilac-50 overflow-y-auto rounded-2xl border border-lilac-100 bg-white">
        {sorted.map((c) => (
          <Link
            key={c.id}
            href={`/manga/${mangaSlug}/${encodeURIComponent(c.id)}?src=${source}`}
            className="flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors hover:bg-lilac-50"
          >
            <span className="flex items-center gap-2 font-medium text-foreground">
              <BookOpen className="h-3.5 w-3.5 text-lilac-400" />
              Chương {c.number} {c.title ? `— ${c.title}` : ""}
            </span>
            {c.createdAt && (
              <span className="shrink-0 text-xs text-muted-foreground">
                {new Date(c.createdAt).toLocaleDateString("vi-VN")}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
