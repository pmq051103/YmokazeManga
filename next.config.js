/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "otruyenapi.com" },
      { protocol: "https", hostname: "img.otruyenapi.com" },
      { protocol: "https", hostname: "sv1.otruyencdn.com" },
      { protocol: "https", hostname: "**.otruyencdn.com" },
      { protocol: "https", hostname: "uploads.mangadex.org" },
      { protocol: "https", hostname: "mangadex.org" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

module.exports = nextConfig;
