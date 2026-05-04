import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://eggsbot.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    {
      path: "/egg-prices-today",
      priority: 0.9,
      changeFrequency: "daily" as const,
    },
    {
      path: "/cheapest-eggs-near-me",
      priority: 0.9,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/why-are-eggs-so-expensive",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/organic-vs-cage-free-eggs",
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    {
      path: "/costco-egg-prices",
      priority: 0.8,
      changeFrequency: "weekly" as const,
    },
    {
      path: "/aldi-egg-prices",
      priority: 0.8,
      changeFrequency: "weekly" as const,
    },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
