import { CONSUMABLE_KEYWORDS, NON_CONSUMABLE_KEYWORDS } from "./consumable-filter";

/**
 * Product Category Classifier
 *
 * Classifies a product into one of the defined categories based on
 * product name, brand, category slug, and description.
 * Used by ScanResult to render the appropriate sections.
 */

export type ProductCategory =
  | "FOOD"
  | "PERSONAL_CARE"
  | "SUPPLEMENT"
  | "BABY_CARE"
  | "HOUSEHOLD"
  | "UNKNOWN";

export interface CategoryMeta {
  category: ProductCategory;
  label: string;
  emoji: string;
  pillClass: string;
  showNutrition: boolean;
  showIngredientSafety: boolean; // skin/hair safety context
}

// ── Keyword matchers ────────────────────────────────────────────────────────

const BABY_CARE_KEYWORDS = [
  "baby", "infant", "nappy", "diaper", "neonatal", "toddler", "newborn",
  "baby powder", "baby wipes", "baby lotion", "baby wash",
];

const PERSONAL_CARE_KEYWORDS = [
  "shampoo", "soap", "lotion", "moisturiser", "moisturizer", "conditioner", "serum", "toner", "face wash",
  "body wash", "hand wash", "toothpaste", "mouthwash", "deodorant",
  "antiperspirant", "sunscreen", "sunblock", "face cream", "hand cream", "body cream", "skin cream", "shaving cream", "hair oil",
  "hair gel", "hair mask", "lip balm", "lip gloss", "foundation", "blush",
  "mascara", "kajal", "eyeliner", "nail polish", "sanitizer", "antiseptic",
  "dettol", "savlon", "lifebuoy", "dove", "himalaya", "nivea", "olay",
  "pond's", "ponds", "fair & lovely", "glow & lovely", "head & shoulders",
  "pantene", "sunsilk", "garnier", "l'oreal", "loreal", "clinic plus",
  "colgate", "pepsodent", "sensodyne", "listerine", "dabur", "patanjali",
  "hair care", "personal care", "grooming", "beauty", "cosmetic",
];

const SUPPLEMENT_KEYWORDS = [
  "supplement", "vitamin", "whey", "bcaa", "creatine", "capsule", "tablet",
  "protein powder", "mass gainer", "pre-workout", "post-workout",
  "omega-3", "omega3", "fish oil", "multivitamin", "probiotic",
  "collagen", "biotin", "iron supplement", "calcium supplement",
  "protein bar", "energy bar", "nutrition bar", "meal replacement",
  "amino acid", "glutamine", "l-carnitine", "zinc supplement",
  "nutraceutical", "health supplement", "dietary supplement",
];

// ── Classifier ──────────────────────────────────────────────────────────────

// Non-consumable category slugs — assigned by mapCategory in openfoodfacts.ts
const HOUSEHOLD_CATEGORY_SLUGS = ["household", "cleaning"];
const PERSONAL_CARE_CATEGORY_SLUGS = ["toiletries", "personal-care"];

function matchesAny(haystack: string, needles: string[]): boolean {
  const lower = haystack.toLowerCase();
  return needles.some((n) => lower.includes(n.toLowerCase()));
}

