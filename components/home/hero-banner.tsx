"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MangaSummary } from "@/lib/api";

export function HeroBanner({ featured }: { featured?: MangaSummary }) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-sakura-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-32 h-72 w-72 rounded-full bg-skyy-200/50 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 -top-10 h-56 w-56 rounded-full bg-lilac-200/50 blur-3xl" />

      <div className="container relative grid gap-10 py-14 md:grid-cols-2 md:items-center md:py-20">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-lilac-600 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" /> Cập nhật mỗi ngày
          </span>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-foreground sm:text-5xl">
            Đắm chìm trong thế giới{" "}
            <span className="text-gradient">manga &amp; manhwa</span>
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Hàng ngàn bộ truyện, cập nhật nhanh, đọc mượt trên mọi thiết bị — giao diện
            sáng, nhẹ nhàng như một trang artbook.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/manga">
                <BookOpen className="h-4 w-4" /> Khám phá ngay
              </Link>
            </Button>
            {featured && (
              <Button asChild size="lg" variant="outline">
                <Link href={`/manga/${featured.slug}?src=${featured.source}`}>
                  Xem truyện nổi bật
                </Link>
              </Button>
            )}
          </div>
        </motion.div>

        {featured && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative mx-auto w-56 sm:w-64"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-sakura-200 via-lilac-200 to-skyy-200 blur-xl" />
            <div className="relative animate-float">
              <div className="overflow-hidden rounded-[1.75rem] border-4 border-white shadow-glow">
                <div className="relative aspect-[3/4]">
                  <Image
                    src={featured.coverUrl}
                    alt={featured.title}
                    fill
                    className="object-cover"
                    sizes="260px"
                    unoptimized
                    priority
                  />
                </div>
              </div>
              <div className="absolute -bottom-4 left-1/2 w-[85%] -translate-x-1/2 rounded-xl bg-white px-3 py-2 text-center shadow-soft">
                <p className="truncate text-xs font-semibold text-foreground">{featured.title}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
