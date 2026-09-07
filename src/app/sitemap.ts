import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://louinaquines.online/",
      lastModified: "2026-08-21",
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
