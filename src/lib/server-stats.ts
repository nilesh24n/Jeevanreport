import { products, changeFeed, countries, categories } from "./data/products";
import { dbGetProductCount } from "./db";
import { resolvePublicProductCount } from "./catalog-count.server";

export async function getPlatformStats() {
  const shrinkflationCount = products.filter((p) => p.packSizeChanges.length > 0).length;
  const formulaChangeCount = products.filter((p) => p.formulaChanges.length > 0).length;
  const priceChangeCount = products.filter((p) => p.prices.length >= 2).length;
  const totalChanges = changeFeed.length;

  let productCountVal = 0;
  try {
    productCountVal = await dbGetProductCount();
  } catch (e) {
    console.error("Failed to get product count", e);
  }

  const productCount = await resolvePublicProductCount(productCountVal);

  return {
    productCount,
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
