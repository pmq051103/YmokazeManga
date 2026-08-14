"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { MangaSummary } from "@/lib/api";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { key: "day", label: "Ngày" },
  { key: "week", label: "Tuần" },
  { key: "month", label: "Tháng" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const RANK_STYLES = [
  "bg-gradient-to-br from-amber-400 to-amber-500 text-white",
  "bg-gradient-to-br from-slate-300 to-slate-400 text-white",
  "bg-gradient-to-br from-orange-400 to-orange-500 text-white",
];

export function RankingSidebar({
  day,
  week,
  month,
}: {
  day: MangaSummary[];
  week: MangaSummary[];
  month: MangaSummary[];
}) {
  const [tab, setTab] = useState<TabKey>("week");
  const data: Record<TabKey, MangaSummary[]> = { day, week, month };
  const items = data[tab].slice(0, 10);

  return (
    <div className="rounded-2xl border border-lilac-100 bg-white p-4 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-sakura-500" />
        <h3 className="font-display text-lg font-bold text-foreground">Bảng xếp hạng</h3>
      </div>

      <div className="mb-4 flex gap-1 rounded-full bg-lilac-50 p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex-1 rounded-full py-1.5 text-xs font-semibold transition-colors",
              tab === t.key
                ? "bg-white text-lilac-700 shadow-sm"
                : "text-muted-foreground hover:text-lilac-600"
            )}
          >
            Top {t.label}
          </button>
        ))}
      </div>

      {items.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">Chưa có dữ liệu.</p>
      )}

      <ol className="flex flex-col gap-3">
        {items.map((manga, i) => (
          <li key={`${manga.source}-${manga.id}`}>
            <Link
              href={`/manga/${manga.slug}?src=${manga.source}`}
              className="group flex items-center gap-3"
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  i < 3 ? RANK_STYLES[i] : "bg-lilac-50 text-muted-foreground"
                )}
              >
                {i + 1}
              </span>
              <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-lilac-100">
                <Image
                  src={manga.coverUrl}
                  alt={manga.title}
                  fill
                  sizes="44px"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-lilac-600">
                  {manga.title}
                </p>
                {manga.latestChapter && (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {manga.latestChapter}
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
