"use client";

import { useCallback, useEffect, useState } from "react";
import { MangaSource } from "@/lib/api";

export interface HistoryEntry {
  slug: string;
  title: string;
  coverUrl: string;
  source: MangaSource;
  chapterId: string;
  chapterNumber: string;
  readAt: number;
}

const STORAGE_KEY = "yomikaze:history";
const MAX_ENTRIES = 60;

function readStorage(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(entries: HistoryEntry[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event("yomikaze:history-changed"));
}

export function useReadingHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(readStorage());
    const sync = () => setHistory(readStorage());
    window.addEventListener("yomikaze:history-changed", sync);
    return () => window.removeEventListener("yomikaze:history-changed", sync);
  }, []);

  const recordProgress = useCallback((entry: Omit<HistoryEntry, "readAt">) => {
    const current = readStorage().filter((h) => h.slug !== entry.slug);
    const next = [{ ...entry, readAt: Date.now() }, ...current].slice(0, MAX_ENTRIES);
    writeStorage(next);
    setHistory(next);
  }, []);

  const clearHistory = useCallback(() => {
    writeStorage([]);
    setHistory([]);
  }, []);

  return { history, recordProgress, clearHistory };
}
