import type { Product } from "./types";

// Categories of edible/consumable products
const CONSUMABLE_CATEGORIES = [
  "drinks",
  "beverages",
  "snacks",
  "dairy",
  "instant-foods",
  "packaged-food",
  "food",
  "noodles",
  "biscuits",
  "chocolates",
  "sweets",
  "cereals",
  "otc-health", // Over-the-counter health products (vitamins, supplements)
  "pet-food",
  "spices",
  "condiments",
  "sauces",
  "spreads",
  "bakery",
  "baking",
  "groceries",
  "confectionery",
  "frozen-foods",
];

// Categories that are explicitly NON-consumable
const NON_CONSUMABLE_CATEGORIES = [
  "household",
  "toiletries",
  "personal-care",
  "cleaning",
];

// Keywords that indicate a product IS actually consumable (food/beverage)
// Keywords that indicate a product IS actually consumable (food/beverage)
export const CONSUMABLE_KEYWORDS = [
  // Culinary ingredients and herbs
  "garlic", "onion", "ginger", "pepper", "chili", "chilly", "cumin", "mustard", "turmeric", "coriander", "cardamom", "clove", "cinnamon", "oregano", "basil", "thyme", "herb", "herbs", "spread", "jam", "jelly", "honey", "yeast",
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
  "cola", "beverage", "drink", "soft drink", "energy drink", "fizzy", "can", "tonic", "shake", "milkshake", "syrup", "squash",
  // Condiments & Sauces
  "sauce", "ketchup", "mustard", "mayo", "oil", "vinegar", "pepper sauce", "salsa", "gravy",
  // Prepared Foods
  "salad", "stew", "soup", "applesauce", "pudding", "gelatin", "dessert", "snack", "cookie", "cracker", "chip",
  "instant", "masala", "tastemaker", "ready to eat", "rte", "namkeen", "munch", "biscuit", "rusk",
  // Common Indian FMCG (helps when category slugs are generic)
  "maggi", "amul", "parle", "britannia", "kurkure", "haldiram", "mtr", "bournvita", "horlicks", "boost",
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
export const NON_CONSUMABLE_KEYWORDS = [
  "soap",
  "shampoo",
  "conditioner",
  "lotion",
  "face cream", "hand cream", "body cream", "skin cream", "shaving cream", "moisturizing cream", "night cream", "sunscreen cream",
  "makeup",
  "cosmetic",
  "personal care",
  "cleaning",
  "detergent",
  "bleach",
  "deodorant",
  "toothbrush",
  "dental care", "dental floss", "dental pick",
  "hair care",
  "body care",
  "bath",
  "perfume",
  "fragrance",
  "skincare",
  "baby powder", "talcum powder", "face powder", "dusting powder", "detergent powder", "washing powder",
  "toilet paper",
  "tissues",
  "paper towel",
  "laundry",
  "dish soap",
  "dishwash",
  "cleaner",
  "disinfectant",
  "softener",
  "freshener",
  "toner",
  "serum",
  "moisturiser",
  "moisturizer",
  "face wash", "body wash", "hand wash",
  "facewash", "bodywash", "handwash",
  "toothpaste",
  "mouthwash",
  "antiperspirant",
  "sunscreen",
  "sunblock",
  "hair oil",
  "hair gel",
  "hair mask",
  "lip balm",
  "lip gloss",
  "foundation",
  "blush",
  "mascara",
  "kajal",
  "eyeliner",
  "nail polish",
  "sanitizer",
  "antiseptic",
  "cleanser",
  "scrub",
  "facewash",
  "bodywash",
  "handwash",
  "dishwash",
  "face wash", "body wash", "hand wash",
  "tonique",
  "mist",
  "toiletries",
  "shower gel"
];

export function isConsumableProduct(product: Product | null): boolean {
  if (!product) return false;
  const category = (product.category || "").toLowerCase();
  const name = (product.name || "").toLowerCase();
  const brand = (product.brand || "").toLowerCase();
  const baseDescription = (product.baseDescription || "").toLowerCase();
  const fullText = `${name} ${brand} ${baseDescription}`.toLowerCase();

  // 1. Check if it clearly contains non-consumable keywords in name/brand/description
  // Reject early to avoid false positive matches on foods
  for (const keyword of NON_CONSUMABLE_KEYWORDS) {
    if (fullText.includes(keyword)) {
      return false;
    }
  }

  // 2. Check if the name/brand/description strongly suggests it's food/beverage
  // If so, allow it (this handles misclassified categories in the database like "household" chicken)
  for (const keyword of CONSUMABLE_KEYWORDS) {
    if (fullText.includes(keyword)) {
      return true;
    }
  }

  // 3. If the category is explicitly non-consumable, reject
  if (NON_CONSUMABLE_CATEGORIES.includes(category)) {
    return false;
  }

  // 4. Check if it's in known consumable categories
  if (CONSUMABLE_CATEGORIES.includes(category)) {
    return true;
  }

  // 5. Open Food Facts and imports often use generic food slugs
  if (category.includes("food") || category.includes("drink") || category.includes("beverage")) {
    return true;
  }

  // 6. Barcoded grocery with no personal-care signals — allow (better false positive than blocking real food)
  if (product.barcode && /^\d{8,14}$/.test(product.barcode.trim())) {
    return true;
  }

  return false;
}

export function getConsumableMessage(): string {
  return `⚠️ This platform is for edible/consumable products only. The product you scanned appears to be a non-consumable item. Please scan a food or beverage product to get accurate nutrition and ingredient information.`;
}

export function isNonConsumableOrPersonalCare(product: Product | null): boolean {
  if (!product) return false;
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



  return false;
}
