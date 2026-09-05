import { products } from "./data/products";
import * as jsonProducts from "./products-json";
import type { Product } from "./types";

export interface BrandInfo {
  slug: string;
  name: string;
  productCount: number;
  countries: string[];
  avgTrust: number;
}

export function slugifyBrand(name: string): string {
  return (name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function getAllBrands(): BrandInfo[] {
  const map = new Map<string, BrandInfo>();
  const allProds: Product[] = jsonProducts.getAllProducts().length > 0
    ? jsonProducts.getAllProducts()
    : products;

  for (const p of allProds) {
    if (!p.brand) continue;
    const slug = slugifyBrand(p.brand);
    if (!slug) continue;
    const existing = map.get(slug);
    const countries = (p.versions || []).map((v) => v.country).filter(Boolean);

    if (existing) {
      existing.productCount += 1;
      countries.forEach((c) => {
        if (!existing.countries.includes(c)) existing.countries.push(c);
      });
      existing.avgTrust = Math.round(
        (existing.avgTrust * (existing.productCount - 1) + (p.trustScore || 85)) / existing.productCount
      );
    } else {
      map.set(slug, {
        slug,
        name: p.brand,
        productCount: 1,
        countries: [...new Set(countries)],
        avgTrust: p.trustScore || 85,
      });
    }
  }

  return [...map.values()].sort((a, b) => b.productCount - a.productCount);
}

export function getProductsByBrand(slug: string): Product[] {
  const jsonMatches = jsonProducts.getAllProducts().filter((p) => slugifyBrand(p.brand) === slug);
  if (jsonMatches.length > 0) return jsonMatches;
  return products.filter((p) => slugifyBrand(p.brand) === slug);
}

export function getBrandBySlug(slug: string): BrandInfo | undefined {
  return getAllBrands().find((b) => b.slug === slug);
}
