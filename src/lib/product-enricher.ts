import type { Product, IngredientModel } from "./types";
import { findIngredientSlug } from "./ingredient-links";
import { getGlossaryEntry } from "./ingredient-glossary";
import { calculateFrequencyAndReasoning } from "./frequency-engine";

export function enrichProduct(product: Product | null | undefined): Product | null {
  if (!product) return null;

  const enrichedVersions = product.versions.map((version) => {
    // 1. Build structured ingredients from text/simplified array
    const list = version.simplifiedIngredients && version.simplifiedIngredients.length > 0 
      ? version.simplifiedIngredients 
      : (version.ingredientsText ? version.ingredientsText.split(',').map(i => i.trim()).filter(Boolean) : []);

    const structuredIngredients: IngredientModel[] = list.map((name) => {
      const slug = findIngredientSlug(name);
      const entry = slug ? getGlossaryEntry(slug) : undefined;

      if (entry) {
        return {
          name: entry.name,
          insCode: entry.insCode,
          category: entry.category,
          explanation: entry.explanation,
          concernLevel: entry.concernLevel,
          source: entry.source
        };
      } else {
        return {
          name,
          category: "natural",
          explanation: "Whole or basic ingredient; no additive concern noted.",
          concernLevel: "none",
          source: "FSSAI"
        };
      }
    });

    const enrichedVersion = {
      ...version,
      structuredIngredients
    };

    // 2. Calculate frequency and reasoning
    const freq = calculateFrequencyAndReasoning(enrichedVersion);
    enrichedVersion.bodyImpact = {
      ...version.bodyImpact,
      recommendedFrequency: freq.recommendedFrequency,
      frequencyReasoning: freq.frequencyReasoning
    };

    return enrichedVersion;
  });

  return {
    ...product,
    versions: enrichedVersions
  };
}
