export type NutritionLevel = "Low" | "Moderate" | "High";
export type SatietyLabel = "More filling" | "Moderately filling" | "Less filling";
export type BalanceLabel = "More balanced" | "Moderately balanced" | "Less balanced";
export type OccasionLabel = "Better staple candidate" | "Moderate frequency" | "Better occasional treat";
export type TrustLevel = "Verified" | "Community verified" | "Unverified" | "Under review";

export interface DailyValuePercentages {
  totalFat?: number;
  saturatedFat?: number;
  cholesterol?: number;
  sodium?: number;
  carbs?: number;
  fiber?: number;
  protein?: number;
  vitaminA?: number;
  vitaminC?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
}

export interface NutritionFacts {
  caloriesPerServing: number;
  caloriesPerPack: number;
  totalFat: number;
  saturatedFat: number;
  transFat?: number;
  carbs: number;
  sugar: number;
  addedSugar?: number;
  fiber: number;
  protein: number;
  sodium: number;
  cholesterol?: number;
  vitamins?: Record<string, number>;
  minerals?: Record<string, number>;
  dailyValuePercentages: DailyValuePercentages;
}

export type RecommendedFrequency = "daily" | "few_times_week" | "weekly" | "monthly" | "rarely" | "avoid";

export interface IngredientModel {
  name: string;
  insCode?: string;
  category: "preservative" | "emulsifier" | "flavor-enhancer" | "sweetener" | "colorant" | "natural";
  explanation: string;
  concernLevel: "none" | "low" | "moderate" | "high";
  source: string;
}

export interface BodyImpactSummary {
  energyDensityLabel: NutritionLevel;
  satietyLabel: SatietyLabel;
  sugarFlag: NutritionLevel;
  sodiumFlag: NutritionLevel;
  saturatedFatFlag: NutritionLevel;
  processingFlag: NutritionLevel;
  proteinFlag: NutritionLevel;
  fiberFlag: NutritionLevel;
  balanceLabel: BalanceLabel;
  occasionLabel: OccasionLabel;
  summaryText: string;
  disclaimerText: string;
  recommendedFrequency?: RecommendedFrequency;
  frequencyReasoning?: string;
}

export interface ProductVersion {
  id: string;
  country: string;
  packSize: string;
  unit: string;
  servingSize: string;
  servingsPerPack: number;
  ingredientsText: string;
  simplifiedIngredients: string[];
  highlightedIngredients: { name: string; type: string; note: string }[];
  allergens: string[];
  ingredientComplexity: "Simple" | "Moderate" | "Complex";
  formulaNotes?: string;
  versionDate: string;
  nutrition: NutritionFacts;
  bodyImpact: BodyImpactSummary;
  structuredIngredients?: IngredientModel[];
}

export interface PriceRecord {
  store: string;
  country: string;
  price: number;
  currency: string;
  dateObserved: string;
  unitPrice: number;
  unitPriceLabel: string;
}

export interface PackSizeChange {
  date: string;
  oldSize: string;
  newSize: string;
  percentChange: number;
  country: string;
  notes?: string;
}

export interface FormulaChange {
  date: string;
  country: string;
  added: string[];
  removed: string[];
  summary: string;
  oldIngredients: string;
  newIngredients: string;
}

export interface SubmissionMedia {
  frontPhoto?: string;
  backPhoto?: string;
  nutritionLabelPhoto?: string;
  barcodePhoto?: string;
  comparisonPhoto?: string;
}

export interface Submission {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  barcode: string;
  country: string;
  store: string;
  notes: string;
  submittedAt: string;
  trustContribution: number;
  media: SubmissionMedia;
  status: "approved" | "pending" | "under_review";
}

export interface Confirmation {
  submissionId: string;
  confirmerName: string;
  vote: "confirm" | "dispute";
  comment: string;
  date: string;
}

export interface CountryComparison {
  country: string;
  packSize: string;
  caloriesPerServing: number;
  sugar: number;
  sodium: number;
  protein: number;
  keyIngredientDiff?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  barcode: string;
  category: string;
  manufacturer: string;
  baseDescription: string;
  imageUrl: string;
  trustScore: number;
  trustLevel: TrustLevel;
  versions: ProductVersion[];
  prices: PriceRecord[];
  packSizeChanges: PackSizeChange[];
  formulaChanges: FormulaChange[];
  submissions: Submission[];
  confirmations: Confirmation[];
  countryComparisons: CountryComparison[];
  badges: string[];
}

export interface ChangeFeedItem {
  id: string;
  type: "shrinkflation" | "formula" | "price" | "trending" | "new_scan";
  productId: string;
  productName: string;
  brand: string;
  country: string;
  date: string;
  summary: string;
  trustScore: number;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  productCount: number;
}

export const MEDICAL_DISCLAIMER =
  "This is general educational guidance based on publicly available nutrition data. It is not medical advice, clinical diagnosis, or individualized treatment. Personal nutritional requirements vary by body physiology, activity level, medical history, and overall dietary context. Consult a certified medical doctor or registered clinical dietitian before making dietary changes.";

export const CONTENT_DISCLAIMER =
  "JeevanReport is an independent, non-profit consumer awareness and public education initiative operating under the Consumer Protection Act, 2019 (Right to be Informed) and Article 19(1)(a) of the Constitution of India. All product information, ingredient lists, net quantities, packaging claims, and nutritional values are verbatim factual transcriptions of manufacturers' own publicly printed labels and statutory FSSAI/Legal Metrology disclosures. Analytical observations, ingredient health flags, and shrinkflation records reflect good-faith algorithmic and editorial analysis—not allegations of illegal conduct, malice, or commercial disparagement. Brand names, logos, and trademarks belong exclusively to their respective owners and are displayed strictly for product identification and non-commercial nominative fair use (Section 30, Trade Marks Act, 1999). Manufacturers and brand representatives are invited to submit verified updates or packaging revisions via our verified corrections portal.";

export const SHORT_LEGAL_DISCLAIMER =
  "🛡️ Consumer Transparency Notice: All ratings and ingredient flags are independent editorial evaluations based strictly on the manufacturer's own public label and peer-reviewed health guidance (FSSAI/ICMR/WHO). We assert no defamatory intent, commercial endorsement, or legal allegations against any brand.";

export const LEGAL_SAFE_HARBOR_NOTICE =
  "JeevanReport operates under Section 79 of the Information Technology Act, 2000 (Intermediary Safe Harbor) and the Consumer Protection Act, 2019. We maintain a zero-malice policy and invite immediate right-of-reply or verified packaging corrections at corrections@jeevanreport.in.";
