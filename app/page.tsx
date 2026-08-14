import { Flame, Clock3, LayoutGrid } from "lucide-react";
import { mangaApi } from "@/lib/api";
import { HeroBanner } from "@/components/home/hero-banner";
import { GenreList } from "@/components/home/genre-list";
import { Section } from "@/components/home/section";
import { MangaCarousel } from "@/components/manga/manga-carousel";
import { MangaGrid } from "@/components/manga/manga-grid";

export const revalidate = 60;

export default async function HomePage() {
  const [trending, latest, genres] = await Promise.allSettled([
    mangaApi.list({ sort: "updated", page: 1 }),
    mangaApi.list({ sort: "newest", page: 1 }),
    mangaApi.genres(),
  ]);

  const trendingItems = trending.status === "fulfilled" ? trending.value.items : [];
  const latestItems = latest.status === "fulfilled" ? latest.value.items : [];
  const genreItems = genres.status === "fulfilled" ? genres.value.items : [];

  return (
    <>
      <HeroBanner featured={trendingItems[0]} />

      {genreItems.length > 0 && (
        <Section title="Thể loại" icon={<LayoutGrid className="h-5 w-5 text-lilac-500" />}>
          <GenreList genres={genreItems} />
        </Section>
      )}

      <Section
        title="Đang thịnh hành"
        subtitle="Những bộ truyện được đọc nhiều nhất tuần này"
        icon={<Flame className="h-5 w-5 text-sakura-500" />}
        href="/manga?sort=updated"
      >
        <MangaCarousel items={trendingItems.slice(0, 14)} />
      </Section>

      <Section
        title="Mới cập nhật"
        subtitle="Chương mới nhất từ khắp các nguồn"
        icon={<Clock3 className="h-5 w-5 text-skyy-500" />}
        href="/manga?sort=newest"
      >
        <MangaGrid items={latestItems.slice(0, 18)} />
      </Section>
    </>
  );
}
