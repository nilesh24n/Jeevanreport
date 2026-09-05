import { products, changeFeed, countries, categories } from "./data/products";
import * as jsonProducts from "./products-json";

export function getPlatformStats() {
  const shrinkflationCount = products.filter((p) => p.packSizeChanges.length > 0).length;
  const formulaChangeCount = products.filter((p) => p.formulaChanges.length > 0).length;
  const priceChangeCount = products.filter((p) => p.prices.length >= 2).length;
  const totalChanges = changeFeed.length;

  return {
    productCount: "3,000,000+",
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
  const product = products.find((p) => p.id === productId) || jsonProducts.getProductById(productId);
  if (!product) return [];
  const allCategoryProds = jsonProducts.getProductsByCategory(product.category);
  const pool = allCategoryProds.length > 0
    ? allCategoryProds
    : products.filter((p) => p.category === product.category);
  return pool
    .filter((p) => p.id !== productId)
    .slice(0, limit);
}
