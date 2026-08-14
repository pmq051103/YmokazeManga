"use client";

import { useRef, useState } from "react";
import { useInView } from "@/lib/hooks/useInView";
import { cn } from "@/lib/utils/cn";

export function ReaderImage({ src, index, total }: { src: string; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, "800px");
  const [loaded, setLoaded] = useState(false);

  return (
    <div ref={ref} className="relative w-full max-w-3xl">
      {!loaded && (
        <div className="flex aspect-[2/3] w-full animate-pulse items-center justify-center bg-lilac-100/60 text-xs text-lilac-400">
          Trang {index}/{total}
        </div>
      )}
      {inView && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`Trang ${index}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={cn(
            "w-full transition-opacity duration-500",
            loaded ? "opacity-100" : "absolute inset-0 opacity-0"
          )}
        />
      )}
    </div>
  );
}
