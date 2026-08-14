"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MangaSummary } from "@/lib/api";
import { MangaCard } from "./manga-card";
import { Button } from "@/components/ui/button";

export function MangaCarousel({ items }: { items: MangaSummary[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {items.map((m, i) => (
            <div key={`${m.source}-${m.id}`} className="w-[42%] shrink-0 sm:w-[26%] md:w-[19%] lg:w-[15%]">
              <MangaCard manga={m} priority={i < 4} />
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canPrev}
        className="absolute -left-4 top-[38%] hidden -translate-y-1/2 bg-white sm:flex"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canNext}
        className="absolute -right-4 top-[38%] hidden -translate-y-1/2 bg-white sm:flex"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
