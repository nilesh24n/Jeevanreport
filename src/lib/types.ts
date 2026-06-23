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
  "This is general educational guidance based on publicly available nutrition data. It is not medical advice, diagnosis, or treatment. Personal outcomes vary by body size, activity level, health conditions, medications, and total diet.";
