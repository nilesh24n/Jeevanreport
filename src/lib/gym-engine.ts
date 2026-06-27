import type { ProductVersion, IngredientModel } from "./types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type GymVerdict = "gym-friendly" | "use-carefully" | "avoid";
export type GymIngredientRating = "good" | "neutral" | "avoid";
export type GymConsumptionFrequency =
  | "daily_ok"
  | "few_times_week"
  | "occasionally"
  | "avoid";

export interface GymMacro {
  label: string;        // "Protein", "Carbs", "Fat", "Sugar"
  sublabel: string;     // "Muscle Builder", "Energy Fuel", etc.
  value: number;        // grams
  unit: string;         // "g"
  color: string;        // tailwind bg color class
  textColor: string;    // tailwind text color class
  watchOut?: boolean;   // true if sugar > 5g
}

export interface GymIngredientAnalysis {
  name: string;
  simpleName: string;       // plain-English name
  whatIsIt: string;         // one-line description
  gymRating: GymIngredientRating;
  gymWhy: string;           // one plain-English sentence
  frequency: GymConsumptionFrequency;
  frequencyLabel: string;   // emoji + text
}

export interface GymGoalScores {
  muscleGain: number;   // out of 10
  fatLoss: number;
  endurance: number;
  cleanEating: number;
}

export type BestConsumeTime =
  | "pre-workout"
  | "post-workout"
  | "avoid-around-workout"
  | "anytime";

