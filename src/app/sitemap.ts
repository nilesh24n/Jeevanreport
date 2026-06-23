import type { MetadataRoute } from "next";
import { products, countries } from "@/lib/data/products";
import { getAllBrands } from "@/lib/brands";
import { ingredientGlossary } from "@/lib/ingredient-glossary";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://jeevanreport.org";

  const staticPages = [
    "", "scan", "search", "products", "countries", "brands", "ingredients", "compare", "submit", "methodology",
    "dashboard", "latest-changes", "leaderboard", "categories", "about", "faq", "contact", "api-docs",
    "privacy", "terms", "disclaimer", "data-sources", "community-guidelines",
  ];

  const categorySlugs = [
    "snacks", "cereal", "drinks", "dairy", "instant-foods",
    "household", "toiletries", "pet-food", "otc-health",
  ];

  return [
    ...staticPages.map((path) => ({
      url: `${base}/${path}`,
      lastModified: new Date(),
      changeFrequency: (path === "" || path === "latest-changes" ? "daily" : "weekly") as "daily" | "weekly",
      priority: path === "" ? 1 : path === "scan" ? 0.9 : 0.7,
    })),
    ...categorySlugs.map((slug) => ({
      url: `${base}/categories/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...countries.map((country) => ({
      url: `${base}/countries/${country}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.65,
    })),
    ...getAllBrands().map((b) => ({
      url: `${base}/brands/${b.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...ingredientGlossary.map((e) => ({
      url: `${base}/ingredients/${e.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...products.map((p) => ({
      url: `${base}/products/${p.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
