import type { ProductVersion, RecommendedFrequency } from "./types";

/**
 * Derives recommended frequency and reasoning from product nutrition facts.
 * 
 * Rules & Thresholds:
 * - Base score starts at 10.
 * - Sugar: High sugar (>=15g per serving or >=20% RDA) subtracts 3 points. Moderate (>=5g) subtracts 1 point. (WHO/FSSAI)
 * - Sodium: High sodium (>=400mg per serving or >=20% RDA) subtracts 3 points. Moderate (>=200mg) subtracts 1 point. (FSSAI/WHO)
 * - Saturated Fat: High sat fat (>=4g per serving or >=20% RDA) subtracts 2 points. Moderate (>=2g) subtracts 1 point. (ICMR-NIN)
 * - Calories: High calories (>=250 kcal per serving) subtracts 2 points. Moderate (>=150 kcal) subtracts 1 point. (ICMR-NIN)
 * - Boosts: High protein (>=5g) adds 1 point. High fiber (>=3g) adds 1 point.
 */
export function calculateFrequencyAndReasoning(v: ProductVersion): {
  recommendedFrequency: RecommendedFrequency;
  frequencyReasoning: string;
} {
  const n = v.nutrition;
  let score = 10;
  
  const sugarVal = n.addedSugar ?? n.sugar ?? 0;
  const sodiumVal = n.sodium ?? 0;
  const satFatVal = n.saturatedFat ?? 0;
  const caloriesVal = n.caloriesPerServing ?? 0;

  // Track the most severe offender to generate the reasoning
  const issues: { name: string; percent: number; standard: string }[] = [];

  // 1. Sugar (RDA Reference limit: 50g)
  const sugarPercent = Math.round((sugarVal / 50) * 100);
  if (sugarVal >= 15 || sugarPercent >= 20) {
    score -= 3;
    issues.push({ name: "sugar", percent: sugarPercent, standard: "WHO limit" });
  } else if (sugarVal >= 5 || sugarPercent >= 10) {
    score -= 1;
    issues.push({ name: "sugar", percent: sugarPercent, standard: "WHO limit" });
  }

  // 2. Sodium (RDA Reference limit: 2000mg)
  const sodiumPercent = Math.round((sodiumVal / 2000) * 100);
  if (sodiumVal >= 400 || sodiumPercent >= 20) {
    score -= 3;
    issues.push({ name: "sodium", percent: sodiumPercent, standard: "FSSAI reference" });
  } else if (sodiumVal >= 200 || sodiumPercent >= 10) {
    score -= 1;
    issues.push({ name: "sodium", percent: sodiumPercent, standard: "FSSAI reference" });
  }

  // 3. Saturated Fat (RDA Reference limit: 20g)
  const fatPercent = Math.round((satFatVal / 20) * 100);
  if (satFatVal >= 4 || fatPercent >= 20) {
    score -= 2;
    issues.push({ name: "saturated fat", percent: fatPercent, standard: "ICMR-NIN reference" });
  } else if (satFatVal >= 2 || fatPercent >= 10) {
    score -= 1;
  }

  // 4. Calories (Reference: 2000 kcal total)
  if (caloriesVal >= 250) {
    score -= 2;
  } else if (caloriesVal >= 150) {
    score -= 1;
  }

  // 5. Additive Concern Deduction
  const hasHighConcernAdditives = v.structuredIngredients?.some(i => i.concernLevel === "high") ||
    v.ingredientsText.toLowerCase().includes("aspartame") ||
    v.ingredientsText.toLowerCase().includes("tartrazine") ||
    v.ingredientsText.toLowerCase().includes("bha") ||
    v.ingredientsText.toLowerCase().includes("bht");
  
  if (hasHighConcernAdditives) {
    score -= 2;
  }

  // 6. Protein & Fiber Boosts
  if (n.protein >= 5) {
    score += 1;
  }
  if (n.fiber >= 3) {
    score += 1;
  }

  // Clamp score between 0 and 10
  score = Math.max(0, Math.min(10, score));

  // Determine frequency
  let recommendedFrequency: RecommendedFrequency = "weekly";
  let labelText = "Weekly";

  if (score >= 9) {
    recommendedFrequency = "daily";
    labelText = "Daily (Staple candidate)";
  } else if (score >= 7) {
    recommendedFrequency = "few_times_week";
    labelText = "Few times a week";
  } else if (score >= 5) {
    recommendedFrequency = "weekly";
    labelText = "Weekly";
  } else if (score >= 3) {
    recommendedFrequency = "monthly";
    labelText = "Monthly";
  } else if (score >= 1) {
    recommendedFrequency = "rarely";
    labelText = "Rarely";
  } else {
    recommendedFrequency = "avoid";
    labelText = "Avoid / Occasional treat";
  }

  // Generate reasoning based on the highest issues
  let frequencyReasoning = "";
  if (issues.length > 0) {
    // Sort issues by percentage descending
    issues.sort((a, b) => b.percent - a.percent);
    const primary = issues[0];
    frequencyReasoning = `${labelText} — one serving covers ~${primary.percent}% of daily ${primary.name} limit (${primary.standard})`;
  } else {
    if (recommendedFrequency === "daily") {
      frequencyReasoning = `${labelText} — balanced energy, low sugar and low sodium profile (ICMR-NIN Guidelines)`;
    } else {
      frequencyReasoning = `${labelText} — moderate nutrient values; suitable for regular intake (FSSAI/WHO guidelines)`;
    }
  }

  return { recommendedFrequency, frequencyReasoning };
}
