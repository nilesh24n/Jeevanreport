import type { Product } from "./types";

// Categories of edible/consumable products
const CONSUMABLE_CATEGORIES = [
  "drinks",
  "snacks",
  "dairy",
  "instant-foods",
  "otc-health", // Over-the-counter health products (vitamins, supplements)
  "pet-food"
];

// Non-consumable categories to exclude
const NON_CONSUMABLE_KEYWORDS = [
  "soap",
  "shampoo",
  "conditioner",
  "lotion",
  "cream",
  "makeup",
  "cosmetic",
  "personal care",
  "cleaning",
  "detergent",
  "bleach",
  "deodorant",
  "toothbrush",
  "dental",
  "hair care",
  "body care",
  "bath",
  "perfume",
  "fragrance",
  "skincare",
  "powder"
];

export function isConsumableProduct(product: Product | null): boolean {
  if (!product) return false;
  
  const category = (product.category || "").toLowerCase();
  const name = (product.name || "").toLowerCase();
  const brand = (product.brand || "").toLowerCase();
  const baseDescription = (product.baseDescription || "").toLowerCase();
  
  // Check if it's in consumable categories
  if (!CONSUMABLE_CATEGORIES.includes(category)) {
    return false;
  }
  
  // Check if name/brand contains non-consumable keywords
  for (const keyword of NON_CONSUMABLE_KEYWORDS) {
    if (
      name.includes(keyword) ||
      brand.includes(keyword) ||
      baseDescription.includes(keyword)
    ) {
      return false;
    }
  }
  
  return true;
}

export function getConsumableMessage(): string {
  return `⚠️ This platform is for edible/consumable products only. The product you scanned appears to be a non-consumable item. Please scan a food or beverage product to get accurate nutrition and ingredient information.`;
}

export function isHouseholdOrPersonalCare(product: Product | null): boolean {
  if (!product) return false;
  
  const category = (product.category || "").toLowerCase();
  const name = (product.name || "").toLowerCase();
  
  // Check if it's household or personal care
  if (category === "household") return true;
  
  for (const keyword of NON_CONSUMABLE_KEYWORDS) {
    if (name.includes(keyword)) return true;
  }
  
  return false;
}
