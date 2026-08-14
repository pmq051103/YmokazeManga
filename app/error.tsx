"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="font-display text-xl font-bold text-foreground">Đã có lỗi xảy ra</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Không thể tải dữ liệu từ OTruyen hoặc MangaDex ngay lúc này.
      </p>
      <Button className="mt-6" onClick={() => reset()}>
        Thử lại
      </Button>
    </div>
  );
}
