import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://yomikaze.example.com/", changeFrequency: "daily", priority: 1 },
    { url: "https://yomikaze.example.com/manga", changeFrequency: "hourly", priority: 0.9 },
    { url: "https://yomikaze.example.com/search", changeFrequency: "daily", priority: 0.5 },
  ];
}
