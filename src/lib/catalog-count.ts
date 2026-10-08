import { products } from "./data/products";

/** Human-readable catalog size — never inflates beyond what we actually index. */
export function formatProductCount(count: number): string {
  if (!count || count < 1) return "Growing";
  if (count < 1000) return `${count}+`;
  return `${count.toLocaleString("en-IN")}+`;
}

export function getCuratedProductCount(): number {
  return products.length;
}
