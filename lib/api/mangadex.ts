import { fetchJson } from "./http";
import {
  Chapter,
  ChapterPages,
  Genre,
  MangaDetail,
  MangaListParams,
  MangaStatus,
  MangaSummary,
  PaginatedResult,
} from "./types";

const BASE_URL = "https://api.mangadex.org";
const COVER_BASE = "https://uploads.mangadex.org/covers";
const SOURCE = "mangadex" as const;

// --- Raw shapes (subset) ----------------------------------------------------

interface MdTag {
  id: string;
  attributes: { name: Record<string, string> };
}

interface MdRelationship {
  id: string;
  type: string;
  attributes?: Record<string, any>;
}

interface MdMangaAttributes {
  title: Record<string, string>;
  altTitles: Record<string, string>[];
  description: Record<string, string>;
  status: string;
  tags: MdTag[];
  updatedAt: string;
  createdAt: string;
  year: number | null;
}

interface MdMangaItem {
  id: string;
  attributes: MdMangaAttributes;
  relationships: MdRelationship[];
}

interface MdListResponse {
  data: MdMangaItem[];
  total: number;
  limit: number;
  offset: number;
}

interface MdChapterAttributes {
  chapter: string | null;
  title: string | null;
  createdAt: string;
  translatedLanguage: string;
}

interface MdChapterItem {
  id: string;
  attributes: MdChapterAttributes;
}

interface MdChapterListResponse {
  data: MdChapterItem[];
  total: number;
}

interface MdAtHomeResponse {
  baseUrl: string;
  chapter: { hash: string; data: string[]; dataSaver: string[] };
}

// --- Mappers ----------------------------------------------------------------

function pickTitle(titles: Record<string, string> | undefined): string {
  if (!titles) return "Unknown";
  return titles.en ?? titles["ja-ro"] ?? Object.values(titles)[0] ?? "Unknown";
}

function mapStatus(raw: string): MangaStatus {
  switch (raw) {
    case "ongoing":
      return "ongoing";
    case "completed":
      return "completed";
    case "hiatus":
      return "hiatus";
    default:
      return "unknown";
  }
}

function coverFileName(rel: MdRelationship[]): string | undefined {
  const cover = rel.find((r) => r.type === "cover_art");
  return cover?.attributes?.fileName as string | undefined;
}

function authorNames(rel: MdRelationship[]): string[] {
  return rel
    .filter((r) => r.type === "author" || r.type === "artist")
    .map((r) => r.attributes?.name)
    .filter(Boolean);
}

function mapGenres(tags: MdTag[]): Genre[] {
  return tags
    .filter((t) => t.attributes?.name?.en)
    .map((t) => ({ id: t.id, name: t.attributes.name.en, slug: t.id }));
}

function mapSummary(item: MdMangaItem): MangaSummary {
  const cover = coverFileName(item.relationships);
  return {
    id: item.id,
    slug: item.id,
    title: pickTitle(item.attributes.title),
    altTitles: (item.attributes.altTitles ?? []).map((t) => Object.values(t)[0]).filter(Boolean),
    coverUrl: cover
      ? `${COVER_BASE}/${item.id}/${cover}.256.jpg`
      : "/placeholder-cover.svg",
    status: mapStatus(item.attributes.status),
    genres: mapGenres(item.attributes.tags),
    updatedAt: item.attributes.updatedAt,
    createdAt: item.attributes.createdAt,
    source: SOURCE,
  };
}

function mapDetail(item: MdMangaItem, chapters: Chapter[]): MangaDetail {
  const desc = item.attributes.description;
  return {
    ...mapSummary(item),
    description: desc?.en ?? Object.values(desc ?? {})[0] ?? "",
    author: authorNames(item.relationships),
    chapters,
    year: item.attributes.year ?? undefined,
    createdAt: item.attributes.createdAt,
  };
}

const MANGA_INCLUDES = "includes[]=cover_art&includes[]=author&includes[]=artist";

// --- Public adapter -----------------------------------------------------

export const mangadexAdapter = {
  source: SOURCE,

  async list(params: MangaListParams): Promise<PaginatedResult<MangaSummary>> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const offset = (page - 1) * limit;

    const qs = new URLSearchParams();
    qs.set("limit", String(limit));
    qs.set("offset", String(offset));
    qs.set("availableTranslatedLanguage[]", "en");
    if (params.keyword) qs.set("title", params.keyword);
    if (params.status) qs.set("status[]", params.status);
    qs.set(
      params.sort === "newest" ? "order[createdAt]" : "order[updatedAt]",
      "desc"
    );

    const res = await fetchJson<MdListResponse>(
      SOURCE,
      `${BASE_URL}/manga?${qs.toString()}&${MANGA_INCLUDES}`
    );

    return {
      items: res.data.map(mapSummary),
      page,
      totalPages: Math.max(1, Math.ceil(res.total / limit)),
      totalItems: res.total,
      source: SOURCE,
    };
  },

  async listByGenre(genreId: string, page = 1, limit = 20): Promise<PaginatedResult<MangaSummary>> {
    const offset = (page - 1) * limit;
    const qs = new URLSearchParams();
    qs.set("limit", String(limit));
    qs.set("offset", String(offset));
    qs.set("includedTags[]", genreId);
    qs.set("order[updatedAt]", "desc");

    const res = await fetchJson<MdListResponse>(
      SOURCE,
      `${BASE_URL}/manga?${qs.toString()}&${MANGA_INCLUDES}`
    );

    return {
      items: res.data.map(mapSummary),
      page,
      totalPages: Math.max(1, Math.ceil(res.total / limit)),
      totalItems: res.total,
      source: SOURCE,
    };
  },

  async genres(): Promise<Genre[]> {
    const res = await fetchJson<{ data: MdTag[] }>(SOURCE, `${BASE_URL}/manga/tag`);
    return res.data
      .filter((t) => t.attributes?.name?.en)
      .map((t) => ({ id: t.id, name: t.attributes.name.en, slug: t.id }));
  },

  async detail(id: string): Promise<MangaDetail> {
    const mangaRes = await fetchJson<{ data: MdMangaItem }>(
      SOURCE,
      `${BASE_URL}/manga/${id}?${MANGA_INCLUDES}`
    );

    const chapterQs = new URLSearchParams({
      limit: "100",
      "translatedLanguage[]": "en",
      "order[chapter]": "asc",
    });
    const chapterRes = await fetchJson<MdChapterListResponse>(
      SOURCE,
      `${BASE_URL}/manga/${id}/feed?${chapterQs.toString()}`
    );

    const chapters: Chapter[] = chapterRes.data
      .filter((c) => c.attributes.chapter !== null)
      .map((c) => ({
        id: c.id,
        slug: c.id,
        number: c.attributes.chapter ?? "0",
        title: c.attributes.title ?? undefined,
        createdAt: c.attributes.createdAt,
        source: SOURCE,
      }));

    return mapDetail(mangaRes.data, chapters);
  },

  async chapterPages(chapterId: string, mangaSlug: string): Promise<ChapterPages> {
    const res = await fetchJson<MdAtHomeResponse>(
      SOURCE,
      `${BASE_URL}/at-home/server/${chapterId}`
    );
    const pages = res.chapter.data.map(
      (fileName) => `${res.baseUrl}/data/${res.chapter.hash}/${fileName}`
    );
    return { chapterId, mangaSlug, pages, source: SOURCE };
  },
};
