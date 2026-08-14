import { otruyenAdapter } from "./otruyen";
import { mangadexAdapter } from "./mangadex";
import {
  ChapterPages,
  Genre,
  MangaDetail,
  MangaListParams,
  MangaSource,
  MangaSummary,
  PaginatedResult,
  SourceUnavailableError,
} from "./types";

export * from "./types";

/**
 * mangaApi is the single entry point the rest of the app talks to.
 * It always tries OTruyen (primary) first; if that adapter throws
 * SourceUnavailableError (timeout, non-2xx, bad payload) it transparently
 * retries the same request against MangaDex (fallback) and tags the result
 * with which source actually answered, so the UI can show a small badge.
 */
async function withFallback<T>(
  primary: () => Promise<T>,
  fallback: () => Promise<T>
): Promise<{ data: T; sourceUsed: MangaSource }> {
  try {
    const data = await primary();
    return { data, sourceUsed: "otruyen" };
  } catch (err) {
    if (!(err instanceof SourceUnavailableError)) throw err;
    console.warn("Primary source (OTruyen) failed, falling back to MangaDex:", err.message);
    const data = await fallback();
    return { data, sourceUsed: "mangadex" };
  }
}

export const mangaApi = {
  async list(params: MangaListParams): Promise<PaginatedResult<MangaSummary>> {
    const { data } = await withFallback(
      () => otruyenAdapter.list(params),
      () => mangadexAdapter.list(params)
    );
    return data;
  },

  async listByGenre(genreSlugOrId: string, page = 1): Promise<PaginatedResult<MangaSummary>> {
    const { data } = await withFallback(
      () => otruyenAdapter.listByGenre(genreSlugOrId, page),
      () => mangadexAdapter.listByGenre(genreSlugOrId, page)
    );
    return data;
  },

  async genres(): Promise<{ items: Genre[]; sourceUsed: MangaSource }> {
    const { data, sourceUsed } = await withFallback(
      () => otruyenAdapter.genres(),
      () => mangadexAdapter.genres()
    );
    return { items: data, sourceUsed };
  },

  /**
   * `slugOrId` + `preferredSource` let the detail page keep using whichever
   * source successfully returned the manga summary in the list view, so we
   * don't accidentally mix an OTruyen slug with a MangaDex UUID.
   */
  async detail(slugOrId: string, preferredSource?: MangaSource): Promise<MangaDetail> {
    if (preferredSource === "mangadex") {
      const { data } = await withFallback(
        () => mangadexAdapter.detail(slugOrId),
        () => mangadexAdapter.detail(slugOrId)
      );
      return data;
    }
    const { data } = await withFallback(
      () => otruyenAdapter.detail(slugOrId),
      () => mangadexAdapter.detail(slugOrId)
    );
    return data;
  },

  async chapterPages(
    chapterRef: string,
    mangaSlug: string,
    source: MangaSource
  ): Promise<ChapterPages> {
    if (source === "mangadex") {
      return mangadexAdapter.chapterPages(chapterRef, mangaSlug);
    }
    return otruyenAdapter.chapterPages(chapterRef, mangaSlug);
  },

  async search(keyword: string, page = 1): Promise<PaginatedResult<MangaSummary>> {
    const { data } = await withFallback(
      () => otruyenAdapter.list({ keyword, page }),
      () => mangadexAdapter.list({ keyword, page })
    );
    return data;
  },
};
