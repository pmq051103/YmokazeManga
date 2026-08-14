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

const BASE_URL = "https://otruyenapi.com/v1/api";
const CDN_IMAGE_BASE = "https://img.otruyenapi.com/uploads/comics";
const SOURCE = "otruyen" as const;

// --- Raw shapes (subset of fields we actually use) ------------------------

interface OtCategory {
  id: string;
  name: string;
  slug: string;
}

interface OtChapterItem {
  chapter_name: string;
  chapter_title?: string;
  chapter_api_data: string;
}

interface OtChapterServer {
  server_name: string;
  server_data: OtChapterItem[];
}

interface OtComicItem {
  _id: string;
  name: string;
  slug: string;
  origin_name?: string[];
  status?: string;
  thumb_url: string;
  updatedAt?: string;
  category?: OtCategory[];
  chaptersLatest?: { chapter_name: string }[];
}

interface OtComicDetail extends OtComicItem {
  content?: string;
  author?: string[];
  chapters?: OtChapterServer[];
}

interface OtListResponse {
  status: string;
  data: {
    items: OtComicItem[];
    params?: { pagination?: { totalItems: number; totalItemsPerPage: number; currentPage: number } };
  };
}

interface OtDetailResponse {
  status: string;
  data: { item: OtComicDetail };
}

interface OtChapterPageResponse {
  status: string;
  data: {
    domain_cdn: string;
    item: {
      chapter_image: { image_page: number; image_file: string }[];
      chapter_path: string;
    };
  };
}

// --- Mappers ----------------------------------------------------------------

function mapStatus(raw?: string): MangaStatus {
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

function mapGenres(cats?: OtCategory[]): Genre[] {
  return (cats ?? []).map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
}

function resolveThumb(thumb: string): string {
  if (thumb.startsWith("http")) return thumb;
  return `${CDN_IMAGE_BASE}/${thumb}`;
}

function mapSummary(item: OtComicItem): MangaSummary {
  return {
    id: item._id,
    slug: item.slug,
    title: item.name,
    altTitles: item.origin_name ?? [],
    coverUrl: resolveThumb(item.thumb_url),
    status: mapStatus(item.status),
    genres: mapGenres(item.category),
    latestChapter: item.chaptersLatest?.[0]?.chapter_name,
    updatedAt: item.updatedAt,
    source: SOURCE,
  };
}

function mapChapters(servers?: OtChapterServer[]): Chapter[] {
  const server = servers?.[0];
  if (!server) return [];
  return server.server_data
    .map((c) => ({
      id: c.chapter_api_data,
      slug: c.chapter_name,
      number: c.chapter_name,
      title: c.chapter_title,
      source: SOURCE,
    }))
    .sort((a, b) => parseFloat(a.number) - parseFloat(b.number));
}

function mapDetail(item: OtComicDetail): MangaDetail {
  return {
    ...mapSummary(item),
    description: (item.content ?? "").replace(/<[^>]*>/g, "").trim(),
    author: item.author?.filter((a) => a && a !== "Đang cập nhật") ?? [],
    chapters: mapChapters(item.chapters),
  };
}

// --- Public adapter -----------------------------------------------------

export const otruyenAdapter = {
  source: SOURCE,

  async list(params: MangaListParams): Promise<PaginatedResult<MangaSummary>> {
    const page = params.page ?? 1;
    const qs = new URLSearchParams({ page: String(page) });
    const endpoint = params.keyword
      ? `${BASE_URL}/tim-kiem?keyword=${encodeURIComponent(params.keyword)}&${qs.toString()}`
      : `${BASE_URL}/danh-sach/${params.sort === "newest" ? "truyen-moi" : "dang-phat-hanh"}?${qs.toString()}`;

    const res = await fetchJson<OtListResponse>(SOURCE, endpoint);
    const pagination = res.data.params?.pagination;
    const totalPages = pagination
      ? Math.max(1, Math.ceil(pagination.totalItems / pagination.totalItemsPerPage))
      : 1;

    return {
      items: res.data.items.map(mapSummary),
      page,
      totalPages,
      totalItems: pagination?.totalItems,
      source: SOURCE,
    };
  },

  async listByGenre(genreSlug: string, page = 1): Promise<PaginatedResult<MangaSummary>> {
    const res = await fetchJson<OtListResponse>(
      SOURCE,
      `${BASE_URL}/the-loai/${genreSlug}?page=${page}`
    );
    const pagination = res.data.params?.pagination;
    const totalPages = pagination
      ? Math.max(1, Math.ceil(pagination.totalItems / pagination.totalItemsPerPage))
      : 1;
    return {
      items: res.data.items.map(mapSummary),
      page,
      totalPages,
      totalItems: pagination?.totalItems,
      source: SOURCE,
    };
  },

  async genres(): Promise<Genre[]> {
    const res = await fetchJson<{ status: string; data: { items: OtCategory[] } }>(
      SOURCE,
      `${BASE_URL}/the-loai`
    );
    return res.data.items.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
  },

  async detail(slug: string): Promise<MangaDetail> {
    const res = await fetchJson<OtDetailResponse>(SOURCE, `${BASE_URL}/truyen-tranh/${slug}`);
    return mapDetail(res.data.item);
  },

  async chapterPages(chapterApiUrl: string, mangaSlug: string): Promise<ChapterPages> {
    const res = await fetchJson<OtChapterPageResponse>(SOURCE, chapterApiUrl);
    const { domain_cdn, item } = res.data;
    const pages = item.chapter_image.map(
      (p) => `${domain_cdn}/${item.chapter_path}/${p.image_file}`
    );
    return {
      chapterId: chapterApiUrl,
      mangaSlug,
      pages,
      source: SOURCE,
    };
  },
};
