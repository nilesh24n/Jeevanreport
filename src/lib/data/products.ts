import type { Product, ProductVersion, ChangeFeedItem, Category } from "../types";
import { computeBodyImpact, trustLabel } from "../nutrition-engine";

function makeNutrition(
  cal: number,
  servings: number,
  fat: number,
  satFat: number,
  carbs: number,
  sugar: number,
  fiber: number,
  protein: number,
  sodium: number,
  extras?: Partial<{
    transFat: number;
    addedSugar: number;
    cholesterol: number;
    dv: Record<string, number>;
  }>
) {
  return {
    caloriesPerServing: cal,
    caloriesPerPack: cal * servings,
    totalFat: fat,
    saturatedFat: satFat,
    transFat: extras?.transFat || 0,
    carbs,
    sugar,
    addedSugar: extras?.addedSugar || sugar,
    fiber,
    protein,
    sodium,
    cholesterol: extras?.cholesterol || 0,
    dailyValuePercentages: {
      totalFat: Math.round((fat / 78) * 100),
      saturatedFat: Math.round((satFat / 20) * 100),
      sodium: Math.round((sodium / 2000) * 100), // Adjusted for Indian RDA (~2000mg sodium)
      carbs: Math.round((carbs / 300) * 100),
      fiber: Math.round((fiber / 30) * 100),
      protein: Math.round((protein / 60) * 100),
      ...extras?.dv,
    },
  };
}

