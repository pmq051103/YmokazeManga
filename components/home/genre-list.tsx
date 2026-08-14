import Link from "next/link";
import { Genre } from "@/lib/api";

const PALETTE = [
  "bg-sakura-100 text-sakura-700 hover:bg-sakura-200",
  "bg-lilac-100 text-lilac-700 hover:bg-lilac-200",
  "bg-skyy-100 text-skyy-700 hover:bg-skyy-200",
];

export function GenreList({ genres }: { genres: Genre[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {genres.slice(0, 18).map((g, i) => (
        <Link
          key={g.id}
          href={`/manga?genre=${g.slug}&label=${encodeURIComponent(g.name)}`}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${PALETTE[i % PALETTE.length]}`}
        >
          {g.name}
        </Link>
      ))}
    </div>
  );
}
