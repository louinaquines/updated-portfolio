import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://louinaquines.online/",
      lastModified: "2026-08-21",
      changeFrequency: "monthly",
      priority: 1,
      images: [
        "https://louinaquines.online/images/profile.png",
        "https://louinaquines.online/images/hero-person-cutout.png",
      ],
    },
  ];
}
