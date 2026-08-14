"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookmarks } from "@/lib/hooks/useBookmarks";
import { MangaSource } from "@/lib/api";

export function BookmarkButton({
  slug,
  title,
  coverUrl,
  source,
}: {
  slug: string;
  title: string;
  coverUrl: string;
  source: MangaSource;
}) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const active = isBookmarked(slug);

  return (
    <Button
      variant={active ? "default" : "outline"}
      onClick={() => toggleBookmark({ slug, title, coverUrl, source })}
    >
      <Heart className={active ? "fill-white" : ""} />
      {active ? "Đã lưu" : "Lưu truyện"}
    </Button>
  );
}
