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

function mapCategory(categoriesTags: string[]): string {
  if (!categoriesTags || !Array.isArray(categoriesTags)) return 'household';
  for (const tag of categoriesTags) {
    const t = tag.toLowerCase();
    if (t.includes('snack') || t.includes('biscuit') || t.includes('cookie') || t.includes('chip') || t.includes('confectionery') || t.includes('chocolate') || t.includes('sweet')) return 'snacks';
    if (t.includes('noodle') || t.includes('pasta') || t.includes('instant') || t.includes('meal') || t.includes('ready-to-eat')) return 'instant-foods';
    if (t.includes('dairy') || t.includes('milk') || t.includes('yogurt') || t.includes('cheese') || t.includes('butter') || t.includes('cream')) return 'dairy';
    if (t.includes('beverage') || t.includes('drink') || t.includes('soda') || t.includes('juice') || t.includes('water') || t.includes('coffee') || t.includes('tea')) return 'drinks';
    if (t.includes('pet') || t.includes('dog') || t.includes('cat') || t.includes('animal')) return 'pet-food';
    if (t.includes('supplement') || t.includes('medicine') || t.includes('health') || t.includes('vitamins') || t.includes('pharmacy')) return 'otc-health';
    if (t.includes('soap') || t.includes('shampoo') || t.includes('hygiene') || t.includes('cosmetic') || t.includes('care') || t.includes('toilet')) return 'toiletries';
  }
  return 'household';
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
    const category = mapCategory(raw.categories_tags || []);
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
