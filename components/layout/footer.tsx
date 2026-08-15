import Link from "next/link";
import Image from "next/image";
import { BookOpen, Heart, History, Search, ShieldCheck } from "lucide-react";

const NAV_ITEMS = [
  { href: "/manga", label: "Danh sách truyện", icon: BookOpen },
  { href: "/search", label: "Tìm kiếm", icon: Search },
  { href: "/bookmarks", label: "Truyện yêu thích", icon: Heart },
  { href: "/history", label: "Lịch sử đọc", icon: History },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-lilac-100 bg-gradient-to-b from-white to-lilac-50/60">
      <div className="container grid gap-8 py-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg shadow-sm">
              <Image
                src="/logo.png"
                alt="Yomikaze"
                fill
                className="object-contain"
                sizes="32px"
              />
            </span>
            <span className="font-display text-lg font-bold text-foreground">Yomikaze</span>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Trang đọc truyện tranh online miễn phí với giao diện mượt mà, hỗ trợ lưu lịch sử đọc và
            bộ sưu tập yêu thích của riêng bạn.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-lilac-600 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5" />
            Không lưu trữ bất kỳ nội dung nào
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wide text-foreground">
            Khám phá
          </h4>
          <ul className="mt-3 space-y-2">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-lilac-600"
                >
                  <Icon className="h-4 w-4 text-lilac-400" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wide text-foreground">
            Tuyên bố miễn trừ
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Toàn bộ dữ liệu truyện được lấy tự động từ các trang web bên thứ ba.
            Website chỉ tổng hợp và hiển thị, không lưu trữ hay sở hữu bất kỳ hình ảnh hay nội dung
            nào trên máy chủ của mình. Nội dung được chia sẻ nhằm mục đích học tập và giải trí.
          </p>
        </div>
      </div>

      <div className="border-t border-lilac-100">
        <div className="container flex flex-col items-center justify-between gap-2 py-4 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Yomikaze. Tất cả các quyền được bảo lưu.</p>
          <p>
            Website được phát triển bởi{" "}
            <span className="font-semibold text-lilac-600">Phạm Minh Quang</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
