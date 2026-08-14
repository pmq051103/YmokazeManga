"use client";

import { useCallback, useEffect, useState } from "react";
import { MangaSource } from "@/lib/api";

export interface BookmarkEntry {
  slug: string;
  title: string;
  coverUrl: string;
  source: MangaSource;
  addedAt: number;
}

const STORAGE_KEY = "yomikaze:bookmarks";

function readStorage(): BookmarkEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BookmarkEntry[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(entries: BookmarkEntry[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event("yomikaze:bookmarks-changed"));
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkEntry[]>([]);

  useEffect(() => {
    setBookmarks(readStorage());
    const sync = () => setBookmarks(readStorage());
    window.addEventListener("yomikaze:bookmarks-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("yomikaze:bookmarks-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isBookmarked = useCallback(
    (slug: string) => bookmarks.some((b) => b.slug === slug),
    [bookmarks]
  );

  const toggleBookmark = useCallback((entry: Omit<BookmarkEntry, "addedAt">) => {
    const current = readStorage();
    const exists = current.some((b) => b.slug === entry.slug);
    const next = exists
      ? current.filter((b) => b.slug !== entry.slug)
      : [{ ...entry, addedAt: Date.now() }, ...current];
    writeStorage(next);
    setBookmarks(next);
  }, []);

  return { bookmarks, isBookmarked, toggleBookmark };
}
