export interface GlossaryEntry {
  slug: string;
  name: string;
  type: string;
  summary: string;
  educationalNote: string;
}

export const ingredientGlossary: GlossaryEntry[] = [
  {
    slug: "high-fructose-corn-syrup",
    name: "High Fructose Corn Syrup (HFCS)",
    type: "Sweetener",
    summary: "A liquid sweetener made from corn starch, common in US soft drinks and processed foods.",
    educationalNote: "HFCS contributes calories and sugar. Frequent intake of high-sugar foods may not be ideal for people monitoring total sugar intake or blood sugar response — individual needs vary.",
  },
  {
    slug: "monosodium-glutamate",
    name: "Monosodium Glutamate (MSG)",
    type: "Flavor enhancer",
    summary: "A sodium salt of glutamic acid used to enhance savory (umami) flavor.",
    educationalNote: "MSG is widely used in processed foods. Some people report sensitivity; most regulatory bodies consider it safe at typical dietary levels. Not a medical diagnosis.",
  },
  {
    slug: "palm-oil",
    name: "Palm Oil",
    type: "Oil / fat",
    summary: "A vegetable oil from palm fruit, used for texture and shelf stability.",
    educationalNote: "Palm oil is relatively high in saturated fat compared to some other oils. Saturated fat intake may be worth monitoring depending on personal dietary goals.",
  },
  {
    slug: "soy-lecithin",
    name: "Soy Lecithin",
    type: "Emulsifier",
    summary: "Helps mix ingredients that normally separate, like oil and water.",
    educationalNote: "Common in chocolate, baked goods, and spreads. Contains soy — relevant for allergen awareness.",
  },
  {
    slug: "sodium-benzoate",
    name: "Sodium Benzoate",
    type: "Preservative",
    summary: "Inhibits growth of bacteria, yeast, and fungi in acidic products.",
    educationalNote: "Used in beverages, sauces, and personal care. Part of a product's overall sodium and additive profile.",
  },
  {
    slug: "maltodextrin",
    name: "Maltodextrin",
    type: "Additive / carbohydrate",
    summary: "A processed starch used as a filler, thickener, or flavor carrier.",
    educationalNote: "Rapidly digested carbohydrate that may contribute to calorie density without much fiber or protein.",
  },
  {
    slug: "caramel-color",
    name: "Caramel Color",
    type: "Coloring",
    summary: "Brown coloring used in colas, sauces, and baked goods.",
    educationalNote: "Cosmetic additive with no nutritional value. Some types have been studied for potential concerns at very high exposures.",
  },
  {
    slug: "artificial-flavor",
    name: "Artificial Flavor",
    type: "Flavoring",
    summary: "Synthetic compounds designed to mimic natural flavors.",
    educationalNote: "Indicates flavor was manufactured rather than derived from named whole-food sources on the label.",
  },
  {
    slug: "tripotassium-phosphate",
    name: "Tripotassium Phosphate",
    type: "Preservative / pH regulator",
    summary: "Controls acidity and helps preserve texture in cereals and processed foods.",
    educationalNote: "Also contributes small amounts of phosphorus and potassium to the product's mineral profile.",
  },
  {
    slug: "dimethicone",
    name: "Dimethicone",
    type: "Silicone",
    summary: "A silicone-based smoothing agent in shampoos and lotions.",
    educationalNote: "Personal care ingredient — not a food. May affect hair feel; patch testing advisable for sensitive skin.",
  },
];

export function getGlossaryEntry(slug: string): GlossaryEntry | undefined {
  return ingredientGlossary.find((e) => e.slug === slug);
}
