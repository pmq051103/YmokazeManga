"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { BookMarked, Menu, Moon, Search, Sun, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mangaApi } from "@/lib/api";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useTheme } from "@/providers/theme-provider";
import { cn } from "@/lib/utils/cn";
import { GenreMenu } from "@/components/layout/genre-menu";

const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/manga?sort=newest", label: "Mới cập nhật" },
  { href: "/bookmarks", label: "Yêu thích" },
  { href: "/history", label: "Lịch sử" },
];

export function Navbar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const debounced = useDebounce(query, 350);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  const { data, isFetching } = useQuery({
    queryKey: ["search-suggestions", debounced],
    queryFn: () => mangaApi.search(debounced, 1),
    enabled: debounced.trim().length > 1,
  });

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  function submitSearch() {
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-lilac-100/70 bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-sakura-400 to-lilac-500 text-lg font-display font-bold text-white shadow-card">
            未
          </span>
          <span className="font-display text-xl font-bold text-gradient hidden sm:inline">
            Yomikaze
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l, i) => (
            <React.Fragment key={l.label}>
              <Link
                href={l.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-lilac-50 hover:text-lilac-700"
              >
                {l.label}
              </Link>
              {i === 0 && <GenreMenu />}
            </React.Fragment>
          ))}
        </nav>

        <div ref={containerRef} className="relative w-full max-w-xs flex-1 md:max-w-sm">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-lilac-400" />
            <Input
              value={query}
              placeholder="Tìm manga, tác giả..."
              className="pl-10"
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(e) => e.key === "Enter" && submitSearch()}
            />
          </div>

          <AnimatePresence>
            {open && debounced.trim().length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-12 max-h-96 overflow-y-auto rounded-2xl border border-lilac-100 bg-white p-2 shadow-soft"
              >
                {isFetching && (
                  <p className="px-3 py-4 text-sm text-muted-foreground">Đang tìm kiếm...</p>
                )}
                {!isFetching && data?.items.length === 0 && (
                  <p className="px-3 py-4 text-sm text-muted-foreground">
                    Không tìm thấy kết quả cho “{debounced}”.
                  </p>
                )}
                {!isFetching &&
                  data?.items.slice(0, 6).map((m) => (
                    <Link
                      key={m.id}
                      href={`/manga/${m.slug}?src=${m.source}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-lilac-50"
                    >
                      <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-md bg-lilac-100">
                        <Image src={m.coverUrl} alt={m.title} fill className="object-cover" sizes="40px" unoptimized />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{m.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {m.genres.slice(0, 2).map((g) => g.name).join(", ") || "Manga"}
                        </p>
                      </div>
                    </Link>
                  ))}
                {!isFetching && (data?.items.length ?? 0) > 0 && (
                  <button
                    onClick={submitSearch}
                    className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-lilac-600 hover:bg-lilac-50"
                  >
                    Xem tất cả kết quả cho “{debounced}” →
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Đổi giao diện sáng/tối">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link href="/bookmarks">
              <BookMarked className="h-4 w-4" />
              Yêu thích
            </Link>
          </Button>
        </div>

        <button
          className="shrink-0 rounded-full p-2 text-lilac-600 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Mở menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[55] bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              key="mobile-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
              className="fixed right-0 top-0 z-[60] flex h-dvh w-72 max-w-[85vw] flex-col border-l border-lilac-100 bg-white shadow-soft md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Menu điều hướng"
            >
              <div className="flex items-center justify-between border-b border-lilac-100 px-5 py-4">
                <span className="font-display text-lg font-bold text-gradient">Yomikaze</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full p-2 text-lilac-600 transition-colors hover:bg-lilac-50"
                  aria-label="Đóng menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
                {NAV_LINKS.map((l, i) => (
                  <React.Fragment key={l.label}>
                    <Link
                      href={l.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-lilac-50 hover:text-lilac-700"
                      )}
                    >
                      {l.label}
                    </Link>
                    {i === 0 && (
                      <Link
                        href="/manga"
                        onClick={() => setMobileOpen(false)}
                        className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-lilac-50 hover:text-lilac-700"
                      >
                        Thư viện thể loại
                      </Link>
                    )}
                  </React.Fragment>
                ))}

                <div className="mt-auto border-t border-lilac-100 pt-3">
                  <button
                    onClick={toggleTheme}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-lilac-50"
                  >
                    {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    Chế độ {theme === "light" ? "tối" : "sáng"}
                  </button>
                  <Button asChild variant="secondary" size="sm" className="mt-2 w-full justify-start">
                    <Link href="/bookmarks" onClick={() => setMobileOpen(false)}>
                      <BookMarked className="h-4 w-4" />
                      Yêu thích
                    </Link>
                  </Button>
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
