import { Info } from "lucide-react";
import { MangaDetail } from "@/lib/api";

const STATUS_LABEL: Record<string, string> = {
  ongoing: "Đang tiến hành",
  completed: "Hoàn thành",
  hiatus: "Tạm ngưng",
  unknown: "Không rõ",
};

function formatDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("vi-VN");
}

export function MangaInfo({ manga }: { manga: MangaDetail }) {
  const rows: { label: string; value: string }[] = [];

  if (manga.author.length > 0) {
    rows.push({ label: "Tác giả", value: manga.author.join(", ") });
  }
  rows.push({ label: "Trạng thái", value: STATUS_LABEL[manga.status] });
  if (manga.year) {
    rows.push({ label: "Năm xuất bản", value: String(manga.year) });
  }
  if (manga.chapters.length > 0) {
    rows.push({
      label: "Số chương",
      value: `${manga.chapters.length.toLocaleString("vi-VN")} chương`,
    });
  }
  if (manga.latestChapter) {
    rows.push({ label: "Chương mới nhất", value: manga.latestChapter });
  }
  const updated = formatDate(manga.updatedAt);
  if (updated) {
    rows.push({ label: "Cập nhật lần cuối", value: updated });
  }
  if (manga.rating) {
    rows.push({ label: "Đánh giá", value: `${manga.rating.toFixed(1)} / 10` });
  }

  if (rows.length === 0) return null;

  return (
    <div className="rounded-2xl border border-lilac-100 bg-white/70 p-4 shadow-sm">
      <h3 className="mb-3 flex items-center gap-2 font-display text-base font-bold text-foreground">
        <Info className="h-4 w-4 text-lilac-500" /> Thông tin truyện
      </h3>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        {rows.map((row) => (
          <div key={row.label} className="min-w-0">
            <dt className="text-xs text-muted-foreground">{row.label}</dt>
            <dd className="mt-0.5 break-words text-sm font-semibold text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