const productsRaw: Product[] = [
  {
    id: "maggi-masala-noodles",
    name: "Maggi 2-Minute Masala Noodles",
    brand: "Maggi",
    barcode: "8901058002478",
    category: "instant-foods",
    manufacturer: "Nestlé India Ltd.",
    baseDescription: "Instant noodles with the signature tastemaker masala mix.",
    imageUrl: "https://placehold.co/400x400/fffbeb/d97706?text=Maggi+Noodles",
    trustScore: 94,
    trustLevel: "Verified",
    badges: ["High sodium", "Highly processed", "Smaller pack"],
    versions: [{
      id: "maggi-in-v2",
      country: "India",
      packSize: "70g",
      unit: "g",
      servingSize: "70g (1 pack)",
      servingsPerPack: 1,
      ingredientsText: "Noodles: Wheat Flour (Maida), Palm Oil, Salt, Wheat Gluten, Mineral (Calcium Carbonate), Thickeners. Masala Tastemaker: Hydrolysed Groundnut Protein, Mixed Spices (Onion Powder, Coriander, Chili, Turmeric, Garlic, Cumin, Aniseed, Ginger, Fenugreek, Black Pepper, Clove, Nutmeg, Cardamom), Noodle Powder, Sugar, Edible Starch, Palm Oil, Salt, Flavor Enhancers, Acid regulators, Mineral (Ferric Pyrophosphate).",
      simplifiedIngredients: ["Wheat flour (Maida)", "Palm oil", "Spice blend (onion, turmeric, cumin, ginger)", "Hydrolysed peanut protein", "Flavor enhancers", "Salt"],
      highlightedIngredients: [
        { name: "Palm Oil", type: "Oil", note: "High in saturated fats" },
        { name: "Hydrolysed Groundnut Protein", type: "Protein hydrolysate", note: "Flavor enhancer/MSG alternative" },
        { name: "Flavor Enhancers (635)", type: "Additive", note: "Ribonucleotides used to boost umami taste" }
      ],
      allergens: ["Wheat", "Gluten", "Peanuts"],
      ingredientComplexity: "Complex",
      formulaNotes: "Sodium content adjusted slightly; spice ratio changed in late 2023 formulation.",
      versionDate: "2024-02-15",
      nutrition: makeNutrition(310, 1, 11.8, 5.5, 43.5, 1.2, 2.0, 6.2, 980),
      bodyImpact: computeBodyImpact(makeNutrition(310, 1, 11.8, 5.5, 43.5, 1.2, 2.0, 6.2, 980), "High"),
    }],
    prices: [
      { store: "Reliance Smart", country: "India", price: 12, currency: "INR", dateObserved: "2023-01-10", unitPrice: 0.16, unitPriceLabel: "₹/g" },
      { store: "Reliance Smart", country: "India", price: 14, currency: "INR", dateObserved: "2025-02-01", unitPrice: 0.20, unitPriceLabel: "₹/g" },
      { store: "Blinkit", country: "India", price: 14, currency: "INR", dateObserved: "2025-03-01", unitPrice: 0.20, unitPriceLabel: "₹/g" },
    ],
    packSizeChanges: [{
      date: "2024-05-10", oldSize: "75g", newSize: "70g", percentChange: -6.7, country: "India",
      notes: "Pack size reduced from 75g to 70g while maintaining the ₹14 magic price point."
    }],
    formulaChanges: [{
      date: "2023-08-01", country: "India",
      added: ["Ferric Pyrophosphate"],
      removed: [],
      summary: "Fortified with Iron (Ferric Pyrophosphate) to meet voluntary fortification recommendations.",
      oldIngredients: "Wheat Flour, Palm Oil, Salt, Gluten, Onion Powder, Chili, Turmeric...",
      newIngredients: "Wheat Flour, Palm Oil, Salt, Gluten, Ferric Pyrophosphate, Onion Powder, Chili, Turmeric..."
    }],
    submissions: [{
      id: "sub-maggi-1", userId: "u_amit", userName: "Amit Sharma", productId: "maggi-masala-noodles", barcode: "8901058002478",
      country: "India", store: "D-Mart", notes: "Noticed the weight on my monthly groceries went down to 70g. Used to be 75g.", submittedAt: "2024-05-12",
      trustContribution: 25, status: "approved",
      media: { frontPhoto: "https://placehold.co/300x400/eee/333?text=Maggi+70g" }
    }],
    confirmations: [{ submissionId: "sub-maggi-1", confirmerName: "Pooja K.", vote: "confirm", comment: "Verified on the back panel, weight is indeed 70g now.", date: "2024-05-13" }],
    countryComparisons: [
      { country: "India", packSize: "70g", caloriesPerServing: 310, sugar: 1.2, sodium: 980, protein: 6.2 },
      { country: "UK", packSize: "70g", caloriesPerServing: 302, sugar: 0.8, sodium: 890, protein: 5.9, keyIngredientDiff: "Slightly less sodium to comply with UK guidelines" }
    ]
  },
  {
    id: "good-day-butter-cookies",
    name: "Britannia Good Day Butter Cookies",
    brand: "Britannia",
    barcode: "8901063012172",
    category: "snacks",
    manufacturer: "Britannia Industries Ltd.",
    baseDescription: "Delicious butter cookies with a smile design, a classic Indian tea companion.",
    imageUrl: "https://placehold.co/400x400/fffbeb/d97706?text=Good+Day+Butter",
    trustScore: 91,
    trustLevel: "Verified",
    badges: ["High sugar", "Calorie dense", "Formula changed"],
    versions: [{
      id: "goodday-in-v1",
      country: "India",
      packSize: "66g",
      unit: "g",
      servingSize: "22g (approx. 4 cookies)",
      servingsPerPack: 3,
      ingredientsText: "Refined Wheat Flour (Maida), Sugar, Refined Palm Oil, Butter (2%), Invert Sugar Syrup, Milk Solids, Raising Agents, Iodised Salt, Emulsifiers, Flour Treatment Agent.",
      simplifiedIngredients: ["Wheat flour (Maida)", "Sugar", "Palm oil", "Butter (2%)", "Invert syrup", "Milk solids", "Salt"],
      highlightedIngredients: [
        { name: "Sugar", type: "Sweetener", note: "High content, second ingredient" },
        { name: "Palm Oil", type: "Fat", note: "Primary cooking oil used instead of butter" },
        { name: "Invert Sugar Syrup", type: "Sweetener", note: "High glycemic index sweetener" }
      ],
      allergens: ["Wheat", "Milk", "Soya"],
      ingredientComplexity: "Moderate",
      formulaNotes: "Butter content maintained at 2%; Palm oil remains the major fat component.",
      versionDate: "2024-01-10",
      nutrition: makeNutrition(108, 3, 5.2, 2.6, 13.8, 5.7, 0.3, 1.6, 75),
      bodyImpact: computeBodyImpact(makeNutrition(108, 3, 5.2, 2.6, 13.8, 5.7, 0.3, 1.6, 75), "Moderate"),
    }],
    prices: [
      { store: "Local Kirana", country: "India", price: 10, currency: "INR", dateObserved: "2023-05-15", unitPrice: 0.14, unitPriceLabel: "₹/g" },
      { store: "Zepto", country: "India", price: 10, currency: "INR", dateObserved: "2025-01-20", unitPrice: 0.15, unitPriceLabel: "₹/g" }
    ],
    packSizeChanges: [{
      date: "2024-08-01", oldSize: "72g", newSize: "66g", percentChange: -8.3, country: "India",
      notes: "Britannia reduced the size of their ₹10 pack from 72g to 66g."
    }],
    formulaChanges: [{
      date: "2022-04-01", country: "India",
      added: [],
      removed: ["Hydrogenated Vegetable Fat"],
      summary: "Removed trans-fat-heavy hydrogenated fats, replacing completely with palm oil and real butter.",
      oldIngredients: "Maida, Sugar, Palm Oil, Hydrogenated Vegetable Oil, Butter, Salt...",
      newIngredients: "Maida, Sugar, Palm Oil, Butter, Salt..."
    }],
    submissions: [],
    confirmations: [],
    countryComparisons: []
  },
  {
    id: "kurkure-masala-munch",
    name: "Kurkure Masala Munch",
    brand: "Kurkure",
    barcode: "8901491101831",
    category: "snacks",
    manufacturer: "PepsiCo India Holdings Pvt. Ltd.",
    baseDescription: "Spicy and crunchy puffed corn snacks with authentic Indian spices.",
    imageUrl: "https://placehold.co/400x400/fff1f2/ef4444?text=Kurkure+Masala",
    trustScore: 89,
    trustLevel: "Community verified",
    badges: ["High sodium", "Highly processed", "Calorie dense"],
    versions: [{
      id: "kurkure-in-v1",
      country: "India",
      packSize: "82g",
      unit: "g",
      servingSize: "30g",
      servingsPerPack: 2.7,
      ingredientsText: "Rice Meal, Corn Meal, Gram Meal, Edible Vegetable Oil (Palmolein), Seasoning (Spices & Condiments, Salt, Black Salt, Sugar, Tomato Powder, Onion Powder, Garlic Powder, Citric Acid, Tartaric Acid, Silicon Dioxide, Flavor Enhancers).",
      simplifiedIngredients: ["Rice meal", "Corn meal", "Chickpea flour (Gram meal)", "Palmolein oil", "Masala spice mix (garlic, onion, tomato, black salt)", "Flavor enhancers"],
      highlightedIngredients: [
        { name: "Palmolein Oil", type: "Oil", note: "Deep frying oil, high in saturated fat" },
        { name: "Flavor Enhancers (627, 631)", type: "Additive", note: "Flavor boosters" }
      ],
      allergens: ["May contain milk, soy, and wheat"],
      ingredientComplexity: "Complex",
      versionDate: "2024-03-01",
      nutrition: makeNutrition(168, 2.7, 10.2, 4.6, 17.1, 0.6, 0.9, 1.9, 290),
      bodyImpact: computeBodyImpact(makeNutrition(168, 2.7, 10.2, 4.6, 17.1, 0.6, 0.9, 1.9, 290), "High"),
    }],
    prices: [
      { store: "Kirana Shop", country: "India", price: 20, currency: "INR", dateObserved: "2024-01-01", unitPrice: 0.22, unitPriceLabel: "₹/g" },
      { store: "BigBasket", country: "India", price: 20, currency: "INR", dateObserved: "2025-02-15", unitPrice: 0.24, unitPriceLabel: "₹/g" }
    ],
    packSizeChanges: [{
      date: "2024-09-15", oldSize: "90g", newSize: "82g", percentChange: -8.9, country: "India",
      notes: "₹20 pack size reduced by 8g."
    }],
    formulaChanges: [],
    submissions: [],
    confirmations: [],
    countryComparisons: []
  },
  {
    id: "haldirams-bhujia-sev",
    name: "Haldiram's Bhujia Sev",
    brand: "Haldiram's",
    barcode: "8904063200171",
    category: "snacks",
    manufacturer: "Haldiram Snacks Pvt. Ltd.",
    baseDescription: "Crispy fried tepary bean and gram flour noodles spiced with Indian condiments.",
    imageUrl: "https://placehold.co/400x400/fffbeb/d97706?text=Haldirams+Bhujia",
    trustScore: 86,
    trustLevel: "Community verified",
    badges: ["High sodium", "Calorie dense", "Highly processed"],
    versions: [{
      id: "haldiram-bhujia-v1",
      country: "India",
      packSize: "150g",
      unit: "g",
      servingSize: "25g",
      servingsPerPack: 6,
      ingredientsText: "Tepary Beans Flour (Moth Flour) (38%), Edible Vegetable Oil (Cotton Seed, Corn & Palmolein Oil), Gram Flour (Besan) (13%), Iodised Salt, Mixed Spices (Mace, Ginger, Black Pepper, Cardamom, Nutmeg, Clove).",
      simplifiedIngredients: ["Moth bean flour", "Cottonseed/Palmolein/Corn oil", "Gram flour (Besan)", "Salt", "Indian spices (mace, black pepper, nutmeg)"],
      highlightedIngredients: [
        { name: "Edible Vegetable Oil", type: "Frying oil", note: "Uses cottonseed and palmolein oil blend" },
        { name: "Iodised Salt", type: "Sodium", note: "High concentration for flavor preservation" }
      ],
      allergens: [],
      ingredientComplexity: "Simple",
      versionDate: "2024-05-01",
      nutrition: makeNutrition(145, 6, 10.5, 3.2, 9.8, 0.2, 1.2, 2.8, 220),
      bodyImpact: computeBodyImpact(makeNutrition(145, 6, 10.5, 3.2, 9.8, 0.2, 1.2, 2.8, 220), "High"),
    }],
    prices: [
      { store: "D-Mart", country: "India", price: 35, currency: "INR", dateObserved: "2024-02-10", unitPrice: 0.23, unitPriceLabel: "₹/g" }
    ],
    packSizeChanges: [],
    formulaChanges: [],
    submissions: [],
    confirmations: [],
    countryComparisons: []
  },
  {
    id: "amul-kool-kesar",
    name: "Amul Kool Kesar Flavoured Milk",
    brand: "Amul",
    barcode: "8901262150033",
    category: "dairy",
    manufacturer: "Gujarat Cooperative Milk Marketing Federation (GCMMF)",
    baseDescription: "Sterilized kesar (saffron) flavoured double toned milk.",
    imageUrl: "https://placehold.co/400x400/fffbeb/d97706?text=Amul+Kool",
    trustScore: 92,
    trustLevel: "Verified",
    badges: ["High sugar", "Staple candidate"],
    versions: [{
      id: "amulkool-in-v1",
      country: "India",
      packSize: "200ml bottle",
      unit: "ml",
      servingSize: "200ml",
      servingsPerPack: 1,
      ingredientsText: "Double Toned Milk, Sugar, Saffron Extract, Permitted Stabilizer (Carrageenan), Added Flavours, Color.",
      simplifiedIngredients: ["Double toned milk", "Sugar", "Saffron extract", "Stabilizer", "Color"],
      highlightedIngredients: [
        { name: "Sugar", type: "Sweetener", note: "Contains added refined sugar for taste" },
        { name: "Carrageenan", type: "Thickener", note: "Used for thick mouthfeel in milk drinks" }
      ],
      allergens: ["Milk"],
      ingredientComplexity: "Simple",
      versionDate: "2024-06-01",
      nutrition: makeNutrition(162, 1, 3.0, 1.9, 27.6, 21.0, 0, 6.2, 90),
      bodyImpact: computeBodyImpact(makeNutrition(162, 1, 3.0, 1.9, 27.6, 21.0, 0, 6.2, 90), "Moderate"),
    }],
    prices: [
      { store: "Amul Parlour", country: "India", price: 22, currency: "INR", dateObserved: "2023-01-01", unitPrice: 0.11, unitPriceLabel: "₹/ml" },
      { store: "Amul Parlour", country: "India", price: 25, currency: "INR", dateObserved: "2025-01-01", unitPrice: 0.13, unitPriceLabel: "₹/ml" }
    ],
    packSizeChanges: [],
    formulaChanges: [],
    submissions: [],
    confirmations: [],
    countryComparisons: []
  },
  {
    id: "epigamia-mango-greek-yogurt",
    name: "Epigamia Mango Greek Yogurt",
    brand: "Epigamia",
    barcode: "8906071530185",
    category: "dairy",
    manufacturer: "Drums Food International Pvt. Ltd.",
    baseDescription: "Strained Greek yogurt made with real Alphonso mangoes.",
    imageUrl: "https://placehold.co/400x400/fffbeb/d97706?text=Epigamia+Mango",
    trustScore: 88,
    trustLevel: "Verified",
    badges: ["High protein", "Low fat"],
    versions: [{
      id: "epigamia-mango-v1",
      country: "India",
      packSize: "90g",
      unit: "g",
      servingSize: "90g",
      servingsPerPack: 1,
      ingredientsText: "Strained Yogurt (Pasteurized Double Toned Milk, Active Live Cultures), Mango Prep (Mango Pulp, Sugar, Water, Pectin, Lemon Juice Concentrate, Natural Color & Flavor).",
      simplifiedIngredients: ["Strained double toned milk", "Mango pulp", "Sugar", "Live cultures", "Pectin"],
      highlightedIngredients: [
        { name: "Mango Pulp", type: "Fruit ingredient", note: "Alphonso mango pulp" },
        { name: "Sugar", type: "Sweetener", note: "Added for sweetness in fruit prep" }
      ],
      allergens: ["Milk"],
      ingredientComplexity: "Simple",
      versionDate: "2024-08-01",
      nutrition: makeNutrition(94, 1, 1.8, 1.1, 13.5, 9.2, 0.4, 6.0, 42),
      bodyImpact: computeBodyImpact(makeNutrition(94, 1, 1.8, 1.1, 13.5, 9.2, 0.4, 6.0, 42), "Low"),
    }],
    prices: [
      { store: "Swiggy Instamart", country: "India", price: 45, currency: "INR", dateObserved: "2025-01-10", unitPrice: 0.50, unitPriceLabel: "₹/g" }
    ],
    packSizeChanges: [{
      date: "2024-10-01", oldSize: "100g", newSize: "90g", percentChange: -10.0, country: "India",
      notes: "Mango Greek Yogurt cup reduced from 100g to 90g while maintaining price."
    }],
    formulaChanges: [],
    submissions: [],
    confirmations: [],
    countryComparisons: []
  },
  {
    id: "thums-up-can",
    name: "Thums Up Cola",
    brand: "Thums Up",
    barcode: "8901764032200",
    category: "drinks",
    manufacturer: "Coca-Cola India Pvt. Ltd.",
    baseDescription: "Strong carbonated spicy cola drink with a thundering taste.",
    imageUrl: "https://placehold.co/400x400/eef3ff/1a5bdb?text=Thums+Up",
    trustScore: 95,
    trustLevel: "Verified",
    badges: ["High sugar", "Calorie dense"],
    versions: [{
      id: "thumsup-in-v1",
      country: "India",
      packSize: "300ml can",
      unit: "ml",
      servingSize: "300ml",
      servingsPerPack: 1,
      ingredientsText: "Carbonated Water, Sugar, Acidity Regulators (Phosphoric Acid), Caffeine, Color (Caramel IV), Flavours.",
      simplifiedIngredients: ["Carbonated water", "Sugar", "Caramel color", "Phosphoric acid", "Caffeine"],
      highlightedIngredients: [
        { name: "Sugar", type: "Sweetener", note: "Primary calorie source, 33g per can" },
        { name: "Caffeine", type: "Stimulant", note: "Stronger caffeine kick than typical colas" }
      ],
      allergens: [],
      ingredientComplexity: "Simple",
      versionDate: "2024-01-01",
      nutrition: makeNutrition(120, 1, 0, 0, 30, 30, 0, 0, 36),
      bodyImpact: computeBodyImpact(makeNutrition(120, 1, 0, 0, 30, 30, 0, 0, 36), "Low"),
    }],
    prices: [
      { store: "Supermarket", country: "India", price: 35, currency: "INR", dateObserved: "2023-05-01", unitPrice: 0.12, unitPriceLabel: "₹/ml" },
      { store: "Zepto", country: "India", price: 40, currency: "INR", dateObserved: "2025-02-01", unitPrice: 0.13, unitPriceLabel: "₹/ml" }
    ],
    packSizeChanges: [],
    formulaChanges: [],
    submissions: [],
    confirmations: [],
    countryComparisons: []
  },
  {
    id: "bournvita-chocolate",
    name: "Cadbury Bournvita Chocolate Health Drink",
    brand: "Bournvita",
    barcode: "8901233014722",
    category: "drinks",
    manufacturer: "Mondelez India Foods Pvt. Ltd.",
    baseDescription: "Cereal-based chocolate nutrition mix drink powder.",
    imageUrl: "https://placehold.co/400x400/fffbeb/d97706?text=Bournvita",
    trustScore: 82,
    trustLevel: "Community verified",
    badges: ["High sugar", "Formula changed"],
    versions: [{
      id: "bournvita-in-v2",
      country: "India",
      packSize: "500g",
      unit: "g",
      servingSize: "20g",
      servingsPerPack: 25,
      ingredientsText: "Cereal Extract (Malted Barley, Wheat), Sugar, Cocoa Powder, Milk Solids, Liquid Glucose, Emulsifiers, Raising Agents, Vitamins, Minerals, Salt.",
      simplifiedIngredients: ["Malted barley & wheat extract", "Sugar", "Cocoa powder", "Milk solids", "Liquid glucose", "Vitamins & Minerals"],
      highlightedIngredients: [
        { name: "Sugar", type: "Sweetener", note: "Second ingredient; high added sugar content" },
        { name: "Liquid Glucose", type: "Sweetener", note: "Additional rapid-absorption sugar source" }
      ],
      allergens: ["Wheat", "Barley", "Milk", "Soya"],
      ingredientComplexity: "Moderate",
      formulaNotes: "Reduced total added sugar percentage by ~15% in late 2023 following public ingredient scrutiny in India.",
      versionDate: "2024-03-10",
      nutrition: makeNutrition(76, 25, 0.4, 0.2, 17.0, 6.4, 0.5, 1.4, 38, { addedSugar: 4.8 }),
      bodyImpact: computeBodyImpact(makeNutrition(76, 25, 0.4, 0.2, 17.0, 6.4, 0.5, 1.4, 38), "Moderate"),
    }],
    prices: [
      { store: "Local Chemist", country: "India", price: 230, currency: "INR", dateObserved: "2023-01-01", unitPrice: 0.46, unitPriceLabel: "₹/g" },
      { store: "BigBasket", country: "India", price: 248, currency: "INR", dateObserved: "2025-02-01", unitPrice: 0.50, unitPriceLabel: "₹/g" }
    ],
    packSizeChanges: [{
      date: "2024-07-01", oldSize: "500g", newSize: "450g", percentChange: -10.0, country: "India",
      notes: "Slight shrinkflation down to 450g bottle reported in mid-2024."
    }],
    formulaChanges: [{
      date: "2023-11-15", country: "India",
      added: [],
      removed: [],
      summary: "Reformulated to reduce total added sugar. Added cocoa portion slightly increased.",
      oldIngredients: "Sugar, Cereal Extract, Cocoa, Liquid Glucose...",
      newIngredients: "Cereal Extract, Sugar, Cocoa Powder, Liquid Glucose..."
    }],
    submissions: [],
    confirmations: [],
    countryComparisons: []
  },
  {
    id: "fortune-mustard-oil",
    name: "Fortune Kachi Ghani Mustard Oil",
    brand: "Fortune",
    barcode: "8906007282836",
    category: "household", // Treat under staples/household context
    manufacturer: "Adani Wilmar Ltd.",
    baseDescription: "Pure cold-pressed mustard oil, high in monounsaturates.",
    imageUrl: "https://placehold.co/400x400/fffbeb/d97706?text=Mustard+Oil",
    trustScore: 93,
    trustLevel: "Verified",
    badges: ["100% Pure", "Cold pressed"],
    versions: [{
      id: "fortune-oil-v1",
      country: "India",
      packSize: "1 L pouch",
      unit: "l",
      servingSize: "10g",
      servingsPerPack: 91,
      ingredientsText: "Mustard Oil, Vitamin A, Vitamin D.",
      simplifiedIngredients: ["Pure mustard oil", "Vitamin A & D fortification"],
      highlightedIngredients: [],
      allergens: [],
      ingredientComplexity: "Simple",
      versionDate: "2024-01-01",
      nutrition: makeNutrition(90, 91, 10.0, 0.6, 0, 0, 0, 0, 0, { dv: { vitaminA: 25 } }),
      bodyImpact: {
        energyDensityLabel: "High",
        satietyLabel: "Less filling",
        sugarFlag: "Low",
        sodiumFlag: "Low",
        saturatedFatFlag: "Low",
        processingFlag: "Low",
        proteinFlag: "Low",
        fiberFlag: "Low",
        balanceLabel: "Moderately balanced",
        occasionLabel: "Better staple candidate",
        summaryText: "Cold-pressed edible oil fortified with vitamins A and D. Pure fat source suitable for routine cooking usage. May contribute to higher calorie intake if used in large quantities.",
        disclaimerText: "Edible oil nutrition profile. Educational only."
      }
    }],
    prices: [
      { store: "D-Mart", country: "India", price: 145, currency: "INR", dateObserved: "2024-03-01", unitPrice: 0.145, unitPriceLabel: "₹/ml" },
      { store: "Reliance Smart", country: "India", price: 165, currency: "INR", dateObserved: "2025-02-15", unitPrice: 0.165, unitPriceLabel: "₹/ml" }
    ],
    packSizeChanges: [],
    formulaChanges: [],
    submissions: [],
    confirmations: [],
    countryComparisons: []
  },
  {
    id: "dettol-liquid-handwash",
    name: "Dettol Liquid Handwash Soap",
    brand: "Dettol",
    barcode: "8901396324522",
    category: "toiletries",
    manufacturer: "Reckitt Benckiser India Pvt. Ltd.",
    baseDescription: "Antibacterial pH-balanced liquid handwash.",
    imageUrl: "https://placehold.co/400x400/fff1f2/ef4444?text=Dettol+Soap",
    trustScore: 85,
    trustLevel: "Verified",
    badges: ["Antibacterial", "Skimpflation"],
    versions: [{
      id: "dettol-soap-v1",
      country: "India",
      packSize: "175ml refill",
      unit: "ml",
      servingSize: "N/A",
      servingsPerPack: 1,
      ingredientsText: "Aqua, Ammonium Lauryl Sulfate, Sodium Laureth Sulfate, Glycol Distearate, Sodium Chloride, Cocamidopropyl Betaine, Salicylic Acid, Glycerin, Parfum, Citric Acid, Chloroxylenol (active disinfectant).",
      simplifiedIngredients: ["Water", "Surfactant cleansers", "Glycerin", "Active antiseptic (Chloroxylenol)", "Salicylic acid"],
      highlightedIngredients: [
        { name: "Chloroxylenol", type: "Antiseptic", note: "Active germ killer ingredient" },
        { name: "Salicylic Acid", type: "Beta-hydroxy acid", note: "Skin conditioning & preservative" }
      ],
      allergens: [],
      ingredientComplexity: "Moderate",
      versionDate: "2024-04-01",
      nutrition: makeNutrition(0, 1, 0, 0, 0, 0, 0, 0, 0),
      bodyImpact: {
        energyDensityLabel: "Low",
        satietyLabel: "Moderately filling",
        sugarFlag: "Low",
        sodiumFlag: "Low",
        saturatedFatFlag: "Low",
        processingFlag: "High",
        proteinFlag: "Low",
        fiberFlag: "Low",
        balanceLabel: "Moderately balanced",
        occasionLabel: "Moderate frequency",
        summaryText: "Personal hygiene cleansing product — not for consumption. Keep out of reach of children. Salicylic acid and antiseptic components may trigger sensitivity in extremely dry skin.",
        disclaimerText: "Cosmetic/hygiene safety information. Not medical advice."
      }
    }],
    prices: [
      { store: "Chemist Shop", country: "India", price: 32, currency: "INR", dateObserved: "2023-02-15", unitPrice: 0.16, unitPriceLabel: "₹/ml" },
      { store: "Chemist Shop", country: "India", price: 35, currency: "INR", dateObserved: "2025-01-10", unitPrice: 0.20, unitPriceLabel: "₹/ml" }
    ],
    packSizeChanges: [{
      date: "2024-03-01", oldSize: "200ml", newSize: "175ml", percentChange: -12.5, country: "India",
      notes: "Standard refill pack volume reduced from 200ml to 175ml at the same ₹35 price."
    }],
    formulaChanges: [],
    submissions: [],
    confirmations: [],
    countryComparisons: []
  },
  {
    id: "clinic-plus-shampoo",
    name: "Clinic Plus Strong & Long Shampoo",
    brand: "Clinic Plus",
    barcode: "8901030753442",
    category: "toiletries",
    manufacturer: "Hindustan Unilever Ltd. (HUL)",
    baseDescription: "Daily nourishing shampoo formulated with milk protein.",
    imageUrl: "https://placehold.co/400x400/eef3ff/1a5bdb?text=Clinic+Plus",
    trustScore: 84,
    trustLevel: "Verified",
    badges: ["Milk Protein", "Skimpflation"],
    versions: [{
      id: "clinicplus-sh-v1",
      country: "India",
      packSize: "340ml bottle",
      unit: "ml",
      servingSize: "N/A",
      servingsPerPack: 1,
      ingredientsText: "Water, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Sodium Chloride, Dimethiconol, Hydrolyzed Milk Protein, Carbomer, Lysine HCl, Guar Hydroxypropyltrimonium Chloride, Citric Acid, Sodium Hydroxide.",
      simplifiedIngredients: ["Water", "Sulfate surfactant", "Foam booster", "Dimethicone silicone", "Hydrolyzed milk protein"],
      highlightedIngredients: [
        { name: "Sodium Laureth Sulfate", type: "Surfactant", note: "Sulfate-based deep cleanser" },
        { name: "Hydrolyzed Milk Protein", type: "Protein", note: "Nourishes and strengthens hair shafts" }
      ],
      allergens: [],
      ingredientComplexity: "Moderate",
      versionDate: "2024-02-01",
      nutrition: makeNutrition(0, 1, 0, 0, 0, 0, 0, 0, 0),
      bodyImpact: {
        energyDensityLabel: "Low",
        satietyLabel: "Moderately filling",
        sugarFlag: "Low",
        sodiumFlag: "Low",
        saturatedFatFlag: "Low",
        processingFlag: "High",
        proteinFlag: "Low",
        fiberFlag: "Low",
        balanceLabel: "Moderately balanced",
        occasionLabel: "Moderate frequency",
        summaryText: "Personal care shampoo formulation. Not food. SLES and silicones are standard cleansing and softening agents in mass shampoo brands. Perform patch tests for scalp allergy concern.",
        disclaimerText: "Cosmetic product details only. Educational summary."
      }
    }],
    prices: [
      { store: "Supermarket", country: "India", price: 180, currency: "INR", dateObserved: "2023-04-01", unitPrice: 0.50, unitPriceLabel: "₹/ml" },
      { store: "Reliance Smart", country: "India", price: 210, currency: "INR", dateObserved: "2025-01-15", unitPrice: 0.62, unitPriceLabel: "₹/ml" }
    ],
    packSizeChanges: [{
      date: "2024-06-01", oldSize: "355ml", newSize: "340ml", percentChange: -4.2, country: "India",
      notes: "Bottle size reduced from 355ml to 340ml."
    }],
    formulaChanges: [],
    submissions: [],
    confirmations: [],
    countryComparisons: []
  },
  {
    id: "surf-excel-easy-wash",
    name: "Surf Excel Easy Wash Detergent",
    brand: "Surf Excel",
    barcode: "8901030976131",
    category: "household",
    manufacturer: "Hindustan Unilever Ltd. (HUL)",
    baseDescription: "Stain-removing laundry powder for bucket washing.",
    imageUrl: "https://placehold.co/400x400/eef3ff/1a5bdb?text=Surf+Excel",
    trustScore: 81,
    trustLevel: "Community verified",
    badges: ["Stain remover", "Price up"],
    versions: [{
      id: "surfexcel-det-v1",
      country: "India",
      packSize: "1 kg",
      unit: "kg",
      servingSize: "N/A",
      servingsPerPack: 1,
      ingredientsText: "Sodium Carbonate, Linear Alkylbenzene Sulfonate, Sodium Tripolyphosphate, Zeolite, Sodium Sulfate, Optical Brighteners, Enzymes, Perfume.",
      simplifiedIngredients: ["Soda ash", "Active surfactant", "Water softener phosphates", "Optical fabric brighteners", "Enzymes"],
      highlightedIngredients: [
        { name: "Linear Alkylbenzene Sulfonate", type: "Surfactant", note: "Primary grease-removing agent" },
        { name: "Sodium Tripolyphosphate", type: "Builder", note: "Water softener that helps wash performance" }
      ],
      allergens: [],
      ingredientComplexity: "Complex",
      versionDate: "2024-05-15",
      nutrition: makeNutrition(0, 1, 0, 0, 0, 0, 0, 0, 0),
      bodyImpact: {
        energyDensityLabel: "Low",
        satietyLabel: "Moderately filling",
        sugarFlag: "Low",
        sodiumFlag: "Low",
        saturatedFatFlag: "Low",
        processingFlag: "High",
        proteinFlag: "Low",
        fiberFlag: "Low",
        balanceLabel: "Moderately balanced",
        occasionLabel: "Moderate frequency",
        summaryText: "Household detergent powder. Toxic if ingested. Keep sealed and dry. In case of skin sensitivity, wear protective gloves during bucket wash.",
        disclaimerText: "Household product information. Do not eat."
      }
    }],
    prices: [
      { store: "Local Kirana", country: "India", price: 130, currency: "INR", dateObserved: "2023-01-01", unitPrice: 130.0, unitPriceLabel: "₹/kg" },
      { store: "BigBasket", country: "India", price: 148, currency: "INR", dateObserved: "2025-02-01", unitPrice: 148.0, unitPriceLabel: "₹/kg" }
    ],
    packSizeChanges: [],
    formulaChanges: [],
    submissions: [],
    confirmations: [],
    countryComparisons: []
  },
  {
    id: "pedigree-dog-food",
    name: "Pedigree Adult Chicken & Vegetables",
    brand: "Pedigree",
    barcode: "8906002482323",
    category: "pet-food",
    manufacturer: "Mars International India Pvt. Ltd.",
    baseDescription: "Dry kibble dog food providing nutritional balance for adult dogs.",
    imageUrl: "https://placehold.co/400x400/fffbeb/d97706?text=Pedigree+Adult",
    trustScore: 87,
    trustLevel: "Verified",
    badges: ["20% Protein", "Verified"],
    versions: [{
      id: "pedigree-in-v1",
      country: "India",
      packSize: "1.2 kg",
      unit: "kg",
      servingSize: "100g",
      servingsPerPack: 12,
      ingredientsText: "Cereals and Cereal By-products, Chicken and Chicken by-products, Meat and Meat by-products, Soybean Meal, Vegetable Oil, Iodised Salt, Vitamins, Minerals, Permitted Preservatives and Flavours.",
      simplifiedIngredients: ["Cereal grains", "Chicken & meat by-products", "Soybean meal", "Vegetable oil", "Fortified minerals"],
      highlightedIngredients: [
        { name: "Cereal By-products", type: "Grain filler", note: "Primary filler ingredient" },
        { name: "Chicken by-products", type: "Protein", note: "Rendered poultry tissue/organs for protein content" }
      ],
      allergens: [],
      ingredientComplexity: "Moderate",
      versionDate: "2024-03-01",
      nutrition: makeNutrition(350, 12, 10.0, 3.5, 45.0, 2.5, 5.0, 20.0, 380),
      bodyImpact: {
        energyDensityLabel: "High",
        satietyLabel: "More filling",
        sugarFlag: "Low",
        sodiumFlag: "Moderate",
        saturatedFatFlag: "Moderate",
        processingFlag: "High",
        proteinFlag: "High",
        fiberFlag: "High",
        balanceLabel: "More balanced",
        occasionLabel: "Better staple candidate",
        summaryText: "Packaged dry dog food formulation. High protein and fiber profile tailored specifically for adult dog nutrition requirements. Not human food.",
        disclaimerText: "Pet care product only. Consult a veterinarian."
      }
    }],
    prices: [
      { store: "Pet Shop", country: "India", price: 340, currency: "INR", dateObserved: "2024-01-01", unitPrice: 283.3, unitPriceLabel: "₹/kg" },
      { store: "Blinkit", country: "India", price: 380, currency: "INR", dateObserved: "2025-02-10", unitPrice: 316.6, unitPriceLabel: "₹/kg" }
    ],
    packSizeChanges: [{
      date: "2024-08-01", oldSize: "1.3 kg", newSize: "1.2 kg", percentChange: -7.7, country: "India",
      notes: "Bag weight reduced from 1.3 kg to 1.2 kg while shelf price increased from ₹360 to ₹380."
    }],
    formulaChanges: [],
    submissions: [],
    confirmations: [],
    countryComparisons: []
  },
  {
    id: "tata-salt-iodized",
    name: "Tata Salt Iodized",
    brand: "Tata Salt",
    barcode: "8901058895032",
    category: "household", // Treat under staples/household context
    manufacturer: "Tata Consumer Products Ltd.",
    baseDescription: "Vacuum evaporated iodized salt, Desh Ka Namak.",
    imageUrl: "https://placehold.co/400x400/eef3ff/1a5bdb?text=Tata+Salt",
    trustScore: 97,
    trustLevel: "Verified",
    badges: ["Iodized", "Vacuum Evaporated"],
    versions: [{
      id: "tatasalt-in-v1",
      country: "India",
      packSize: "1 kg",
      unit: "kg",
      servingSize: "1g",
      servingsPerPack: 1000,
      ingredientsText: "Edible Common Salt, Potassium Iodate, Anticaking Agent (551).",
      simplifiedIngredients: ["Evaporated salt", "Iodine (Potassium iodate)", "Anti-caking agent"],
      highlightedIngredients: [
        { name: "Anticaking Agent (551)", type: "Additive", note: "Silicon dioxide added to prevent clumping in humid Indian weather" }
      ],
      allergens: [],
      ingredientComplexity: "Simple",
      versionDate: "2024-01-01",
      nutrition: makeNutrition(0, 1000, 0, 0, 0, 0, 0, 0, 387),
      bodyImpact: {
        energyDensityLabel: "Low",
        satietyLabel: "Less filling",
        sugarFlag: "Low",
        sodiumFlag: "High",
        saturatedFatFlag: "Low",
        processingFlag: "Low",
        proteinFlag: "Low",
        fiberFlag: "Low",
        balanceLabel: "Less balanced",
        occasionLabel: "Better occasional treat",
        summaryText: "Pure vacuum evaporated table salt with iodine fortification. Extremely high sodium density per gram. May be relatively high in sodium, worth checking intake guidelines.",
        disclaimerText: "Pure salt mineral source. Use in cooking moderation."
      }
    }],
    prices: [
      { store: "Kirana", country: "India", price: 24, currency: "INR", dateObserved: "2023-01-01", unitPrice: 24.0, unitPriceLabel: "₹/kg" },
      { store: "Kirana", country: "India", price: 28, currency: "INR", dateObserved: "2025-01-01", unitPrice: 28.0, unitPriceLabel: "₹/kg" }
    ],
    packSizeChanges: [],
    formulaChanges: [],
    submissions: [],
    confirmations: [],
    countryComparisons: []
  },
  {
    id: "eno-fruit-salt",
    name: "Eno Fruit Salt Regular",
    brand: "Eno",
    barcode: "8901571008005",
    category: "otc-health",
    manufacturer: "Haleon (GlaxoSmithKline Consumer Healthcare)",
    baseDescription: "Fast-acting Ayurvedic antacid for quick relief from acidity.",
    imageUrl: "https://placehold.co/400x400/eef3ff/1a5bdb?text=Eno+Regular",
    trustScore: 90,
    trustLevel: "Verified",
    badges: ["OTC wellness", "Ayurvedic proprietary", "Fast relief"],
    versions: [{
      id: "eno-in-v1",
      country: "India",
      packSize: "5g sachet",
      unit: "sachets",
      servingSize: "5g (1 sachet)",
      servingsPerPack: 1,
      ingredientsText: "Svarjiksara (Sudha) (Sodium Bicarbonate) (2.91g), Nimbukamlam (Shushka) (Anhydrous Citric Acid) (2.04g). No added sugars or flavors.",
      simplifiedIngredients: ["Sodium bicarbonate (Svarjiksara)", "Citric acid (Nimbukamlam)"],
      highlightedIngredients: [
        { name: "Svarjiksara", type: "Active ingredient", note: "Antacid that neutralizes stomach acid" },
        { name: "Sodium", type: "Mineral", note: "Sachet contains ~0.8g sodium, caution for low-salt diets" }
      ],
      allergens: [],
      ingredientComplexity: "Simple",
      versionDate: "2024-01-01",
      nutrition: makeNutrition(0, 1, 0, 0, 0, 0, 0, 0, 800),
      bodyImpact: {
        energyDensityLabel: "Low",
        satietyLabel: "Moderately filling",
        sugarFlag: "Low",
        sodiumFlag: "High",
        saturatedFatFlag: "Low",
        processingFlag: "Moderate",
        proteinFlag: "Low",
        fiberFlag: "Low",
        balanceLabel: "Moderately balanced",
        occasionLabel: "Better occasional treat",
        summaryText: "OTC Ayurvedic proprietary remedy. Not food. Indicated for temporary relief of heartburn and acidity. May be relatively high in sodium, which is important for individuals tracking daily sodium levels.",
        disclaimerText: "Medicinal product. Read sachet warnings. Do not exceed daily recommended doses."
      }
    }],
    prices: [
      { store: "Chemist", country: "India", price: 8, currency: "INR", dateObserved: "2023-01-01", unitPrice: 8.0, unitPriceLabel: "₹/sachet" },
      { store: "Chemist", country: "India", price: 9, currency: "INR", dateObserved: "2025-01-01", unitPrice: 9.0, unitPriceLabel: "₹/sachet" }
    ],
    packSizeChanges: [],
    formulaChanges: [],
    submissions: [],
    confirmations: [],
    countryComparisons: []
  }
];