export function classifyProduct(opts: {
  name: string;
  brand?: string;
  categorySlug?: string;
  description?: string;
}): CategoryMeta {
  const combined = [opts.name, opts.brand ?? "", opts.categorySlug ?? ""].join(" ");
  // NOTE: description is intentionally excluded from combined to avoid false positives
  // (e.g. "a household favourite" or "tide of flavour" in food descriptions).

  // Strict hierarchy: Baby > Supplement > Personal Care > Household (slug only) > Food
  if (matchesAny(combined, BABY_CARE_KEYWORDS)) return CATEGORY_META.BABY_CARE;
  if (matchesAny(combined, SUPPLEMENT_KEYWORDS)) return CATEGORY_META.SUPPLEMENT;

  // Personal Care is detected via categorySlug or keywords — but bypass if it is actually food
  const isPersonalCareSlug = opts.categorySlug && PERSONAL_CARE_CATEGORY_SLUGS.includes(opts.categorySlug);
  if (isPersonalCareSlug || matchesAny(combined, PERSONAL_CARE_KEYWORDS)) {
    const lowerName = opts.name.toLowerCase();
    const lowerBrand = (opts.brand ?? "").toLowerCase();
    const lowerDesc = (opts.description ?? "").toLowerCase();
    const fullText = `${lowerName} ${lowerBrand} ${lowerDesc}`;
    
    // Check if it's actually a food/beverage based on keywords
    const isFood = CONSUMABLE_KEYWORDS.some(k => fullText.includes(k)) && 
                   !NON_CONSUMABLE_KEYWORDS.some(k => fullText.includes(k));
                   
    if (!isFood) {
      return CATEGORY_META.PERSONAL_CARE;
    }
  }

  // Household is detected via categorySlug — but bypass if it is actually food
  if (opts.categorySlug && HOUSEHOLD_CATEGORY_SLUGS.includes(opts.categorySlug)) {
    const lowerName = opts.name.toLowerCase();
    const lowerBrand = (opts.brand ?? "").toLowerCase();
    const lowerDesc = (opts.description ?? "").toLowerCase();
    const fullText = `${lowerName} ${lowerBrand} ${lowerDesc}`;
    
    // Check if it's actually a food/beverage based on keywords
    const isFood = CONSUMABLE_KEYWORDS.some(k => fullText.includes(k)) && 
                   !NON_CONSUMABLE_KEYWORDS.some(k => fullText.includes(k));
                   
    if (!isFood) {
      return CATEGORY_META.HOUSEHOLD;
    }
  }

  // If category slug explicitly says food-related
  const foodSlugs = [
    "instant-foods", "snacks", "dairy", "beverages", "cereals", "biscuits",
    "chocolates", "sweets", "condiments", "sauces", "noodles", "bread",
    "packaged-food", "food", "drinks", "juice", "tea", "coffee", "spices",
  ];
  if (opts.categorySlug && foodSlugs.some((s) => opts.categorySlug!.includes(s))) {
    return CATEGORY_META.FOOD;
  }

  // Default to FOOD if it has non-zero nutrition (handled by caller)
  return CATEGORY_META.FOOD;
}

// ── Category metadata map ──────────────────────────────────────────────────

export const CATEGORY_META: Record<ProductCategory, CategoryMeta> = {
  FOOD: {
    category: "FOOD",
    label: "Food",
    emoji: "🍽️",
    pillClass: "category-pill-food",
    showNutrition: true,
    showIngredientSafety: false,
  },
  SUPPLEMENT: {
    category: "SUPPLEMENT",
    label: "Supplement",
    emoji: "💊",
    pillClass: "category-pill-supplement",
    showNutrition: true,
    showIngredientSafety: false,
  },
  PERSONAL_CARE: {
    category: "PERSONAL_CARE",
    label: "Personal Care",
    emoji: "🧴",
    pillClass: "category-pill-care",
    showNutrition: false,
    showIngredientSafety: true,
  },
  BABY_CARE: {
    category: "BABY_CARE",
    label: "Baby Care",
    emoji: "👶",
    pillClass: "category-pill-baby",
    showNutrition: false,
    showIngredientSafety: true,
  },
  HOUSEHOLD: {
    category: "HOUSEHOLD",
    label: "Household",
    emoji: "🏠",
    pillClass: "category-pill-unknown",
    showNutrition: false,
    showIngredientSafety: false,
  },
  UNKNOWN: {
    category: "UNKNOWN",
    label: "Product",
    emoji: "📦",
    pillClass: "category-pill-unknown",
    showNutrition: false,
    showIngredientSafety: false,
  },
};
