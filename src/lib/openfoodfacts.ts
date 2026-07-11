/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Product, ProductVersion, TrustLevel, SatietyLabel, NutritionLevel, BalanceLabel, OccasionLabel } from "./types";

function computeBodyImpact(nutrition: any) {
  const sugar = nutrition.addedSugar ?? nutrition.sugar ?? 0;
  const sodium = nutrition.sodium ?? 0;
  const calories = nutrition.caloriesPerServing ?? 0;
  return {
    energyDensityLabel: (calories > 250 ? 'High' : calories > 100 ? 'Moderate' : 'Low') as NutritionLevel,
    satietyLabel: 'Moderately filling' as SatietyLabel,
    sugarFlag: (sugar >= 10 ? 'High' : sugar >= 5 ? 'Moderate' : 'Low') as NutritionLevel,
    sodiumFlag: (sodium >= 600 ? 'High' : sodium >= 200 ? 'Moderate' : 'Low') as NutritionLevel,
    saturatedFatFlag: 'Low' as NutritionLevel,
    processingFlag: 'Moderate' as NutritionLevel,
    proteinFlag: 'Moderate' as NutritionLevel,
    fiberFlag: 'Moderate' as NutritionLevel,
    balanceLabel: 'Moderately balanced' as BalanceLabel,
    occasionLabel: (calories > 200 ? 'Better occasional treat' : 'Moderate frequency') as OccasionLabel,
    summaryText: "Computed in real-time from Open Food Facts data.",
    disclaimerText: "Data source: Open Food Facts."
  };
}

function getNutritionFlags(bodyImpact: any): string[] {
  const badges: string[] = [];
  if (bodyImpact.sugarFlag === 'High') badges.push('High sugar');
  if (bodyImpact.sodiumFlag === 'High') badges.push('High sodium');
  if (bodyImpact.energyDensityLabel === 'High') badges.push('Calorie dense');
  return badges;
}

// ── Hardcoded barcode overrides for known misclassified products ──────────────
const BARCODE_CATEGORY_OVERRIDES: Record<string, string> = {
  // Coca-Cola variants
  "5449000107664": "drinks",
  "5449000000996": "drinks",
  "5449000054227": "drinks",
  "5449000131836": "drinks",
  "04963406": "drinks",
  // Pepsi
  "012000001215": "drinks",
  // Sprite
  "5449000148582": "drinks",
  // Fanta
  "5449000058867": "drinks",
  // Red Bull
  "9002490100070": "drinks",
  // Common Indian barcodes
  "8901058800023": "instant-foods", // Maggi
  "8901058002478": "instant-foods", // Maggi Masala
  "8901030944014": "snacks",         // Parle-G
  "8901719110252": "dairy",          // Amul Butter
  "8906002650060": "snacks",         // Kurkure
};

// ── pnns_groups_1 → internal category slug ────────────────────────────────────
const PNNS_TO_SLUG: Record<string, string> = {
  "beverages": "drinks",
  "milk and dairy products": "dairy",
  "cereals and potatoes": "instant-foods",
  "sugary snacks": "snacks",
  "salty snacks": "snacks",
  "fruits and vegetables": "instant-foods",
  "fish meat eggs": "instant-foods",
  "fat and sauces": "condiments",
  "composite foods": "instant-foods",
  "unknown": "packaged-food",
};

