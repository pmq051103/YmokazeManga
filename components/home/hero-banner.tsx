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
    <section className="container pt-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-lilac-100/70 bg-hero-gradient shadow-soft">
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-sakura-200/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-skyy-200/60 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 rounded-full bg-lilac-200/60 blur-3xl" />

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {slides.map((manga, i) => (
              <div key={`${manga.source}-${manga.id}`} className="relative min-w-0 flex-[0_0_100%]">
                <div className="relative grid items-center gap-8 px-6 py-10 sm:px-10 md:grid-cols-[1fr_auto] md:gap-10 md:py-12">
                  <motion.div
                    key={selected === i ? "active" : `inactive-${i}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="min-w-0 max-w-2xl"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {manga.status !== "unknown" && (
                        <Badge variant="pink">{STATUS_LABEL[manga.status]}</Badge>
                      )}
                      {manga.genres.slice(0, 3).map((g) => (
                        <Badge key={g.id} variant="outline">
                          {g.name}
                        </Badge>
                      ))}
                    </div>

                    <h1 className="mt-3 font-display text-2xl font-extrabold leading-tight text-foreground sm:text-3xl md:text-4xl">
                      {manga.title}
                    </h1>

                    {manga.latestChapter && (
                      <p className="mt-2 text-sm font-medium text-muted-foreground md:text-base">
                        Cập nhật: {manga.latestChapter}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Button asChild size="lg">
                        <Link href={`/manga/${manga.slug}?src=${manga.source}`}>
                          <BookOpen className="h-4 w-4" /> Đọc ngay
                        </Link>
                      </Button>
                      <Button asChild size="lg" variant="outline">
                        <Link href="/manga">Khám phá thêm</Link>
                      </Button>
                    </div>
                  </motion.div>

                  <div className="relative mx-auto w-36 shrink-0 sm:w-44 md:w-48">
                    <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-sakura-200 via-lilac-200 to-skyy-200 blur-xl" />
                    <div className="relative animate-float overflow-hidden rounded-2xl border-4 border-white shadow-glow">
                      <div className="relative aspect-[3/4]">
                        <Image
                          src={manga.coverUrl}
                          alt={manga.title}
                          fill
                          sizes="192px"
                          className="object-cover"
                          priority={i === 0}
                          unoptimized
                        />
                      </div>
                    </div>
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
              className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 text-lilac-600 shadow-sm transition-colors hover:bg-white sm:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Ảnh tiếp theo"
              className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 text-lilac-600 shadow-sm transition-colors hover:bg-white sm:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Đến ảnh ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full bg-lilac-300 transition-all duration-300",
                    selected === i ? "w-6 bg-lilac-600" : "w-1.5 hover:bg-lilac-400"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
