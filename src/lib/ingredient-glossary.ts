export interface GlossaryEntry {
  slug: string;
  name: string;
  insCode?: string;
  category: "preservative" | "emulsifier" | "flavor-enhancer" | "sweetener" | "colorant" | "natural";
  explanation: string;
  concernLevel: "none" | "low" | "moderate" | "high";
  source: string;
  educationalNote: string;
}

export const ingredientGlossary: GlossaryEntry[] = [
  {
    slug: "high-fructose-corn-syrup",
    name: "High Fructose Corn Syrup (HFCS)",
    category: "sweetener",
    explanation: "A highly refined sugar syrup linked to increased liver fat and metabolic issues.",
    concernLevel: "high",
    source: "WHO",
    educationalNote: "HFCS contributes calories and sugar. Frequent intake of high-sugar foods may not be ideal for people monitoring total sugar intake or blood sugar response — individual needs vary.",
  },
  {
    slug: "monosodium-glutamate",
    name: "Monosodium Glutamate (MSG)",
    insCode: "INS 621",
    category: "flavor-enhancer",
    explanation: "Savory flavor enhancer that may trigger headaches or sensitivity in some people.",
    concernLevel: "moderate",
    source: "FSSAI",
    educationalNote: "MSG is widely used in processed foods. Some people report sensitivity; most regulatory bodies consider it safe at typical dietary levels. Not a medical diagnosis.",
  },
  {
    slug: "palm-oil",
    name: "Palm Oil",
    category: "natural",
    explanation: "Highly saturated vegetable oil used for crispness, but raises cholesterol levels.",
    concernLevel: "moderate",
    source: "ICMR-NIN",
    educationalNote: "Palm oil is relatively high in saturated fat compared to some other oils. Saturated fat intake may be worth monitoring depending on personal dietary goals.",
  },
  {
    slug: "soy-lecithin",
    name: "Soy Lecithin",
    insCode: "INS 322",
    category: "emulsifier",
    explanation: "Common emulsifier used to blend oils and water; generally safe but derived from soy.",
    concernLevel: "low",
    source: "FSSAI",
    educationalNote: "Common in chocolate, baked goods, and spreads. Contains soy — relevant for allergen awareness.",
  },
  {
    slug: "sodium-benzoate",
    name: "Sodium Benzoate",
    insCode: "INS 211",
    category: "preservative",
    explanation: "Preservative that can form cancer-causing benzene when combined with Vitamin C.",
    concernLevel: "moderate",
    source: "FSSAI",
    educationalNote: "Used in beverages, sauces, and personal care. Part of a product's overall sodium and additive profile.",
  },
  {
    slug: "maltodextrin",
    name: "Maltodextrin",
    category: "natural",
    explanation: "High glycemic index thickener that spikes blood sugar faster than table sugar.",
    concernLevel: "low",
    source: "FSSAI",
    educationalNote: "Rapidly digested carbohydrate that may contribute to calorie density without much fiber or protein.",
  },
  {
    slug: "caramel-color",
    name: "Caramel Color",
    insCode: "INS 150a",
    category: "colorant",
    explanation: "Artificial brown dye; certain manufacturing processes can produce traces of carcinogens.",
    concernLevel: "moderate",
    source: "FSSAI",
    educationalNote: "Cosmetic additive with no nutritional value. Some types have been studied for potential concerns at very high exposures.",
  },
  {
    slug: "artificial-flavor",
    name: "Artificial Flavor",
    category: "natural",
    explanation: "Synthesized flavoring chemicals mimicking real foods without adding nutrients.",
    concernLevel: "low",
    source: "FSSAI",
    educationalNote: "Indicates flavor was manufactured rather than derived from named whole-food sources on the label.",
  },
  {
    slug: "tripotassium-phosphate",
    name: "Tripotassium Phosphate",
    insCode: "INS 340",
    category: "preservative",
    explanation: "A phosphate additive; excessive levels can impact kidney health over time.",
    concernLevel: "low",
    source: "FSSAI",
    educationalNote: "Also contributes small amounts of phosphorus and potassium to the product's mineral profile.",
  },
  {
    slug: "dimethicone",
    name: "Dimethicone",
    category: "natural",
    explanation: "A silicone-based smoothing agent used primarily in cosmetics and personal care.",
    concernLevel: "none",
    source: "FSSAI",
    educationalNote: "Personal care ingredient — not a food. May affect hair feel; patch testing advisable for sensitive skin.",
  },
  {
    slug: "tartrazine",
    name: "Tartrazine",
    insCode: "INS 102",
    category: "colorant",
    explanation: "Synthetic yellow azo dye linked to hyperactivity in kids and allergic reactions.",
    concernLevel: "high",
    source: "WHO",
    educationalNote: "Also known as FD&C Yellow No. 5. Frequently found in candies, soft drinks, and packaged chips. May cause allergic reactions in asthma patients.",
  },
  {
    slug: "aspartame",
    name: "Aspartame",
    insCode: "INS 951",
    category: "sweetener",
    explanation: "Artificial low-calorie sweetener classified as possibly carcinogenic to humans.",
    concernLevel: "high",
    source: "WHO",
    educationalNote: "Artificial non-saccharide sweetener used in sugar-free products. Classified as a possible carcinogen (Group 2B) by WHO-IARC.",
  },
  {
    slug: "butylated-hydroxyanisole",
    name: "Butylated Hydroxyanisole (BHA)",
    insCode: "INS 320",
    category: "preservative",
    explanation: "Preservative fat antioxidant suspect of hormone disruption and tumor promotion.",
    concernLevel: "high",
    source: "WHO",
    educationalNote: "Antioxidant preservative used to keep fats from turning rancid. Classified as a possible human carcinogen and endocrine disruptor by international research bodies.",
  }
];

export function getGlossaryEntry(slug: string): GlossaryEntry | undefined {
  return ingredientGlossary.find((e) => e.slug === slug);
}
