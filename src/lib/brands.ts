import { products } from "./data/products";

export interface BrandInfo {
  slug: string;
  name: string;
  productCount: number;
  countries: string[];
  avgTrust: number;
}

export function slugifyBrand(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function getAllBrands(): BrandInfo[] {
  const map = new Map<string, BrandInfo>();

  for (const p of products) {
    const slug = slugifyBrand(p.brand);
    const existing = map.get(slug);
    const countries = p.versions.map((v) => v.country);

    if (existing) {
      existing.productCount += 1;
      countries.forEach((c) => {
        if (!existing.countries.includes(c)) existing.countries.push(c);
      });
      existing.avgTrust = Math.round(
        (existing.avgTrust * (existing.productCount - 1) + p.trustScore) / existing.productCount
      );
    } else {
      map.set(slug, {
        slug,
        name: p.brand,
        productCount: 1,
        countries: [...new Set(countries)],
        avgTrust: p.trustScore,
      });
    }
  }

  return [...map.values()].sort((a, b) => b.productCount - a.productCount);
}

export function getProductsByBrand(slug: string) {
  return products.filter((p) => slugifyBrand(p.brand) === slug);
}

export function getBrandBySlug(slug: string): BrandInfo | undefined {
  return getAllBrands().find((b) => b.slug === slug);
}