function mapCategory(raw: {
  categories_tags?: string[];
  pnns_groups_1?: string;
  pnns_groups_2?: string;
  barcode?: string;
}): string {
  const categoriesTags: string[] = raw.categories_tags || [];

  // 0. Hardcoded barcode override — highest priority
  if (raw.barcode && BARCODE_CATEGORY_OVERRIDES[raw.barcode]) {
    return BARCODE_CATEGORY_OVERRIDES[raw.barcode];
  }

  // 1. Use pnns_groups_1 — Open Food Facts' most reliable category field
  if (raw.pnns_groups_1) {
    const pnns = raw.pnns_groups_1.toLowerCase().trim();
    if (pnns && pnns !== "unknown") {
      // Direct slug lookup
      const slug = PNNS_TO_SLUG[pnns];
      if (slug) return slug;
      // Fallback fuzzy match on pnns_groups_1
      if (pnns.includes("beverage") || pnns.includes("drink") || pnns.includes("water") || pnns.includes("juice") || pnns.includes("soda") || pnns.includes("cola")) return "drinks";
      if (pnns.includes("dairy") || pnns.includes("milk")) return "dairy";
      if (pnns.includes("snack") || pnns.includes("biscuit") || pnns.includes("sweet") || pnns.includes("confection")) return "snacks";
      if (pnns.includes("cereal") || pnns.includes("grain") || pnns.includes("pasta") || pnns.includes("noodle") || pnns.includes("bread")) return "instant-foods";
    }
  }

  // 2. Use pnns_groups_2 as secondary
  if (raw.pnns_groups_2) {
    const pnns2 = raw.pnns_groups_2.toLowerCase().trim();
    if (pnns2.includes("soda") || pnns2.includes("cola") || pnns2.includes("carbonated") || pnns2.includes("beverage") || pnns2.includes("juice") || pnns2.includes("water")) return "drinks";
    if (pnns2.includes("yogurt") || pnns2.includes("cheese") || pnns2.includes("milk")) return "dairy";
  }

  // 3. Fall back to categories_tags — clean "en:" prefix before matching
  if (!Array.isArray(categoriesTags) || categoriesTags.length === 0) {
    return "packaged-food"; // neutral fallback — not "snacks"
  }

  for (const rawTag of categoriesTags) {
    // Clean language prefix: "en:beverages" → "beverages", "fr:boissons" → "boissons"
    const t = rawTag.toLowerCase().replace(/^[a-z]{2}:/, "").trim();

    // Non-consumable categories — checked first so they are never misclassified as food
    if (
      t.includes("household") || t.includes("cleaning") || t.includes("detergent") ||
      t.includes("laundry") || t.includes("dishwash") || t.includes("floor-cleaner") ||
      t.includes("toilet-cleaner") || t.includes("bleach") || t.includes("disinfectant") ||
      t.includes("fabric-softener") || t.includes("surface-cleaner") || t.includes("air-freshener")
    ) return "household";

    if (t.includes("soap") || t.includes("shampoo") || t.includes("hygiene") || t.includes("cosmetic") || t.includes("personal-care") || t.includes("toiletries") || t.includes("dental") || t.includes("deodorant") || t.includes("skincare") || t.includes("haircare")) return "toiletries";
    if (t.includes("pet") || t.includes("dog") || t.includes("cat") || t.includes("animal")) return "pet-food";

    // Consumable categories — beverages BEFORE snacks
    if (t.includes("beverage") || t.includes("drink") || t.includes("soda") || t.includes("juice") || t.includes("water") || t.includes("coffee") || t.includes("tea") || t.includes("cola") || t.includes("carbonated") || t.includes("smoothie") || t.includes("energy-drink") || t.includes("mineral-water") || t.includes("soft-drink") || t.includes("lemonade")) return "drinks";
    if (t.includes("dairy") || t.includes("milk") || t.includes("yogurt") || t.includes("cheese") || t.includes("butter") || t.includes("cream")) return "dairy";
    if (t.includes("snack") || t.includes("biscuit") || t.includes("cookie") || t.includes("chip") || t.includes("confectionery") || t.includes("chocolate") || t.includes("sweet")) return "snacks";
    if (t.includes("noodle") || t.includes("pasta") || t.includes("instant") || t.includes("meal") || t.includes("ready-to-eat") || t.includes("cereal") || t.includes("grain") || t.includes("bread") || t.includes("rice") || t.includes("flour")) return "instant-foods";
    if (t.includes("supplement") || t.includes("medicine") || t.includes("health") || t.includes("vitamins") || t.includes("pharmacy")) return "otc-health";
  }

  // 4. Final fallback — neutral, not "snacks"
  return "packaged-food";
}


function parseQuantity(qtyStr: string) {
  if (!qtyStr) return { value: 100, unit: 'g' };
  const match = qtyStr.match(/^([\d.,]+)\s*(kg|g|l|ml|oz|lbs|sachets|can|refill|pouch|bottle)?/i);
  if (!match) return { value: 100, unit: 'g' };
  const val = parseFloat(match[1].replace(',', '.'));
  const unit = (match[2] || 'g').toLowerCase();
  return { value: val, unit };
}

function extractNutrition(nutriments: any, scale: number) {
  const getVal = (key: string): number => {
    if (!nutriments) return 0;
    if (nutriments[`${key}_serving`] !== undefined) return Number(nutriments[`${key}_serving`]);
    if (nutriments[`${key}_100g`] !== undefined) return Number(nutriments[`${key}_100g`]) * scale;
    return 0;
  };
  const calories = getVal('energy-kcal') || (getVal('energy') / 4.184) || 0;
  const fat = getVal('fat');
  const satFat = getVal('saturated-fat');
  const transFat = getVal('trans-fat');
  const carbs = getVal('carbohydrates');
  const sugar = getVal('sugars');
  const addedSugar = getVal('added-sugars') || sugar;
  const fiber = getVal('fiber');
  const protein = getVal('proteins');
  let sodiumG = 0;
  if (nutriments && nutriments['sodium_serving'] !== undefined) sodiumG = Number(nutriments['sodium_serving']);
  else if (nutriments && nutriments['sodium_100g'] !== undefined) sodiumG = Number(nutriments['sodium_100g']) * scale;
  const sodium = Math.round(sodiumG * 1000);
  const cholesterol = Math.round(getVal('cholesterol') * 1000);

  return {
    caloriesPerServing: Math.round(calories),
    caloriesPerPack: Math.round(calories),
    totalFat: Number((fat || 0).toFixed(1)),
    saturatedFat: Number((satFat || 0).toFixed(1)),
    transFat: Number((transFat || 0).toFixed(1)),
    carbs: Number((carbs || 0).toFixed(1)),
    sugar: Number((sugar || 0).toFixed(1)),
    addedSugar: Number((addedSugar || 0).toFixed(1)),
    fiber: Number((fiber || 0).toFixed(1)),
    protein: Number((protein || 0).toFixed(1)),
    sodium,
    cholesterol,
    dailyValuePercentages: {
      totalFat: Math.round(((fat || 0) / 78) * 100),
      saturatedFat: Math.round(((satFat || 0) / 20) * 100),
      sodium: Math.round((sodium / 2000) * 100),
      carbs: Math.round(((carbs || 0) / 300) * 100),
      fiber: Math.round(((fiber || 0) / 30) * 100),
      protein: Math.round(((protein || 0) / 60) * 100),
    }
  };
}

