import type {
  BodyImpactSummary,
  NutritionFacts,
  NutritionLevel,
  BalanceLabel,
  OccasionLabel,
  SatietyLabel,
} from "./types";
import { MEDICAL_DISCLAIMER } from "./types";

function level(value: number, low: number, high: number): NutritionLevel {
  if (value <= low) return "Low";
  if (value >= high) return "High";
  return "Moderate";
}

function satietyScore(n: NutritionFacts): SatietyLabel {
  const proteinPer100cal = (n.protein / n.caloriesPerServing) * 100;
  const fiberPer100cal = (n.fiber / n.caloriesPerServing) * 100;
  const score = proteinPer100cal * 2 + fiberPer100cal * 3 - (n.sugar / n.caloriesPerServing) * 50;
  if (score >= 8) return "More filling";
  if (score >= 4) return "Moderately filling";
  return "Less filling";
}

function balanceLabel(n: NutritionFacts): BalanceLabel {
  const flags = [
    level(n.sugar, 5, 15) === "High",
    level(n.sodium, 140, 400) === "High",
    level(n.saturatedFat, 1, 5) === "High",
    level(n.protein, 3, 8) === "Low",
    level(n.fiber, 2, 5) === "Low",
  ].filter(Boolean).length;
  if (flags <= 1) return "More balanced";
  if (flags <= 3) return "Moderately balanced";
  return "Less balanced";
}

function occasionLabel(n: NutritionFacts, satiety: SatietyLabel): OccasionLabel {
  const calorieDense = n.caloriesPerServing > 250;
  const highSugar = level(n.sugar, 5, 15) === "High";
  const lowProteinFiber = level(n.protein, 3, 8) === "Low" && level(n.fiber, 2, 5) === "Low";
  if ((calorieDense && highSugar) || (lowProteinFiber && satiety === "Less filling")) {
    return "Better occasional treat";
  }
  if (!highSugar && level(n.sodium, 140, 400) !== "High" && satiety !== "Less filling") {
    return "Better staple candidate";
  }
  return "Moderate frequency";
}

function buildSummary(n: NutritionFacts, body: Partial<BodyImpactSummary>): string {
  const parts: string[] = [];
  if (body.energyDensityLabel === "High") {
    parts.push("may contribute to higher calorie intake");
  }
  if (body.sugarFlag === "High") {
    parts.push("may be high in sugar for regular use");
  }
  if (body.sodiumFlag === "High") {
    parts.push("may be relatively high in sodium");
  }
  if (body.proteinFlag === "Low" && body.fiberFlag === "Low") {
    parts.push("may be less filling, and it may be worth comparing with higher-protein or lower-sugar alternatives");
  } else if (body.proteinFlag === "High" || body.fiberFlag === "High") {
    parts.push("includes protein or fiber which may support dietary balance");
  }
  if (body.satietyLabel === "Less filling") {
    parts.push("may offer lower satiety per serving");
  }
  if (parts.length === 0) {
    return "This product offers a moderate nutritional profile. Educational only, not medical advice.";
  }
  const joined = parts.join(", while ");
  return `This product ${joined}. Educational only, not medical advice.`;
}

export function computeBodyImpact(n: NutritionFacts, processingEstimate: NutritionLevel = "Moderate"): BodyImpactSummary {
  const energyDensityLabel = level(n.caloriesPerServing, 150, 250);
  const sugarFlag = level(n.sugar, 5, 15);
  const sodiumFlag = level(n.sodium, 140, 400);
  const saturatedFatFlag = level(n.saturatedFat, 1, 5);
  const proteinFlag = level(n.protein, 3, 8);
  const fiberFlag = level(n.fiber, 2, 5);
  const satietyLabel = satietyScore(n);
  const balance = balanceLabel(n);
  const occasion = occasionLabel(n, satietyLabel);

  const partial: Partial<BodyImpactSummary> = {
    energyDensityLabel,
    sugarFlag,
    sodiumFlag,
    saturatedFatFlag,
    proteinFlag,
    fiberFlag,
    satietyLabel,
  };

  return {
    energyDensityLabel,
    satietyLabel,
    sugarFlag,
    sodiumFlag,
    saturatedFatFlag,
    processingFlag: processingEstimate,
    proteinFlag,
    fiberFlag,
    balanceLabel: balance,
    occasionLabel: occasion,
    summaryText: buildSummary(n, partial),
    disclaimerText: MEDICAL_DISCLAIMER,
  };
}

