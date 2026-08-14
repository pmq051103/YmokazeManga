import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { BookOpen, User2 } from "lucide-react";
import { mangaApi, MangaSource } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChapterList } from "@/components/manga/chapter-list";
import { BookmarkButton } from "@/components/manga/bookmark-button";
import { MangaGrid } from "@/components/manga/manga-grid";

const STATUS_LABEL: Record<string, string> = {
  ongoing: "Đang tiến hành",
  completed: "Hoàn thành",
  hiatus: "Tạm ngưng",
  unknown: "Không rõ",
};

interface PageProps {
  params: { slug: string };
  searchParams: { src?: string };
}

async function getManga(slug: string, src?: string) {
  try {
    return await mangaApi.detail(slug, src as MangaSource | undefined);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const manga = await getManga(params.slug, searchParams.src);
  if (!manga) return { title: "Không tìm thấy truyện" };
  return {
    title: manga.title,
    description: manga.description.slice(0, 160) || `Đọc ${manga.title} online tại Yomikaze.`,
    openGraph: {
      title: manga.title,
      description: manga.description.slice(0, 160),
      images: [{ url: manga.coverUrl }],
    },
  };
}

export default async function MangaDetailPage({ params, searchParams }: PageProps) {
  const manga = await getManga(params.slug, searchParams.src);
  if (!manga) notFound();

  const related =
    manga.genres[0] &&
    (await mangaApi.listByGenre(manga.genres[0].slug, 1).catch(() => null));
  const relatedItems = (related?.items ?? []).filter((m) => m.slug !== manga.slug).slice(0, 12);

  const firstChapter = [...manga.chapters].sort(
    (a, b) => parseFloat(a.number) - parseFloat(b.number)
  )[0];

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border-4 border-white shadow-soft">
            <Image src={manga.coverUrl} alt={manga.title} fill className="object-cover" unoptimized priority />
          </div>
          <div className="mt-4 flex flex-col gap-2">
            {firstChapter && (
              <Button asChild size="lg">
                <Link href={`/manga/${manga.slug}/${encodeURIComponent(firstChapter.id)}?src=${manga.source}`}>
                  <BookOpen className="h-4 w-4" /> Đọc từ đầu
                </Link>
              </Button>
            )}
            <BookmarkButton
              slug={manga.slug}
              title={manga.title}
              coverUrl={manga.coverUrl}
              source={manga.source}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant={manga.status === "completed" ? "success" : "pink"}>
              {STATUS_LABEL[manga.status]}
            </Badge>
            <Badge variant="outline">Nguồn: {manga.source === "otruyen" ? "OTruyen" : "MangaDex"}</Badge>
          </div>

          <h1 className="font-display text-3xl font-bold text-foreground">{manga.title}</h1>

          {manga.altTitles.length > 0 && (
            <p className="mt-1 text-sm text-muted-foreground">{manga.altTitles.join(" · ")}</p>
          )}

          {manga.author.length > 0 && (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-foreground">
              <User2 className="h-4 w-4 text-lilac-400" /> {manga.author.join(", ")}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {manga.genres.map((g) => (
              <Link key={g.id} href={`/manga?genre=${g.slug}&label=${encodeURIComponent(g.name)}`}>
                <Badge variant="default" className="hover:bg-lilac-200">
                  {g.name}
                </Badge>
              </Link>
            ))}
          </div>

          <p className="mt-5 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {manga.description || "Chưa có mô tả cho truyện này."}
          </p>

          <div className="mt-8">
            <h2 className="mb-3 font-display text-xl font-bold text-foreground">Danh sách chương</h2>
            <ChapterList chapters={manga.chapters} mangaSlug={manga.slug} source={manga.source} />
          </div>
        </div>
      </div>

      {relatedItems.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 font-display text-xl font-bold text-foreground">Có thể bạn sẽ thích</h2>
          <MangaGrid items={relatedItems} />
        </div>
      )}
    </div>
  );
}
