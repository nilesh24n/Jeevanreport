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

// Keywords that indicate a product IS actually consumable (food/beverage)
// These are used to recategorize mislabeled "household" items
const CONSUMABLE_KEYWORDS = [
  // Meats & Proteins
  "chicken", "beef", "pork", "turkey", "lamb", "meat", "sausage", "bacon", "ham", "fish", "salmon", "tuna", "shrimp", "crab", "ground beef", "steak", "drumstick",
  // Dairy & Cheese
  "cheese", "milk", "yogurt", "butter", "cream", "cheddar", "mozzarella", "parmesan",
  // Grains & Pasta
  "rice", "wheat", "pasta", "noodles", "macaroni", "fettuccine", "bread", "cereal", "oats",
  // Vegetables & Fruits
  "vegetable", "fruit", "apple", "banana", "orange", "carrot", "lettuce", "broccoli", "tomato", "potato", "beans",
  // Beverages
  "tea", "coffee", "juice", "soda", "water", "beer", "wine", "cocoa", "chocolate milk", "lemonade", "smoothie",
  // Condiments & Sauces
  "sauce", "ketchup", "mustard", "mayo", "oil", "vinegar", "pepper sauce", "salsa", "gravy",
  // Prepared Foods
  "salad", "stew", "soup", "applesauce", "pudding", "gelatin", "dessert", "snack", "cookie", "cracker", "chip",
  // Sweets
  "candy", "chocolate", "caramel", "fudge", "cookie", "cake", "brownie", "wafer",
  // Spices & Seasonings
  "spice", "seasoning", "salt", "sugar", "flour", "baking",
  // Frozen Foods
  "frozen", "ice cream", "popsicle",
  // Baby Food
  "baby food", "infant formula"
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
  "powder",
  "toilet paper",
  "tissues",
  "paper towel",
  "laundry",
  "dish soap"
];

export function isConsumableProduct(product: Product | null): boolean {
  if (!product) return false;
  
  const category = (product.category || "").toLowerCase();
  const name = (product.name || "").toLowerCase();
  const brand = (product.brand || "").toLowerCase();
  const baseDescription = (product.baseDescription || "").toLowerCase();
  const fullText = `${name} ${brand} ${baseDescription}`.toLowerCase();
  
  // First, check if it clearly contains non-consumable keywords
  // If it does, it's definitely not consumable
  for (const keyword of NON_CONSUMABLE_KEYWORDS) {
    if (fullText.includes(keyword)) {
      return false;
    }
  }
  
  // Check if it's in known consumable categories
  if (CONSUMABLE_CATEGORIES.includes(category)) {
    return true;
  }
  
  // SPECIAL CASE: Many food products are mislabeled as "household"
  // Check if the product name/description contains consumable indicators
  if (category === "household") {
    for (const keyword of CONSUMABLE_KEYWORDS) {
      if (fullText.includes(keyword)) {
        return true; // This is actually a consumable item mislabeled as household
      }
    }
  }
  
  // If none of the above, it's not consumable
  return false;
}

export function getConsumableMessage(): string {
  return `⚠️ This platform is for edible/consumable products only. The product you scanned appears to be a non-consumable item. Please scan a food or beverage product to get accurate nutrition and ingredient information.`;
}

export function isHouseholdOrPersonalCare(product: Product | null): boolean {
  if (!product) return false;
  
  const category = (product.category || "").toLowerCase();
  const name = (product.name || "").toLowerCase();
  const brand = (product.brand || "").toLowerCase();
  const baseDescription = (product.baseDescription || "").toLowerCase();
  const fullText = `${name} ${brand} ${baseDescription}`.toLowerCase();
  
  // Check if it contains non-consumable keywords
  for (const keyword of NON_CONSUMABLE_KEYWORDS) {
    if (fullText.includes(keyword)) {
      return true; // This is a non-consumable item
    }
  }
  
  // If category is household but contains consumable keywords, it's actually food (not truly household)
  if (category === "household") {
    for (const keyword of CONSUMABLE_KEYWORDS) {
      if (fullText.includes(keyword)) {
        return false; // This is actually food, not truly household
      }
    }
    // If it's household and has NO consumable keywords, it's non-consumable
    return true;
  }
  
  return false;
}
