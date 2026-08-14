import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-lilac-100 bg-white/70">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-lg">
            <Image src="/logo.png" alt="Yomikaze" fill className="object-contain" sizes="28px" />
          </span>
          <span className="font-display font-semibold text-foreground">Yomikaze</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <p className="text-center">
          Dữ liệu tổng hợp từ OTruyen &amp; MangaDex, chỉ dùng cho mục đích học tập.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/manga" className="hover:text-lilac-600">Danh sách</Link>
          <Link href="/bookmarks" className="hover:text-lilac-600">Yêu thích</Link>
          <Link href="/history" className="hover:text-lilac-600">Lịch sử</Link>
        </div>
      </div>
    </footer>
  );
}
