import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

// NOTE: using a system rounded font stack (defined in globals.css via
// --font-display / --font-body) instead of next/font/google so the project
// builds in network-restricted environments (CI, sandboxes) without
// reaching out to fonts.googleapis.com. To use real "Baloo 2" / "Nunito"
// webfonts in production, swap this back to next/font/google:
//
//   import { Baloo_2, Nunito } from "next/font/google";
//   const display = Baloo_2({ subsets: ["latin","vietnamese"], variable: "--font-display", weight: ["500","600","700","800"] });
//   const body = Nunito({ subsets: ["latin","vietnamese"], variable: "--font-body", weight: ["400","500","600","700"] });
// ...and add `${display.variable} ${body.variable}` back to the <body> className below.

export const metadata: Metadata = {
  metadataBase: new URL("https://yomikaze.example.com"),
  title: {
    default: "Yomikaze — Đọc Manga & Truyện Tranh Online",
    template: "%s | Yomikaze",
  },
  description:
    "Yomikaze là nền tảng đọc manga, manhwa, manhua online miễn phí — cập nhật nhanh, giao diện sáng, mượt mà trên mọi thiết bị.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Yomikaze — Đọc Manga & Truyện Tranh Online",
    description:
      "Khám phá hàng ngàn bộ manga/manhwa/manhua, cập nhật chương mới mỗi ngày.",
    type: "website",
    locale: "vi_VN",
    siteName: "Yomikaze",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yomikaze — Đọc Manga & Truyện Tranh Online",
    description: "Nền tảng đọc manga online sáng, nhanh, mượt.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="font-body">
        <ThemeProvider>
          <QueryProvider>
            <div className="flex min-h-screen flex-col bg-hero-gradient">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
