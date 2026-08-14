"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LayoutGrid } from "lucide-react";
import { mangaApi } from "@/lib/api";
import { cn } from "@/lib/utils/cn";

const PER_COLUMN = 10;

export function GenreMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["navbar-genres"],
    queryFn: () => mangaApi.genres(),
    staleTime: 1000 * 60 * 30,
  });
  const genres = data?.items ?? [];

  const columns: (typeof genres)[] = [];
  for (let i = 0; i < genres.length; i += PER_COLUMN) {
    columns.push(genres.slice(i, i + PER_COLUMN));
  }

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-lilac-50 hover:text-lilac-700",
          open && "bg-lilac-50 text-lilac-700"
        )}
      >
        <LayoutGrid className="h-4 w-4" />
        Thư viện thể loại
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 top-12 z-50 -translate-x-1/2 rounded-2xl border border-lilac-100 bg-white p-4 shadow-soft"
          >
            {columns.length === 0 && (
              <p className="px-2 py-4 text-sm text-muted-foreground">Đang tải thể loại...</p>
            )}
            <div className="flex max-w-[min(90vw,900px)] gap-x-6 gap-y-1 overflow-x-auto">
              {columns.map((col, ci) => (
                <ul key={ci} className="flex w-40 shrink-0 flex-col gap-0.5">
                  {col.map((g) => (
                    <li key={g.id}>
                      <Link
                        href={`/manga?genre=${g.slug}&label=${encodeURIComponent(g.name)}`}
                        onClick={() => setOpen(false)}
                        className="block truncate rounded-lg px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-lilac-50 hover:text-lilac-700"
                      >
                        {g.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