export interface GymAnalysis {
  verdict: GymVerdict;
  verdictLabel: string;     // "Gym-Friendly — Good for your goals" etc.
  verdictColor: "green" | "yellow" | "red";
  macros: GymMacro[];
  ingredientBreakdowns: GymIngredientAnalysis[];
  goalScores: GymGoalScores;
  bestConsumeTime: BestConsumeTime;
  bestConsumeLabel: string;
  quickVerdict: string;     // 2–3 line plain English summary
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(val: number, min = 0, max = 10): number {
  return Math.max(min, Math.min(max, val));
}

function mapConcernToGymRating(
  concern: IngredientModel["concernLevel"]
): GymIngredientRating {
  if (concern === "high") return "avoid";
  if (concern === "moderate") return "neutral";
  return "good";
}

function gymFrequencyFromRating(
  rating: GymIngredientRating
): { frequency: GymConsumptionFrequency; label: string } {
  switch (rating) {
    case "good":
      return { frequency: "daily_ok", label: "✅ Daily OK" };
    case "neutral":
      return { frequency: "few_times_week", label: "⚠️ 2–3 times a week max" };
    case "avoid":
    default:
      return { frequency: "occasionally", label: "🚫 Occasionally (1–2× a month)" };
  }
}

/** Build a plain-English gym reason for a given ingredient */
function gymReasonFor(name: string, rating: GymIngredientRating): string {
  const n = name.toLowerCase();

  // Positive contributors
  if (n.includes("whey") || n.includes("protein"))
    return "Direct muscle-building amino acid source — great for recovery.";
  if (n.includes("oat") || n.includes("wheat") || n.includes("grain"))
    return "Slow-digesting carbs provide sustained energy for long sessions.";
  if (n.includes("creatine"))
    return "Proven to boost strength and power output during resistance training.";
  if (n.includes("bcaa") || n.includes("leucine") || n.includes("isoleucine"))
    return "Essential amino acids that directly stimulate muscle protein synthesis.";
  if (n.includes("potassium"))
    return "Key electrolyte for muscle contraction and preventing cramps.";
  if (n.includes("magnesium"))
    return "Supports energy production and reduces post-workout muscle fatigue.";
  if (n.includes("iron"))
    return "Essential for oxygen transport to muscles during cardio.";
  if (n.includes("vitamin c") || n.includes("ascorbic"))
    return "Antioxidant that helps reduce post-workout inflammation and oxidative stress.";
  if (n.includes("vitamin d"))
    return "Supports testosterone levels and bone density — key for lifters.";
  if (n.includes("fiber") || n.includes("psyllium"))
    return "Aids digestion and keeps you full longer between meals.";
  if (n.includes("turmeric") || n.includes("curcumin"))
    return "Natural anti-inflammatory that can help with post-workout recovery.";

  // Negative contributors
  if (n.includes("sugar") || n.includes("sucrose") || n.includes("fructose"))
    return "Refined sugar spikes insulin and promotes fat storage — avoid before workouts.";
  if (n.includes("sodium") || n.includes("salt"))
    return "High sodium spikes water retention and bloating post-workout.";
  if (n.includes("palm oil") || n.includes("hydrogenated"))
    return "Saturated/trans fats slow digestion and raise LDL — bad for cardiovascular fitness.";
  if (n.includes("maida") || n.includes("refined flour"))
    return "High glycemic refined carb that causes energy crashes mid-workout.";
  if (n.includes("aspartame") || n.includes("saccharin"))
    return "Artificial sweetener with potential gut microbiome disruption — affects recovery.";
  if (n.includes("msg") || n.includes("monosodium"))
    return "Can cause headaches and water retention in sodium-sensitive gym-goers.";
  if (n.includes("tartrazine") || n.includes("color") || n.includes("dye"))
    return "Synthetic dye with no nutritional benefit — adds unnecessary processing load.";
  if (n.includes("preservative") || n.includes("benzoate") || n.includes("sorbate"))
    return "Chemical preservative — adds additives without any performance benefit.";
  if (n.includes("trans fat") || n.includes("partially hydrogenated"))
    return "Trans fats directly impair endothelial function and cardiovascular performance.";

  // Default based on rating
  if (rating === "good") return "A clean ingredient that supports your fitness goals.";
  if (rating === "avoid") return "This ingredient may hinder performance or recovery.";
  return "A common food ingredient with moderate impact on gym performance.";
}

/** Plain-English simplification of an ingredient name */
function simplifyIngredientName(name: string): string {
  const map: Record<string, string> = {
    "maida": "Refined Flour (Maida)",
    "refined wheat flour": "Refined Flour",
    "high fructose corn syrup": "High-Fructose Corn Syrup (liquid sugar)",
    "monosodium glutamate": "MSG (Flavor Booster)",
    "sodium benzoate": "Sodium Benzoate (Preservative)",
    "tartrazine": "Tartrazine (Yellow Food Dye)",
    "aspartame": "Aspartame (Artificial Sweetener)",
    "palm oil": "Palm Oil (Saturated Fat)",
    "soy lecithin": "Soy Lecithin (Emulsifier)",
    "maltodextrin": "Maltodextrin (Processed Starch)",
    "caramel color": "Caramel Colour (Food Dye)",
    "butylated hydroxyanisole": "BHA (Chemical Preservative)",
    "potassium sorbate": "Potassium Sorbate (Preservative)",
    "xanthan gum": "Xanthan Gum (Thickener)",
  };
  const lower = name.toLowerCase().trim();
  for (const [k, v] of Object.entries(map)) {
    if (lower.includes(k)) return v;
  }
  // Capitalize first letter
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function whatIsIngredient(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("whey")) return "A fast-digesting milk-derived protein powder.";
  if (n.includes("oat")) return "Whole grain providing slow-release carbohydrate energy.";
  if (n.includes("sugar") || n.includes("sucrose")) return "A simple refined sugar for quick but short-lived energy.";
  if (n.includes("palm oil")) return "A highly saturated vegetable oil used for texture.";
  if (n.includes("maida") || n.includes("refined flour")) return "White flour stripped of fiber and nutrients.";
  if (n.includes("sodium") && n.includes("benzoate")) return "A chemical preservative to extend shelf life.";
  if (n.includes("msg") || n.includes("monosodium glutamate")) return "A savory flavor enhancer added to processed foods.";
  if (n.includes("lecithin")) return "An emulsifier that blends oil and water together.";
  if (n.includes("maltodextrin")) return "A rapidly absorbed processed starch used as a filler.";
  if (n.includes("tartrazine")) return "A synthetic yellow food dye with no nutritional value.";
  if (n.includes("aspartame")) return "An artificial calorie-free sweetener used in sugar-free products.";
  if (n.includes("caramel color")) return "A synthetic brown food dye for coloring.";
  if (n.includes("vitamin c") || n.includes("ascorbic")) return "A natural antioxidant vitamin added for health benefits.";
  if (n.includes("salt") || n.includes("sodium chloride")) return "Common table salt — adds flavor and acts as a preservative.";
  if (n.includes("fiber") || n.includes("fibre")) return "Dietary fiber that aids digestion and helps you feel full.";
  if (n.includes("potassium")) return "An essential mineral for heart and muscle function.";
  if (n.includes("magnesium")) return "A mineral critical for energy metabolism and muscle function.";
  return "A food ingredient — check the label for more details.";
}

// ─── Goal Score Computation ───────────────────────────────────────────────────

function computeGoalScores(v: ProductVersion): GymGoalScores {
  const n = v.nutrition;
  const proteinG = n.protein ?? 0;
  const carbG = n.carbs ?? 0;
  const fatG = n.totalFat ?? 0;
  const sugarG = n.sugar ?? 0;
  const sodiumMg = n.sodium ?? 0;
  const calPer = n.caloriesPerServing ?? 0;
  const fiberG = n.fiber ?? 0;
  const satFatG = n.saturatedFat ?? 0;
  const hasHighConcern = v.structuredIngredients?.some(
    (i) => i.concernLevel === "high"
  ) ?? false;

  // Muscle Gain — needs protein, moderate carbs, low sugar
  let muscle = 5;
  muscle += proteinG >= 10 ? 3 : proteinG >= 5 ? 1.5 : -1;
  muscle += carbG >= 20 && carbG <= 50 ? 1 : 0;
  muscle -= sugarG > 15 ? 2 : sugarG > 8 ? 1 : 0;
  muscle -= hasHighConcern ? 1 : 0;

  // Fat Loss — low cal, high protein, low sugar, low fat
  let fatLoss = 5;
  fatLoss += calPer < 150 ? 2 : calPer < 250 ? 0 : -2;
  fatLoss += proteinG >= 8 ? 2 : proteinG >= 4 ? 1 : -0.5;
  fatLoss -= sugarG > 10 ? 2.5 : sugarG > 5 ? 1 : 0;
  fatLoss -= satFatG > 5 ? 2 : satFatG > 2 ? 1 : 0;
  fatLoss -= sodiumMg > 400 ? 1 : 0;

  // Endurance — needs carbs, low fat, low sodium
  let endurance = 5;
  endurance += carbG >= 25 ? 2 : carbG >= 15 ? 1 : -0.5;
  endurance += fiberG >= 3 ? 1 : 0;
  endurance -= fatG > 15 ? 1.5 : fatG > 8 ? 0.5 : 0;
  endurance -= sodiumMg > 500 ? 1 : 0;
  endurance -= hasHighConcern ? 0.5 : 0;

  // Clean Eating — no high concern ingredients, high fiber, low additives
  let clean = 8;
  clean -= hasHighConcern ? 3 : 0;
  clean -= v.ingredientComplexity === "Complex" ? 2 : v.ingredientComplexity === "Moderate" ? 1 : 0;
  clean -= sugarG > 10 ? 1.5 : 0;
  clean -= sodiumMg > 400 ? 1 : 0;
  clean += fiberG >= 3 ? 0.5 : 0;
  clean += proteinG >= 8 ? 0.5 : 0;

  return {
    muscleGain: clamp(Math.round(muscle)),
    fatLoss: clamp(Math.round(fatLoss)),
    endurance: clamp(Math.round(endurance)),
    cleanEating: clamp(Math.round(clean)),
  };
}

// ─── Best Consume Time ────────────────────────────────────────────────────────

function computeBestConsumeTime(v: ProductVersion): {
  time: BestConsumeTime;
  label: string;
} {
  const n = v.nutrition;
  const proteinG = n.protein ?? 0;
  const carbG = n.carbs ?? 0;
  const sugarG = n.sugar ?? 0;
  const fatG = n.totalFat ?? 0;
  const sodiumMg = n.sodium ?? 0;

  // High sodium or high fat → avoid around workout
  if (sodiumMg > 500 || fatG > 15) {
    return {
      time: "avoid-around-workout",
      label: "🚫 Avoid Around Workout",
    };
  }
  // High protein + moderate carbs → post-workout
  if (proteinG >= 10 && carbG >= 15) {
    return { time: "post-workout", label: "🏋️ Post-Workout" };
  }
  // High quick carbs + some sugar → pre-workout energy
  if (carbG >= 25 && sugarG <= 10 && fatG < 8) {
    return { time: "pre-workout", label: "⚡ Pre-Workout" };
  }
  // Low impact, neutral profile
  if (fatG < 5 && sodiumMg < 200 && sugarG < 5) {
    return { time: "anytime", label: "✅ Anytime" };
  }

  return { time: "avoid-around-workout", label: "🚫 Avoid Around Workout" };
}

// ─── Quick Verdict Summary ────────────────────────────────────────────────────

function buildQuickVerdict(
  verdict: GymVerdict,
  v: ProductVersion,
  scores: GymGoalScores,
  bestTime: BestConsumeTime
): string {
  const n = v.nutrition;
  const parts: string[] = [];

  if (verdict === "gym-friendly") {
    parts.push(
      `This product is a solid gym companion with ${n.protein}g of protein per serving.`
    );
    if (scores.muscleGain >= 7) {
      parts.push("It supports muscle building and recovery well.");
    } else {
      parts.push("It works well for energy and endurance.");
    }
    if (bestTime === "post-workout") {
      parts.push("Best consumed within 30–45 minutes after your workout.");
    } else if (bestTime === "pre-workout") {
      parts.push("Great as a pre-workout energy source 45–60 minutes before training.");
    }
  } else if (verdict === "use-carefully") {
    const issues: string[] = [];
    if ((n.sugar ?? 0) > 8) issues.push("refined sugar");
    if ((n.sodium ?? 0) > 300) issues.push("sodium");
    if ((n.saturatedFat ?? 0) > 3) issues.push("saturated fat");
    parts.push(
      `This product has ${issues.length > 0 ? issues.join(" and ") + " that may" : "certain factors that"} work against your fitness goals.`
    );
    if (scores.fatLoss <= 4) {
      parts.push("Not ideal if you're cutting — better saved for maintenance phases.");
    } else {
      parts.push("You can include it in your diet but track your portions carefully.");
    }
    parts.push("Limit to 2–3 times a week max and avoid on training days if possible.");
  } else {
    parts.push("This product is not well-suited for a fitness-focused diet.");
    parts.push(
      "High in refined ingredients, sugar, or chemical additives that hinder performance and recovery."
    );
    parts.push(
      "If you must, treat it as a once-a-month cheat item and never consume it near a workout."
    );
  }

  return parts.join(" ");
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function computeGymAnalysis(v: ProductVersion): GymAnalysis {
  const n = v.nutrition;

  // Overall verdict from nutrition + additives
  const proteinG = n.protein ?? 0;
  const sugarG = n.sugar ?? 0;
  const sodiumMg = n.sodium ?? 0;
  const satFatG = n.saturatedFat ?? 0;
  const hasHighConcern = v.structuredIngredients?.some(
    (i) => i.concernLevel === "high"
  ) ?? false;

  let verdictScore = 5;
  verdictScore += proteinG >= 10 ? 2 : proteinG >= 5 ? 1 : -1;
  verdictScore -= sugarG > 15 ? 3 : sugarG > 8 ? 1.5 : 0;
  verdictScore -= sodiumMg > 500 ? 2 : sodiumMg > 300 ? 1 : 0;
  verdictScore -= satFatG > 5 ? 2 : satFatG > 2 ? 1 : 0;
  verdictScore -= hasHighConcern ? 2 : 0;

  let verdict: GymVerdict;
  let verdictLabel: string;
  let verdictColor: "green" | "yellow" | "red";

  if (verdictScore >= 7) {
    verdict = "gym-friendly";
    verdictLabel = "🟢 Gym-Friendly — Good for your goals";
    verdictColor = "green";
  } else if (verdictScore >= 4) {
    verdict = "use-carefully";
    verdictLabel = "🟡 Use Carefully — Has trade-offs";
    verdictColor = "yellow";
  } else {
    verdict = "avoid";
    verdictLabel = "🔴 Avoid — Not suited for fitness";
    verdictColor = "red";
  }

  // Macros
  const macros: GymMacro[] = [
    {
      label: "Protein",
      sublabel: "Muscle Builder",
      value: proteinG,
      unit: "g",
      color: "bg-blue-500",
      textColor: "text-blue-700",
    },
    {
      label: "Carbs",
      sublabel: "Energy Fuel",
      value: n.carbs ?? 0,
      unit: "g",
      color: "bg-orange-400",
      textColor: "text-orange-700",
    },
    {
      label: "Fat",
      sublabel: "Fat Content",
      value: n.totalFat ?? 0,
      unit: "g",
      color: "bg-rose-400",
      textColor: "text-rose-700",
    },
    {
      label: "Sugar",
      sublabel: sugarG > 5 ? "⚠️ Watch Out" : "Sugars",
      value: sugarG,
      unit: "g",
      color: sugarG > 5 ? "bg-amber-400" : "bg-emerald-400",
      textColor: sugarG > 5 ? "text-amber-700" : "text-emerald-700",
      watchOut: sugarG > 5,
    },
  ];

  // Ingredient breakdowns — prefer structuredIngredients, fallback to simplifiedIngredients
  const ingredientBreakdowns: GymIngredientAnalysis[] = [];

  if (v.structuredIngredients && v.structuredIngredients.length > 0) {
    for (const ing of v.structuredIngredients) {
      const rating = mapConcernToGymRating(ing.concernLevel);
      const { frequency, label: frequencyLabel } = gymFrequencyFromRating(rating);
      ingredientBreakdowns.push({
        name: ing.name,
        simpleName: simplifyIngredientName(ing.name),
        whatIsIt: ing.explanation || whatIsIngredient(ing.name),
        gymRating: rating,
        gymWhy: gymReasonFor(ing.name, rating),
        frequency,
        frequencyLabel,
      });
    }
  } else {
    // Fallback: use simplifiedIngredients array
    for (const ingName of v.simplifiedIngredients.slice(0, 10)) {
      const n = ingName.toLowerCase();
      const isHighConcern =
        n.includes("sugar") ||
        n.includes("maida") ||
        n.includes("refined") ||
        n.includes("aspartame") ||
        n.includes("tartrazine") ||
        n.includes("msg") ||
        n.includes("palm oil");
      const isGood =
        n.includes("protein") ||
        n.includes("fiber") ||
        n.includes("oat") ||
        n.includes("vitamin") ||
        n.includes("mineral") ||
        n.includes("milk") ||
        n.includes("wheat");
      const rating: GymIngredientRating = isHighConcern
        ? "avoid"
        : isGood
        ? "good"
        : "neutral";
      const { frequency, label: frequencyLabel } = gymFrequencyFromRating(rating);
      ingredientBreakdowns.push({
        name: ingName,
        simpleName: simplifyIngredientName(ingName),
        whatIsIt: whatIsIngredient(ingName),
        gymRating: rating,
        gymWhy: gymReasonFor(ingName, rating),
        frequency,
        frequencyLabel,
      });
    }
  }

  const goalScores = computeGoalScores(v);
  const { time: bestConsumeTime, label: bestConsumeLabel } = computeBestConsumeTime(v);
  const quickVerdict = buildQuickVerdict(verdict, v, goalScores, bestConsumeTime);

  return {
    verdict,
    verdictLabel,
    verdictColor,
    macros,
    ingredientBreakdowns,
    goalScores,
    bestConsumeTime,
    bestConsumeLabel,
    quickVerdict,
  };
}