// Recompute trust levels
productsRaw.forEach((p) => {
  p.trustLevel = trustLabel(p.trustScore);
});

export const products: Product[] = productsRaw;

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductByBarcode(barcode: string): Product | undefined {
  const clean = barcode.replace(/\D/g, "");
  return products.find((p) => p.barcode.replace(/\D/g, "") === clean);
}

export function getLatestVersion(product: Product): ProductVersion {
  const version = product.versions.at(-1);
  if (!version) throw new Error(`Product ${product.id} has no versions`);
  return version;
}

export function searchProducts(query: string, filters?: {
  country?: string;
  category?: string;
  nutritionFlag?: string;
  changeType?: string;
  brand?: string;
  minTrustScore?: number;
}): Product[] {
  const q = query.toLowerCase().trim();
  let results = products;

  if (q) {
    results = results.filter((p) => {
      const v = getLatestVersion(p);
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.barcode.includes(q) ||
        p.category.toLowerCase().includes(q) ||
        v.ingredientsText.toLowerCase().includes(q) ||
        v.simplifiedIngredients.some((i) => i.toLowerCase().includes(q))
      );
    });
  }

  // Set default country to India if not specified or filter to India first
  if (filters?.country) {
    results = results.filter((p) => getLatestVersion(p).country === filters.country);
  }
  
  if (filters?.category) {
    results = results.filter((p) => p.category === filters.category);
  }
  if (filters?.brand) {
    results = results.filter((p) => p.brand.toLowerCase() === filters.brand!.toLowerCase());
  }
  if (filters?.nutritionFlag) {
    results = results.filter((p) => p.badges.some((b) => b.toLowerCase().includes(filters.nutritionFlag!.toLowerCase())));
  }
  if (filters?.changeType) {
    const ct = filters.changeType;
    if (ct === "shrinkflation") results = results.filter((p) => p.packSizeChanges.length > 0);
    if (ct === "formula") results = results.filter((p) => p.formulaChanges.length > 0);
    if (ct === "price") results = results.filter((p) => p.prices.length >= 2);
  }
  if (filters?.minTrustScore) {
    results = results.filter((p) => p.trustScore >= filters.minTrustScore!);
  }

  // Sort: Put India-focused results first
  return [...results].sort((a, b) => {
    const aIn = getLatestVersion(a).country === "India" ? 1 : 0;
    const bIn = getLatestVersion(b).country === "India" ? 1 : 0;
    return bIn - aIn;
  });
}

