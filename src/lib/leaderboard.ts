import { products } from "./data/products";

export interface ShrinkflationEntry {
  productId: string;
  productName: string;
  brand: string;
  country: string;
  oldSize: string;
  newSize: string;
  percentChange: number;
  date: string;
  trustScore: number;
  imageUrl: string;
}

export function getShrinkflationLeaderboard(): ShrinkflationEntry[] {
  const entries: ShrinkflationEntry[] = [];

  for (const p of products) {
    for (const c of p.packSizeChanges) {
      entries.push({
        productId: p.id,
        productName: p.name,
        brand: p.brand,
        country: c.country,
        oldSize: c.oldSize,
        newSize: c.newSize,
        percentChange: c.percentChange,
        date: c.date,
        trustScore: p.trustScore,
        imageUrl: p.imageUrl,
      });
    }
  }

  return entries.sort((a, b) => a.percentChange - b.percentChange);
}

export function getPriceIncreaseLeaderboard() {
  return products
    .filter((p) => p.prices.length >= 2)
    .map((p) => {
      const first = p.prices[0];
      const last = p.prices[p.prices.length - 1];
      const pctChange = ((last.unitPrice - first.unitPrice) / first.unitPrice) * 100;
      return {
        productId: p.id,
        productName: p.name,
        brand: p.brand,
        country: last.country,
        store: last.store,
        oldUnitPrice: first.unitPrice,
        newUnitPrice: last.unitPrice,
        unitLabel: last.unitPriceLabel,
        percentChange: Math.round(pctChange * 10) / 10,
        trustScore: p.trustScore,
        imageUrl: p.imageUrl,
      };
    })
    .sort((a, b) => b.percentChange - a.percentChange);
}
