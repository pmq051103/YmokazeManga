# Yomikaze — Manga & Comic Reader

Nền tảng đọc manga/manhwa/manhua online, xây bằng Next.js 14 (App Router) +
TypeScript, phong cách anime sáng (trắng / hồng phấn / tím nhạt / xanh da trời),
lấy dữ liệu từ **OTruyen** (nguồn chính) và tự động chuyển sang **MangaDex**
(nguồn dự phòng) khi nguồn chính lỗi.

## ✨ Tính năng

- Trang chủ: hero banner động, carousel truyện thịnh hành, mới cập nhật, danh sách thể loại
- Danh sách truyện: lọc theo thể loại/trạng thái/sắp xếp, infinite scroll
- Trang chi tiết: bìa, mô tả, tác giả, thể loại, danh sách chương (sắp xếp được), truyện liên quan, SEO meta/OG
- Reader: đọc cuộn dọc, lazy-load ảnh, điều hướng chương trước/sau, thanh điều khiển sticky
- Tìm kiếm real-time có debounce + gợi ý ngay trên navbar
- Lưu truyện yêu thích & lịch sử đọc bằng `localStorage`
- Chế độ sáng mặc định, có thể bật tối (toggle ở navbar)
- Skeleton loading, code-splitting theo route (App Router mặc định)

## ⚙️ Tech stack

| Layer       | Công nghệ |
|-------------|-----------|
| Framework   | Next.js 14 (App Router) + TypeScript |
| Styling     | Tailwind CSS + component pattern kiểu shadcn/ui |
| Data fetch  | @tanstack/react-query |
| Animation   | Framer Motion |
| Carousel    | embla-carousel-react |
| Icons       | lucide-react |

## 🚀 Bắt đầu

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000). Cả hai API đều **miễn phí,
không cần API key**, nên không bắt buộc phải tạo file `.env` — xem
`.env.example` nếu bạn muốn cấu hình thêm.

## 📦 Build & Deploy (Vercel)

```bash
npm run build
npm run start   # kiểm tra bản production tại local
```

Deploy lên Vercel:

1. Push repo lên GitHub.
2. Import project trên [vercel.com/new](https://vercel.com/new).
3. Không cần khai báo biến môi trường bắt buộc — bấm **Deploy**.

## 🗂️ Cấu trúc thư mục

```
app/
  layout.tsx              # Root layout: fonts, providers, navbar/footer, SEO mặc định
  page.tsx                # Trang chủ
  manga/page.tsx           # Danh sách truyện (filter + infinite scroll)
  manga/[slug]/page.tsx     # Chi tiết truyện (server component, generateMetadata)
  manga/[slug]/[chapter]/page.tsx  # Reader (client component)
  search/page.tsx          # Kết quả tìm kiếm
  bookmarks/page.tsx       # Truyện yêu thích (localStorage)
  history/page.tsx         # Lịch sử đọc (localStorage)
  sitemap.ts, robots.ts    # SEO
  loading.tsx, error.tsx, not-found.tsx

components/
  ui/            # Button, Card, Badge, Input, Select, Skeleton (kiểu shadcn/ui)
  layout/        # Navbar, Footer
  home/          # HeroBanner, GenreList, Section
  manga/         # MangaCard, MangaGrid, MangaCarousel, ChapterList, BookmarkButton
  reader/        # ReaderImage (lazy-load ảnh trang truyện)

lib/
  api/
    types.ts     # Kiểu dữ liệu chuẩn hoá dùng chung toàn app
    http.ts       # fetch wrapper có timeout + SourceUnavailableError
    otruyen.ts    # Adapter nguồn chính — map response OTruyen -> unified types
    mangadex.ts   # Adapter nguồn dự phòng — map response MangaDex -> unified types
    index.ts      # mangaApi: điều phối fallback OTruyen -> MangaDex
  hooks/          # useDebounce, useBookmarks, useReadingHistory, useInView
  utils/cn.ts     # class merge helper

providers/
  query-provider.tsx   # React Query client
  theme-provider.tsx   # Light/dark toggle (mặc định light)
```

## 🔌 Lớp API abstraction hoạt động thế nào

`lib/api/index.ts` export một object `mangaApi` duy nhất mà toàn bộ UI sử
dụng — không có component nào gọi trực tiếp OTruyen hay MangaDex.

1. Mỗi adapter (`otruyen.ts`, `mangadex.ts`) tự chuẩn hoá response gốc của
   API tương ứng thành các kiểu dùng chung trong `types.ts`
   (`MangaSummary`, `MangaDetail`, `Chapter`, `ChapterPages`...).
2. Khi gọi `fetchJson`, nếu request timeout / trả về lỗi HTTP / parse thất
   bại, hàm sẽ ném `SourceUnavailableError`.
3. `withFallback()` trong `index.ts` bắt lỗi đó và tự động gọi lại đúng
   request tương đương ở MangaDex, rồi gắn cờ `sourceUsed` để UI biết dữ
   liệu đang hiển thị đến từ nguồn nào (badge "Nguồn: OTruyen / MangaDex"
   trên trang chi tiết).
4. Vì hai nguồn có id khác định dạng (OTruyen dùng slug tiếng Việt,
   MangaDex dùng UUID), URL luôn mang theo `?src=otruyen|mangadex` để trang
   chi tiết/reader biết chính xác gọi adapter nào tiếp theo, tránh trộn
   lẫn slug của nguồn này với id của nguồn kia.

## 📝 Ghi chú

- Dữ liệu localStorage (`yomikaze:bookmarks`, `yomikaze:history`,
  `yomikaze:theme`) chỉ lưu trên trình duyệt người dùng, không đồng bộ
  server — phù hợp cho MVP, có thể thay bằng DB + auth sau này.
- Ảnh trang truyện dùng thẻ `<img loading="lazy">` thuần thay vì
  `next/image` vì domain CDN ảnh thay đổi liên tục theo từng server/chapter
  của cả hai nguồn.
- Dự án dùng App Router nên mỗi route đã tự động code-split.
