"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MangaSummary } from "@/lib/api";
import { cn } from "@/lib/utils/cn";

const STATUS_LABEL: Record<string, string> = {
  ongoing: "Đang tiến hành",
  completed: "Hoàn thành",
  hiatus: "Tạm ngưng",
  unknown: "",
};

export function HeroBanner({ items }: { items: MangaSummary[] }) {
  const slides = items.slice(0, 5);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: slides.length > 1 });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || slides.length < 2) return;
    const timer = setInterval(() => emblaApi.scrollNext(), 6000);
    return () => clearInterval(timer);
  }, [emblaApi, slides.length]);

  if (slides.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-foreground/5">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((manga, i) => (
            <div key={`${manga.source}-${manga.id}`} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative h-[340px] w-full sm:h-[400px] md:h-[460px] lg:h-[520px]">
                <Image
                  src={manga.coverUrl}
                  alt={manga.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={i === 0}
                  unoptimized
                />
                {/* readability gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                <div className="absolute inset-0 hidden bg-gradient-to-r from-black/80 via-black/20 to-transparent md:block" />

                <div className="container relative flex h-full items-end pb-10 md:items-center md:pb-0">
                  <motion.div
                    key={selected === i ? "active" : `inactive-${i}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="max-w-xl"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {manga.status !== "unknown" && (
                        <Badge variant="pink" className="bg-white/90 text-sakura-600 shadow-sm">
                          {STATUS_LABEL[manga.status]}
                        </Badge>
                      )}
                      {manga.genres.slice(0, 3).map((g) => (
                        <Badge key={g.id} variant="outline" className="border-white/40 text-white/90">
                          {g.name}
                        </Badge>
                      ))}
                    </div>

                    <h1 className="mt-3 font-display text-2xl font-extrabold leading-tight text-white drop-shadow-sm sm:text-3xl md:text-4xl lg:text-5xl">
                      {manga.title}
                    </h1>

                    {manga.latestChapter && (
                      <p className="mt-2 text-sm font-medium text-white/80 md:text-base">
                        Cập nhật: {manga.latestChapter}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Button asChild size="lg">
                        <Link href={`/manga/${manga.slug}?src=${manga.source}`}>
                          <BookOpen className="h-4 w-4" /> Đọc ngay
                        </Link>
                      </Button>
                      <Button asChild size="lg" variant="outline" className="border-white/50 bg-white/10 text-white hover:bg-white/20">
                        <Link href="/manga">Khám phá thêm</Link>
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Ảnh trước"
            className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Ảnh tiếp theo"
            className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`Đến ảnh ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full bg-white/50 transition-all duration-300",
                  selected === i ? "w-6 bg-white" : "w-1.5 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
