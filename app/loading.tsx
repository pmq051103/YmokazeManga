import { MangaGridSkeleton } from "@/components/manga/manga-grid";

export default function Loading() {
  return (
    <div className="container py-10">
      <MangaGridSkeleton count={18} />
    </div>
  );
}
