import { Flame, Clock3, Sparkles, Library, PlayCircle, LayoutGrid, Globe } from "lucide-react";
import { mangaApi } from "@/lib/api";
import { HeroBanner } from "@/components/home/hero-banner";
import { Section } from "@/components/home/section";
import { RankingSidebar } from "@/components/home/ranking-sidebar";
import { StatsBar, StatItem } from "@/components/home/stats-bar";
import { MangaCarousel } from "@/components/manga/manga-carousel";
import { MangaGrid } from "@/components/manga/manga-grid";

export const revalidate = 60;

export default async function HomePage() {
  const [trending, latest, topRated, genres] = await Promise.allSettled([
    mangaApi.list({ sort: "updated", page: 1 }),
    mangaApi.list({ sort: "newest", page: 1 }),
    mangaApi.list({ sort: "rating", page: 1 }),
    mangaApi.genres(),
  ]);

  const trendingItems = trending.status === "fulfilled" ? trending.value.items : [];
  const latestItems = latest.status === "fulfilled" ? latest.value.items : [];
  const topRatedItems = topRated.status === "fulfilled" ? topRated.value.items : trendingItems;
  const genreItems = genres.status === "fulfilled" ? genres.value.items : [];

  const stats: StatItem[] = [
    // `newest` maps to OTruyen's "truyen-moi" endpoint, whose pagination.totalItems
    // is the full catalogue count (everything on the site). `updated` maps to
    // "dang-phat-hanh" which is only the ongoing subset, so it must stay smaller.
    { label: "Tổng số truyện", value: latest.status === "fulfilled" ? latest.value.totalItems ?? 0 : 0, suffix: "+", icon: Library },
    { label: "Truyện đang tiến hành", value: trending.status === "fulfilled" ? trending.value.totalItems ?? 0 : 0, suffix: "+", icon: PlayCircle },
    { label: "Số thể loại", value: genreItems.length, icon: LayoutGrid },
    { label: "Nguồn dữ liệu", value: 2, icon: Globe },
  ];

  // A couple of "hot" genres to spotlight with their own row on the homepage,
  // instead of dumping the whole genre list here (that now lives in the
  // header's "Thư viện thể loại" dropdown).
  const hotGenres = genreItems.slice(0, 2);
  const hotGenreResults = await Promise.allSettled(
    hotGenres.map((g) => mangaApi.listByGenre(g.slug, 1))
  );

  return (
    <>
      <HeroBanner items={trendingItems} />

      <StatsBar stats={stats} />

      <div className="container grid gap-8 py-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <Section
            title="Đang thịnh hành"
            subtitle="Những bộ truyện đang tiến hành được đọc nhiều nhất"
            icon={<Flame className="h-5 w-5 text-sakura-500" />}
            href="/manga?sort=updated"
            bare
          >
            <MangaCarousel items={trendingItems.slice(0, 14)} />
          </Section>

          <Section
            title="Mới cập nhật"
            subtitle="Chương mới nhất từ khắp các nguồn"
            icon={<Clock3 className="h-5 w-5 text-skyy-500" />}
            href="/manga?sort=newest"
            className="mt-8"
            bare
          >
            <MangaGrid items={latestItems.slice(0, 12)} />
          </Section>

          {hotGenres.map((g, i) => {
            const result = hotGenreResults[i];
            const items = result.status === "fulfilled" ? result.value.items : [];
            if (items.length === 0) return null;
            return (
              <Section
                key={g.id}
                title={g.name}
                subtitle="Thể loại nổi bật"
                icon={<Sparkles className="h-5 w-5 text-lilac-500" />}
                href={`/manga?genre=${g.slug}&label=${encodeURIComponent(g.name)}`}
                className="mt-8"
                bare
              >
                <MangaCarousel items={items.slice(0, 14)} />
              </Section>
            );
          })}
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <RankingSidebar day={latestItems} week={trendingItems} month={topRatedItems} />
        </aside>
      </div>
    </>
  );
}
