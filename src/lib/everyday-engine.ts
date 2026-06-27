import type { ProductVersion } from "./types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type EverydayVerdict = "good" | "sometimes" | "avoid";
export type EverydayFrequency = "daily" | "few_times_week" | "occasionally" | "rarely";

export interface EverydayIngredientCard {
  name: string;
  everydayName: string;       // simplified plain-English name
  isGoodOrBad: "good" | "neutral" | "bad";
  oneLiner: string;           // e.g. "Too much of this can raise blood sugar"
  frequency: EverydayFrequency;
  frequencyEmoji: string;     // 🟢/🟡/🟠/🔴
  frequencyText: string;      // "Fine every day" etc.
}

export interface EverydayAnalysis {
  verdict: EverydayVerdict;
  verdictLabel: string;       // "Good choice for daily use" etc.
  verdictColor: "green" | "yellow" | "red";
  ingredientCards: EverydayIngredientCard[];
  caloriesSimplified: string; // "1 serving = roughly 2 rotis"
  shouldIEatThis: string;     // 2–3 line human answer
  healthierSwap?: string;     // only for yellow/red
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function everydayNameFor(name: string): string {
  const n = name.toLowerCase().trim();
  if (n.includes("maida") || n.includes("refined wheat flour") || n.includes("refined flour"))
    return "Maida (Refined White Flour)";
  if (n.includes("whole wheat") || n.includes("atta"))
    return "Whole Wheat Flour (Atta)";
  if (n.includes("palm oil")) return "Palm Oil";
  if (n.includes("high fructose corn syrup") || n.includes("hfcs"))
    return "Corn Syrup (Liquid Sugar)";
  if (n.includes("monosodium glutamate") || n.includes("msg"))
    return "MSG (Taste Enhancer)";
  if (n.includes("sodium benzoate")) return "Sodium Benzoate (Preservative)";
  if (n.includes("tartrazine") || n.includes("ins 102"))
    return "Tartrazine (Artificial Yellow Colour)";
  if (n.includes("aspartame") || n.includes("ins 951"))
    return "Aspartame (Artificial Sweetener)";
  if (n.includes("caramel color") || n.includes("caramel colour"))
    return "Caramel Colour (Brown Food Dye)";
  if (n.includes("soy lecithin") || n.includes("ins 322"))
    return "Soy Lecithin (Mixing Agent)";
  if (n.includes("maltodextrin")) return "Maltodextrin (Processed Starch Filler)";
  if (n.includes("potassium sorbate") || n.includes("ins 202"))
    return "Potassium Sorbate (Preservative)";
  if (n.includes("xanthan gum") || n.includes("ins 415"))
    return "Xanthan Gum (Thickener)";
  if (n.includes("butylated hydroxyanisole") || n.includes("bha"))
    return "BHA (Chemical Preservative)";
  if (n.includes("sugar") || n.includes("sucrose")) return "Sugar";
  if (n.includes("salt") || n.includes("sodium chloride")) return "Salt";
  if (n.includes("milk") || n.includes("skimmed milk")) return "Milk";
  if (n.includes("cocoa")) return "Cocoa";
  if (n.includes("oat")) return "Oats";
  if (n.includes("rice")) return "Rice";
  if (n.includes("protein")) return "Protein";
  if (n.includes("fiber") || n.includes("fibre")) return "Dietary Fibre";
  if (n.includes("vitamin c") || n.includes("ascorbic acid")) return "Vitamin C";
  if (n.includes("vitamin d")) return "Vitamin D";
  // Capitalize first letter, keep the rest
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function everydayOneLinerFor(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("maida") || n.includes("refined flour"))
    return "White flour with fiber and nutrients stripped out — digests fast, keeps you hungry.";
  if (n.includes("whole wheat") || n.includes("atta"))
    return "Full grain flour that keeps you full longer and has more nutrients.";
  if (n.includes("palm oil"))
    return "A type of fat that is fine in small amounts but can raise 'bad' cholesterol if eaten often.";
  if (n.includes("sugar") || n.includes("sucrose"))
    return "Gives a sweet taste and a quick energy burst, but too much leads to weight gain and energy crashes.";
  if (n.includes("high fructose corn syrup") || n.includes("hfcs"))
    return "A very sweet processed liquid sugar linked to fatty liver and weight gain.";
  if (n.includes("salt") || n.includes("sodium chloride"))
    return "Adds taste, but too much salt raises blood pressure over time.";
  if (n.includes("msg") || n.includes("monosodium"))
    return "Makes food taste richer and savory — generally safe, but may cause headaches in some people.";
  if (n.includes("sodium benzoate"))
    return "A chemical that stops food from spoiling — best avoided in large amounts.";
  if (n.includes("tartrazine"))
    return "An artificial yellow dye that may cause allergies or hyperactivity in children.";
  if (n.includes("aspartame"))
    return "A zero-calorie sweetener — some people prefer to avoid it given ongoing research.";
  if (n.includes("caramel color") || n.includes("caramel colour"))
    return "A synthetic brown colouring with no nutritional benefit.";
  if (n.includes("soy lecithin"))
    return "Helps mix oily and watery ingredients — generally safe for most people.";
  if (n.includes("maltodextrin"))
    return "A processed starch that breaks down fast and raises blood sugar quickly.";
  if (n.includes("oat")) return "A wholesome grain full of fiber — keeps you full and supports heart health.";
  if (n.includes("milk")) return "A natural source of calcium and protein — good for bones.";
  if (n.includes("fiber") || n.includes("fibre"))
    return "Helps your gut stay healthy and keeps you feeling full longer.";
  if (n.includes("vitamin c") || n.includes("ascorbic"))
    return "A vitamin that boosts immunity and helps the body absorb iron.";
  if (n.includes("vitamin d"))
    return "Keeps your bones strong and supports the immune system.";
  if (n.includes("protein"))
    return "Essential for building and repairing body tissues — good to have in your diet.";
  if (n.includes("potassium"))
    return "A mineral that helps your heart and muscles work properly.";
  if (n.includes("cocoa")) return "The natural base of chocolate — contains antioxidants.";
  return "A common food ingredient — check the label for more context.";
}

function everydayFrequencyFor(name: string): {
  frequency: EverydayFrequency;
  emoji: string;
  text: string;
  isGoodOrBad: "good" | "neutral" | "bad";
} {
  const n = name.toLowerCase();

  // Good / daily-OK ingredients
  if (
    n.includes("whole wheat") ||
    n.includes("atta") ||
    n.includes("oat") ||
    n.includes("milk") ||
    n.includes("fiber") ||
    n.includes("fibre") ||
    n.includes("vitamin c") ||
    n.includes("vitamin d") ||
    n.includes("protein") ||
    n.includes("potassium") ||
    n.includes("cocoa") ||
    n.includes("lecithin") ||
    n.includes("magnesium")
  ) {
    return { frequency: "daily", emoji: "🟢", text: "Fine every day", isGoodOrBad: "good" };
  }

  // Occasional / moderate
  if (
    n.includes("salt") ||
    n.includes("sodium chloride") ||
    n.includes("palm oil") ||
    n.includes("sugar") ||
    n.includes("sucrose") ||
    n.includes("maltodextrin") ||
    n.includes("xanthan gum") ||
    n.includes("msg") ||
    n.includes("monosodium")
  ) {
    return {
      frequency: "few_times_week",
      emoji: "🟡",
      text: "Once or twice a week is enough",
      isGoodOrBad: "neutral",
    };
  }

  // Rarely / red-flag ingredients
  if (
    n.includes("tartrazine") ||
    n.includes("aspartame") ||
    n.includes("bha") ||
    n.includes("butylated") ||
    n.includes("high fructose") ||
    n.includes("hfcs") ||
    n.includes("sodium benzoate") ||
    n.includes("caramel color") ||
    n.includes("caramel colour") ||
    n.includes("hydrogenated") ||
    n.includes("trans fat")
  ) {
    return {
      frequency: "rarely",
      emoji: "🔴",
      text: "Barely ever — once or twice a year is plenty",
      isGoodOrBad: "bad",
    };
  }

  // Default: occasionally
  if (n.includes("maida") || n.includes("refined flour")) {
    return {
      frequency: "occasionally",
      emoji: "🟠",
      text: "Have it occasionally — once or twice a month",
      isGoodOrBad: "bad",
    };
  }

  return {
    frequency: "few_times_week",
    emoji: "🟡",
    text: "Once or twice a week is enough",
    isGoodOrBad: "neutral",
  };
}

// ─── Calorie Simplification ────────────────────────────────────────────────────

function simplifyCalories(caloriesPerServing: number, caloriesPerPack: number): string {
  // 1 roti ≈ 80–90 kcal. Use 85 as midpoint.
  const rotiEquiv = Math.round(caloriesPerServing / 85);
  const dayPercent = Math.round((caloriesPerPack / 2000) * 100);

  if (rotiEquiv <= 0) {
    return `One serving of this is very light — well under a single roti's worth of energy.`;
  }
  if (rotiEquiv === 1) {
    return `One serving of this = roughly the same energy as eating 1 roti. The full pack = about ${dayPercent}% of what an average person needs in a full day.`;
  }
  return `One serving of this = roughly the same energy as eating ${rotiEquiv} rotis. The full pack = about ${dayPercent}% of what an average person needs in a full day.`;
}

// ─── Should I Eat This ────────────────────────────────────────────────────────

function buildShouldIEatThis(
  v: ProductVersion,
  verdict: EverydayVerdict
): string {
  const n = v.nutrition;
  const highSugar = (n.sugar ?? 0) > 10;
  const highSalt = (n.sodium ?? 0) > 400;
  const lowProtein = (n.protein ?? 0) < 3;
  const highCal = (n.caloriesPerServing ?? 0) > 250;
  const hasBadIngredients = v.structuredIngredients?.some(
    (i) => i.concernLevel === "high"
  ) ?? false;

  if (verdict === "good") {
    const perks: string[] = [];
    if ((n.protein ?? 0) >= 5) perks.push("protein");
    if ((n.fiber ?? 0) >= 3) perks.push("fibre");
    const perkStr = perks.length > 0 ? ` It has a decent amount of ${perks.join(" and ")}.` : "";
    return `This is a decent everyday option.${perkStr} It doesn't have major red flags in terms of sugar, salt, or harmful additives. You can eat it regularly as part of a balanced diet.`;
  }

  if (verdict === "sometimes") {
    const issues: string[] = [];
    if (highSugar) issues.push("sugar");
    if (highSalt) issues.push("salt");
    if (highCal) issues.push("calories");
    const issueStr = issues.length > 0 ? ` It has a fair amount of ${issues.join(" and ")}.` : "";
    return `This is okay to have once in a while as a treat.${issueStr} Eating it every day can lead to weight gain, energy crashes, or other long-term issues. Try to pair it with something healthier — like a fruit or a glass of milk.`;
  }

  // avoid
  const badParts: string[] = [];
  if (highSugar) badParts.push("a lot of sugar");
  if (highSalt) badParts.push("high salt");
  if (lowProtein) badParts.push("very little protein");
  if (hasBadIngredients) badParts.push("artificial additives that aren't great long-term");
  const badStr = badParts.length > 0 ? ` It has ${badParts.join(", ")}.` : "";
  return `It's better to avoid this or have it very rarely.${badStr} There are much healthier options available that taste good and are better for your body over time.`;
}

// ─── Healthier Swap ────────────────────────────────────────────────────────────

function suggestSwap(v: ProductVersion, verdict: EverydayVerdict): string | undefined {
  if (verdict === "good") return undefined;

  const n = v.nutrition;
  const cat = (v.ingredientsText ?? "").toLowerCase();

  // Chips / fried snacks
  if (
    cat.includes("potato") ||
    cat.includes("chips") ||
    cat.includes("fried") ||
    cat.includes("maida")
  ) {
    return "Try: Roasted makhana, baked chana, or multigrain crackers instead.";
  }
  // Biscuits / cookies
  if (cat.includes("biscuit") || cat.includes("cookie") || cat.includes("refined flour")) {
    return "Try: Digestive biscuits made with oats or ragi, or multigrain khakhra.";
  }
  // Sugary drinks / beverages
  if (
    cat.includes("sugar syrup") ||
    cat.includes("glucose") ||
    (n.sugar ?? 0) > 20
  ) {
    return "Try: Fresh nimbu paani (lemon water), coconut water, or plain buttermilk (chaas).";
  }
  // Chocolate / candy
  if (cat.includes("cocoa butter") || cat.includes("candy") || cat.includes("toffee")) {
    return "Try: Dark chocolate (70%+ cocoa) in small portions, or dates with nuts.";
  }
  // Noodles / instant
  if (cat.includes("noodle") || cat.includes("instant") || cat.includes("maggi")) {
    return "Try: Whole wheat noodles with vegetables, or homemade poha/upma.";
  }
  // Soft drinks / soda
  if (
    cat.includes("carbonated") ||
    cat.includes("soda") ||
    cat.includes("cola")
  ) {
    return "Try: Sparkling water with fresh fruit, jaljeera, or homemade aam panna.";
  }
  // Packaged juice
  if (cat.includes("juice") || cat.includes("fruit drink")) {
    return "Try: Whole fruits or freshly squeezed juice — no added sugar versions.";
  }
  // Dairy / high fat
  if ((n.saturatedFat ?? 0) > 5 && cat.includes("cream")) {
    return "Try: Low-fat curd (dahi) or skimmed milk alternatives.";
  }

  return "Try: A homemade version with less sugar, less salt, and whole grain flour.";
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function computeEverydayAnalysis(v: ProductVersion): EverydayAnalysis {
  const n = v.nutrition;

  // Verdict
  const highSugar = (n.sugar ?? 0) > 10;
  const highSalt = (n.sodium ?? 0) > 400;
  const highSatFat = (n.saturatedFat ?? 0) > 5;
  const hasBadIngredients =
    v.structuredIngredients?.some((i) => i.concernLevel === "high") ?? false;
  const isHighlyProcessed = v.ingredientComplexity === "Complex";

  const redFlags = [highSugar, highSalt, highSatFat, hasBadIngredients, isHighlyProcessed].filter(
    Boolean
  ).length;

  let verdict: EverydayVerdict;
  let verdictLabel: string;
  let verdictColor: "green" | "yellow" | "red";

  if (redFlags === 0) {
    verdict = "good";
    verdictLabel = "🟢 Good choice for daily use";
    verdictColor = "green";
  } else if (redFlags <= 2) {
    verdict = "sometimes";
    verdictLabel = "🟡 OK sometimes — not every day";
    verdictColor = "yellow";
  } else {
    verdict = "avoid";
    verdictLabel = "🔴 Better to avoid or have rarely";
    verdictColor = "red";
  }

  // Ingredient cards — prefer structured, fallback to simplified list
  const ingredientCards: EverydayIngredientCard[] = [];

  if (v.structuredIngredients && v.structuredIngredients.length > 0) {
    for (const ing of v.structuredIngredients) {
      const { frequency, emoji, text, isGoodOrBad } = everydayFrequencyFor(ing.name);
      // Override for high-concern
      const finalFreq =
        ing.concernLevel === "high"
          ? { frequency: "rarely" as EverydayFrequency, emoji: "🔴", text: "Barely ever — once or twice a year is plenty", isGoodOrBad: "bad" as const }
          : { frequency, emoji, text, isGoodOrBad };
      ingredientCards.push({
        name: ing.name,
        everydayName: everydayNameFor(ing.name),
        isGoodOrBad: finalFreq.isGoodOrBad,
        oneLiner: ing.explanation || everydayOneLinerFor(ing.name),
        frequency: finalFreq.frequency,
        frequencyEmoji: finalFreq.emoji,
        frequencyText: finalFreq.text,
      });
    }
  } else {
    for (const ingName of v.simplifiedIngredients.slice(0, 10)) {
      const { frequency, emoji, text, isGoodOrBad } = everydayFrequencyFor(ingName);
      ingredientCards.push({
        name: ingName,
        everydayName: everydayNameFor(ingName),
        isGoodOrBad,
        oneLiner: everydayOneLinerFor(ingName),
        frequency,
        frequencyEmoji: emoji,
        frequencyText: text,
      });
    }
  }

  const caloriesSimplified = simplifyCalories(
    n.caloriesPerServing ?? 0,
    n.caloriesPerPack ?? n.caloriesPerServing ?? 0
  );

  const shouldIEatThis = buildShouldIEatThis(v, verdict);
  const healthierSwap = suggestSwap(v, verdict);

  return {
    verdict,
    verdictLabel,
    verdictColor,
    ingredientCards,
    caloriesSimplified,
    shouldIEatThis,
    healthierSwap,
  };
}
