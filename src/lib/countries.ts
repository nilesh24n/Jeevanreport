import type { PackSizeChange, Product } from "./types";
import { products } from "./data/products";

export function getProductsByCountry(country: string): Product[] {
  return products.filter((p) => p.versions.some((v) => v.country === country));
}

export function getCountryStats(country: string) {
  const countryProducts = getProductsByCountry(country);
  return {
    productCount: countryProducts.length,
    shrinkflationCount: countryProducts.filter((p) =>
      p.packSizeChanges.some((c) => c.country === country)
    ).length,
    avgTrust: countryProducts.length
      ? Math.round(countryProducts.reduce((s, p) => s + p.trustScore, 0) / countryProducts.length)
      : 0,
  };
}

export function buildPackTimeline(changes: PackSizeChange[]) {
  return [...changes].sort((a, b) => b.date.localeCompare(a.date));
}
