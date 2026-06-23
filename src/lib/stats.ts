import { products, changeFeed, countries, categories } from "./data/products";

export function getPlatformStats() {
  const shrinkflationCount = products.filter((p) => p.packSizeChanges.length > 0).length;
  const formulaChangeCount = products.filter((p) => p.formulaChanges.length > 0).length;
  const priceChangeCount = products.filter((p) => p.prices.length >= 2).length;
  const totalChanges = changeFeed.length;

  return {
    productCount: products.length,
    countryCount: countries.length,
    categoryCount: categories.length,
    shrinkflationCount,
    formulaChangeCount,
    priceChangeCount,
    totalChanges,
    avgTrustScore: Math.round(
      products.reduce((sum, p) => sum + p.trustScore, 0) / products.length
    ),
  };
}

export function getSimilarProducts(productId: string, limit = 4) {
  const product = products.find((p) => p.id === productId);
  if (!product) return [];
  return products
    .filter((p) => p.id !== productId && p.category === product.category)
    .slice(0, limit);
}
