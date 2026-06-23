import { ingredientGlossary } from "./ingredient-glossary";

export function findIngredientSlug(name: string): string | undefined {
  const lower = name.toLowerCase();
  const exact = ingredientGlossary.find(
    (e) => e.name.toLowerCase() === lower || e.name.toLowerCase().startsWith(lower)
  );
  if (exact) return exact.slug;

  return ingredientGlossary.find((e) => {
    const key = e.name.split("(")[0].trim().toLowerCase();
    return lower.includes(key) || key.includes(lower);
  })?.slug;
}