export async function fetchProductFromOpenFoodFacts(barcode: string): Promise<Product | null> {
  const clean = barcode.replace(/\D/g, "");
  if (!clean) return null;

  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${clean}.json`, {
      headers: {
        "User-Agent": "Jeevanreport/1.0 (https://jeevanreport.in)"
      }
    });
    if (!response.ok) return null;

    const data = await response.json();
    if (data.status !== 1 || !data.product) return null;

    const raw = data.product;
    const name = raw.product_name || raw.product_name_en || raw.product_name_fr || '';
    if (!name) return null;

    const ingredientsText = raw.ingredients_text || raw.ingredients_text_en || '';
    const nutriments = raw.nutriments || {};
    const brand = raw.brands ? String(raw.brands).split(',')[0].trim() : 'Generic';
    const category = mapCategory({
      categories_tags: raw.categories_tags,
      pnns_groups_1: raw.pnns_groups_1,
      pnns_groups_2: raw.pnns_groups_2,
      barcode: clean,
    });
    const countries = raw.countries || 'Unknown';
    const imageUrl = raw.image_front_url || raw.image_url || `https://placehold.co/400x400/fffbeb/d97706?text=${encodeURIComponent(name.slice(0,15))}`;
    
    const quantityStr = raw.quantity || '100g';
    const qtyParsed = parseQuantity(quantityStr);
    const servingStr = raw.serving_size || '100g';
    const servingParsed = parseQuantity(servingStr);
    const servingSizeGrams = servingParsed.value || 100;
    const packSizeGrams = qtyParsed.value || 100;
    const servingsPerPack = Math.max(1, Math.round(packSizeGrams / servingSizeGrams)) || 1;
    const scale = servingSizeGrams / 100;
    
    const nutrition = extractNutrition(nutriments, scale);
    nutrition.caloriesPerPack = nutrition.caloriesPerServing * servingsPerPack;
    
    const bodyImpact = computeBodyImpact(nutrition);
    const badges = getNutritionFlags(bodyImpact);
    
    let trustScore = 70;
    if (ingredientsText) trustScore += 10;
    if (raw.image_front_url) trustScore += 10;
    if (Object.keys(nutriments).length > 8) trustScore += 10;
    trustScore = Math.min(100, trustScore);
    const trustLevel = (trustScore >= 90 ? 'Verified' : trustScore >= 75 ? 'Community verified' : 'Unverified') as TrustLevel;

    const version: ProductVersion = {
      id: `${clean}-v1`,
      country: countries.split(',')[0].trim(),
      packSize: quantityStr,
      unit: qtyParsed.unit,
      servingSize: servingStr,
      servingsPerPack,
      ingredientsText,
      simplifiedIngredients: ingredientsText ? String(ingredientsText).split(',').map(i => i.trim()).filter(Boolean).slice(0,8) : [],
      highlightedIngredients: [],
      allergens: raw.allergens_from_ingredients ? String(raw.allergens_from_ingredients).split(',').map(i => i.trim()).filter(Boolean) : [],
      ingredientComplexity: (ingredientsText ? String(ingredientsText).split(',').length : 0) > 15 ? 'Complex' : (ingredientsText ? String(ingredientsText).split(',').length : 0) > 5 ? 'Moderate' : 'Simple',
      versionDate: new Date().toISOString().split('T')[0],
      nutrition,
      bodyImpact
    };

    const product: Product = {
      id: clean,
      name,
      brand,
      barcode: clean,
      category,
      manufacturer: raw.manufacturers || brand,
      baseDescription: raw.generic_name || `Packaged ${name} by ${brand}.`,
      imageUrl,
      trustScore,
      trustLevel,
      versions: [version],
      prices: [],
      packSizeChanges: [],
      formulaChanges: [],
      submissions: [],
      confirmations: [],
      countryComparisons: [],
      badges
    };

    return product;
  } catch (err) {
    console.error("Open Food Facts fetch error:", err);
    return null;
  }
}
