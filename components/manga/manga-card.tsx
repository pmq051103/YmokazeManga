"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Clock3, Heart } from "lucide-react";
import { MangaSummary } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { useBookmarks } from "@/lib/hooks/useBookmarks";
import { cn } from "@/lib/utils/cn";

const STATUS_LABEL: Record<string, string> = {
  ongoing: "Đang tiến hành",
  completed: "Hoàn thành",
  hiatus: "Tạm ngưng",
  unknown: "",
};

const NEW_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000;

function timeAgo(iso?: string): string {
  if (!iso) return "";
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return "";
  const diff = Date.now() - time;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "vừa xong";
  if (min < 60) return `${min} phút trước`;
  const hours = Math.floor(min / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} tuần trước`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} tháng trước`;
  return `${Math.floor(days / 365)} năm trước`;
}

export function MangaCard({ manga, priority = false }: { manga: MangaSummary; priority?: boolean }) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(manga.slug);

  const createdAt = manga.createdAt ? new Date(manga.createdAt).getTime() : NaN;
  const isNew = !Number.isNaN(createdAt) && Date.now() - createdAt < NEW_THRESHOLD_MS;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative"
    >
      <Link href={`/manga/${manga.slug}?src=${manga.source}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-lilac-100 shadow-card">
          <Image
            src={manga.coverUrl}
            alt={manga.title}
            fill
            sizes="(max-width: 640px) 31vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 160px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority={priority}
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute inset-x-0 bottom-9 flex justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
            <span className="flex scale-90 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-lilac-600 shadow-soft transition-transform duration-300 group-hover:scale-100">
              <BookOpen className="h-3.5 w-3.5" /> Đọc ngay
            </span>
          </div>

          {manga.status !== "unknown" && (
            <Badge
              variant={manga.status === "completed" ? "success" : "pink"}
              className="absolute left-2 top-2 shadow-sm"
            >
              {STATUS_LABEL[manga.status]}
            </Badge>
          )}

          {isNew && (
            <Badge
              variant="sky"
              className={cn(
                "absolute left-2 shadow-sm",
                manga.status !== "unknown" ? "top-[2.5rem]" : "top-2"
              )}
            >
              Mới
            </Badge>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              toggleBookmark({
                slug: manga.slug,
                title: manga.title,
                coverUrl: manga.coverUrl,
                source: manga.source,
              });
            }}
            aria-label="Thêm vào yêu thích"
            className={cn(
              "absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-transform hover:scale-110",
              bookmarked && "bg-sakura-400"
            )}
          >
            <Heart
              className={cn("h-4 w-4", bookmarked ? "fill-white text-white" : "text-sakura-500")}
            />
          </button>

          {manga.latestChapter && (
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-black/60 px-2 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              <BookOpen className="h-3 w-3" />
              <span className="truncate">{manga.latestChapter}</span>
            </div>
          )}
        </div>

        <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-lilac-600">
          {manga.title}
        </h3>
        <div className="mt-1 flex flex-wrap gap-1">
          {manga.genres.slice(0, 2).map((g) => (
            <span key={g.id} className="text-[11px] text-muted-foreground">
              {g.name}
              {manga.genres.indexOf(g) === 0 && manga.genres.length > 1 ? " ·" : ""}
            </span>
          ))}
        </div>
        {manga.updatedAt && (
          <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock3 className="h-3 w-3" />
            <span className="truncate">Cập nhật {timeAgo(manga.updatedAt)}</span>
          </div>
        )}
      </Link>
    </motion.div>
  );
}