export function getNutritionFlags(body: BodyImpactSummary): string[] {
  const flags: string[] = [];
  if (body.sugarFlag === "High") flags.push("High sugar");
  if (body.sodiumFlag === "High") flags.push("High sodium");
  if (body.energyDensityLabel === "High") flags.push("Calorie dense");
  if (body.proteinFlag === "Low") flags.push("Low protein");
  if (body.fiberFlag === "Low") flags.push("Low fiber");
  if (body.saturatedFatFlag === "High") flags.push("High saturated fat");
  if (body.processingFlag === "High") flags.push("Highly processed");
  return flags;
}

export function trustLabel(score: number): "Verified" | "Community verified" | "Unverified" | "Under review" {
  if (score >= 90) return "Verified";
  if (score >= 70) return "Community verified";
  if (score >= 40) return "Under review";
  return "Unverified";
}

export interface ProductStatus {
  rating: "Good" | "Okay" | "Be Careful";
  label: "Better Choice" | "Average Choice" | "Limit Often";
  color: "green" | "yellow" | "orange" | "red";
  points: string[];
}

export function getProductStatus(body: BodyImpactSummary): ProductStatus {
  const points: string[] = [];
  
  const isHighSugar = body.sugarFlag === "High";
  const isHighSodium = body.sodiumFlag === "High";
  const isHighFat = body.saturatedFatFlag === "High";
  
  if (isHighSugar) points.push("High sugar — not best for regular use");
  if (isHighSodium) points.push("High salt — limit daily intake");
  if (isHighFat) points.push("High fat — eat in moderation");
  
  if (body.proteinFlag === "Low") {
    points.push("Low protein — may not keep you full");
  } else if (body.proteinFlag === "High") {
    points.push("Good source of protein");
  }
  
  if (body.fiberFlag === "Low") {
    if (points.length < 3) points.push("Low fiber");
  } else if (body.fiberFlag === "High") {
    points.push("Good source of fiber");
  }

  if (body.occasionLabel === "Better occasional treat") {
    points.push("Better as an occasional treat");
  } else if (body.occasionLabel === "Better staple candidate") {
    points.push("Good for regular use");
  }

  if (body.energyDensityLabel === "High") {
    points.push("High calories — eat in small portions");
  }

  if (points.length < 3) {
    if (body.satietyLabel === "More filling") points.push("More filling and satisfying");
    if (body.satietyLabel === "Less filling") points.push("Less filling");
  }

  const uniquePoints = Array.from(new Set(points)).slice(0, 5);

  let rating: "Good" | "Okay" | "Be Careful";
  let label: "Better Choice" | "Average Choice" | "Limit Often";
  let color: "green" | "yellow" | "orange" | "red";

  if (isHighSugar || isHighSodium || isHighFat) {
    rating = "Be Careful";
    label = "Limit Often";
    color = "red";
  } else if (body.occasionLabel === "Better occasional treat" || body.processingFlag === "High") {
    rating = "Be Careful";
    label = "Limit Often";
    color = "orange";
  } else if (body.occasionLabel === "Better staple candidate" && body.balanceLabel === "More balanced") {
    rating = "Good";
    label = "Better Choice";
    color = "green";
  } else {
    rating = "Okay";
    label = "Average Choice";
    color = "yellow";
  }

  return { rating, label, color, points: uniquePoints };
}
