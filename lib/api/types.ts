// ---------------------------------------------------------------------------
// Unified domain types. Every adapter (OTruyen, MangaDex) normalizes its raw
// API response into these shapes so the rest of the app never has to know
// which source the data came from.
// ---------------------------------------------------------------------------

export type MangaSource = "otruyen" | "mangadex";

export type MangaStatus = "ongoing" | "completed" | "hiatus" | "unknown";

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface MangaSummary {
  id: string;
  slug: string;
  title: string;
  altTitles: string[];
  coverUrl: string;
  status: MangaStatus;
  genres: Genre[];
  latestChapter?: string;
  updatedAt?: string;
  source: MangaSource;
}

export interface Chapter {
  id: string;
  slug: string;
  number: string;
  title?: string;
  createdAt?: string;
  source: MangaSource;
}

export interface MangaDetail extends MangaSummary {
  description: string;
  author: string[];
  chapters: Chapter[];
  rating?: number;
}

export interface ChapterPages {
  chapterId: string;
  mangaSlug: string;
  pages: string[];
  prevChapterId?: string;
  nextChapterId?: string;
  source: MangaSource;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalItems?: number;
  source: MangaSource;
}

export interface MangaListParams {
  page?: number;
  limit?: number;
  genre?: string;
  status?: MangaStatus;
  sort?: "updated" | "newest" | "title" | "rating";
  keyword?: string;
}

/** Thrown by an adapter when it cannot fulfil a request so the resolver
 * layer knows to fall back to the next source in the chain. */
export class SourceUnavailableError extends Error {
  constructor(public source: MangaSource, message: string) {
    super(`[${source}] ${message}`);
    this.name = "SourceUnavailableError";
  }
}
