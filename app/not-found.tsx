import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="font-display text-6xl font-extrabold text-gradient">404</span>
      <h1 className="mt-3 font-display text-xl font-bold text-foreground">Không tìm thấy trang</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Trang hoặc bộ truyện bạn tìm không tồn tại, hoặc đã bị gỡ khỏi cả hai nguồn dữ liệu.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Về trang chủ</Link>
      </Button>
    </div>
  );
}