export const categories: Category[] = [
  { slug: "snacks", name: "Biscuits & Namkeen", description: "Tea-time biscuits, bhujia, chips and packaged snacks", icon: "🍪", productCount: products.filter((p) => p.category === "snacks").length },
  { slug: "instant-foods", name: "Instant Foods", description: "Maggi, cup noodles, ready-to-eat meals", icon: "🍜", productCount: products.filter((p) => p.category === "instant-foods").length },
  { slug: "dairy", name: "Dairy Drinks & Yogurt", description: "Amul milkshakes, lassi, Greek yogurts and dahi", icon: "🥛", productCount: products.filter((p) => p.category === "dairy").length },
  { slug: "drinks", name: "Soft Drinks & Juices", description: "Thums Up, sodas, energy and health drinks", icon: "🥤", productCount: products.filter((p) => p.category === "drinks").length },
  { slug: "household", name: "Staples & Detergents", description: "Fortune edible oils, Surf Excel, Tata salt", icon: "🧺", productCount: products.filter((p) => p.category === "household").length },
  { slug: "toiletries", name: "Soaps & Shampoo", description: "Dettol handwash, Clinic Plus shampoo, personal care", icon: "🧴", productCount: products.filter((p) => p.category === "toiletries").length },
  { slug: "pet-food", name: "Pet Food", description: "Pedigree dog food and pet care feeds", icon: "🐾", productCount: products.filter((p) => p.category === "pet-food").length },
  { slug: "otc-health", name: "OTC Wellness Products", description: "Eno, Chyawanprash, wellness packages", icon: "💊", productCount: products.filter((p) => p.category === "otc-health").length }
];

export const changeFeed: ChangeFeedItem[] = [
  { id: "cf1", type: "shrinkflation", productId: "maggi-masala-noodles", productName: "Maggi 2-Minute Masala Noodles", brand: "Maggi", country: "India", date: "2024-05-10", summary: "Pack size reduced from 75g to 70g (-6.7%) at ₹14", trustScore: 94 },
  { id: "cf2", type: "shrinkflation", productId: "good-day-butter-cookies", productName: "Britannia Good Day Butter Cookies", brand: "Britannia", country: "India", date: "2024-08-01", summary: "₹10 pack size reduced from 72g to 66g (-8.3%)", trustScore: 91 },
  { id: "cf3", type: "shrinkflation", productId: "kurkure-masala-munch", productName: "Kurkure Masala Munch", brand: "Kurkure", country: "India", date: "2024-09-15", summary: "₹20 pack size reduced from 90g to 82g (-8.9%)", trustScore: 89 },
  { id: "cf4", type: "shrinkflation", productId: "epigamia-mango-greek-yogurt", productName: "Epigamia Mango Greek Yogurt", brand: "Epigamia", country: "India", date: "2024-10-01", summary: "Mango Greek Yogurt cup reduced from 100g to 90g (-10%)", trustScore: 88 },
  { id: "cf5", type: "formula", productId: "bournvita-chocolate", productName: "Cadbury Bournvita Chocolate", brand: "Bournvita", country: "India", date: "2023-11-15", summary: "Reduced added sugar content by ~15% in formulation", trustScore: 82 },
  { id: "cf6", type: "shrinkflation", productId: "dettol-liquid-handwash", productName: "Dettol Liquid Handwash Soap", brand: "Dettol", country: "India", date: "2024-03-01", summary: "Standard refill pack volume reduced from 200ml to 175ml (-12.5%)", trustScore: 85 },
  { id: "cf7", type: "shrinkflation", productId: "clinic-plus-shampoo", productName: "Clinic Plus Strong & Long Shampoo", brand: "Clinic Plus", country: "India", date: "2024-06-01", summary: "Bottle size reduced from 355ml to 340ml (-4.2%)", trustScore: 84 },
  { id: "cf8", type: "shrinkflation", productId: "pedigree-dog-food", productName: "Pedigree Adult Chicken & Vegetables", brand: "Pedigree", country: "India", date: "2024-08-01", summary: "Dry bag size reduced from 1.3 kg to 1.2 kg (-7.7%)", trustScore: 87 },
  { id: "cf9", type: "price", productId: "surf-excel-easy-wash", productName: "Surf Excel Easy Wash Detergent", brand: "Surf Excel", country: "India", date: "2025-02-01", summary: "1 kg pack price increased from ₹130 to ₹148 (+13.8%)", trustScore: 81 },
  { id: "cf10", type: "price", productId: "amul-kool-kesar", productName: "Amul Kool Kesar Flavoured Milk", brand: "Amul", country: "India", date: "2025-01-01", summary: "Sterilized glass bottle price increased from ₹22 to ₹25 (+13.6%)", trustScore: 92 }
];

export const countries = ["India", "USA", "UK", "Canada", "Australia", "Japan"];
