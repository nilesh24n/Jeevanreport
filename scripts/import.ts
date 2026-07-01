import fs from "fs";
import zlib from "zlib";
import readline from "readline";
import path from "path";
import { Database } from "bun:sqlite";
import { computeBodyImpact, getNutritionFlags, trustLabel } from "../src/lib/nutrition-engine";
import type { Product, ProductVersion, NutritionFacts } from "../src/lib/types";

const GZ_FILE_PATH = path.resolve(process.cwd(), "openfoodfacts-products.jsonl.gz");
const DB_PATH = path.resolve(process.cwd(), "products.db");

console.log("Using file:", GZ_FILE_PATH);
console.log("Database path:", DB_PATH);

if (!fs.existsSync(GZ_FILE_PATH)) {
  console.error("Error: openfoodfacts-products.jsonl.gz not found!");
  process.exit(1);
}

// Initialize database
const db = new Database(DB_PATH);
db.run("PRAGMA journal_mode = WAL;");
db.run("PRAGMA synchronous = NORMAL;");

db.run(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT,
    brand TEXT,
    barcode TEXT UNIQUE,
    category TEXT,
    countries TEXT,
    ingredients_text TEXT,
    trust_score INTEGER,
    trust_level TEXT,
    badges TEXT,
    data TEXT
  )
`);

db.run("CREATE INDEX IF NOT EXISTS idx_products_barcode ON products (barcode);");
db.run("CREATE INDEX IF NOT EXISTS idx_products_name ON products (name);");
db.run("CREATE INDEX IF NOT EXISTS idx_products_brand ON products (brand);");

const insertStmt = db.prepare(`
  INSERT OR REPLACE INTO products (id, name, brand, barcode, category, countries, ingredients_text, trust_score, trust_level, badges, data)
  VALUES ($id, $name, $brand, $barcode, $category, $countries, $ingredientsText, $trustScore, $trustLevel, $badges, $data)
`);

function mapCategory(categoriesTags: string[]): string {
  if (!categoriesTags || !Array.isArray(categoriesTags)) return "snacks";
  for (const tag of categoriesTags) {
    const t = tag.toLowerCase();
    if (t.includes("snack") || t.includes("biscuit") || t.includes("cookie") || t.includes("chip") || t.includes("confectionery") || t.includes("chocolate") || t.includes("sweet")) return "snacks";
    if (t.includes("noodle") || t.includes("pasta") || t.includes("instant") || t.includes("meal") || t.includes("ready-to-eat")) return "instant-foods";
    if (t.includes("dairy") || t.includes("milk") || t.includes("yogurt") || t.includes("cheese") || t.includes("butter") || t.includes("cream")) return "dairy";
    if (t.includes("beverage") || t.includes("drink") || t.includes("soda") || t.includes("juice") || t.includes("water") || t.includes("coffee") || t.includes("tea")) return "drinks";
    if (t.includes("pet") || t.includes("dog") || t.includes("cat") || t.includes("animal")) return "pet-food";
    if (t.includes("supplement") || t.includes("medicine") || t.includes("health") || t.includes("vitamins") || t.includes("pharmacy")) return "otc-health";
    if (t.includes("soap") || t.includes("shampoo") || t.includes("hygiene") || t.includes("cosmetic") || t.includes("care") || t.includes("toilet")) return "toiletries";
  }
  return "snacks";
}

function parseQuantity(qtyStr: string): { value: number; unit: string } {
  if (!qtyStr) return { value: 100, unit: "g" };
  const match = qtyStr.match(/^([\d.,]+)\s*(kg|g|l|ml|oz|lbs|sachets|can|refill|pouch|bottle)?/i);
  if (!match) return { value: 100, unit: "g" };
  const val = parseFloat(match[1].replace(",", "."));
  const unit = (match[2] || "g").toLowerCase();
  return { value: val, unit };
}

function extractNutrition(nutriments: any, scale: number): NutritionFacts {
  const getVal = (key: string) => {
    if (nutriments[`${key}_serving`] !== undefined) {
      return Number(nutriments[`${key}_serving`]);
    }
    if (nutriments[`${key}_100g`] !== undefined) {
      return Number(nutriments[`${key}_100g`]) * scale;
    }
    return 0;
  };

  const calories = getVal("energy-kcal") || (getVal("energy") / 4.184) || 0;
  const fat = getVal("fat");
  const satFat = getVal("saturated-fat");
  const transFat = getVal("trans-fat");
  const carbs = getVal("carbohydrates");
  const sugar = getVal("sugars");
  const addedSugar = getVal("added-sugars") || sugar;
  const fiber = getVal("fiber");
  const protein = getVal("proteins");
  
  let sodiumG = 0;
  if (nutriments["sodium_serving"] !== undefined) {
    sodiumG = Number(nutriments["sodium_serving"]);
  } else if (nutriments["sodium_100g"] !== undefined) {
    sodiumG = Number(nutriments["sodium_100g"]) * scale;
  }
  const sodium = Math.round(sodiumG * 1000);

  const cholesterolG = getVal("cholesterol");
  const cholesterol = Math.round(cholesterolG * 1000);

  return {
    caloriesPerServing: Math.round(calories),
    caloriesPerPack: Math.round(calories),
    totalFat: Number(fat.toFixed(1)),
    saturatedFat: Number(satFat.toFixed(1)),
    transFat: Number(transFat.toFixed(1)),
    carbs: Number(carbs.toFixed(1)),
    sugar: Number(sugar.toFixed(1)),
    addedSugar: Number(addedSugar.toFixed(1)),
    fiber: Number(fiber.toFixed(1)),
    protein: Number(protein.toFixed(1)),
    sodium,
    cholesterol,
    dailyValuePercentages: {
      totalFat: Math.round((fat / 78) * 100),
      saturatedFat: Math.round((satFat / 20) * 100),
      sodium: Math.round((sodium / 2000) * 100),
      carbs: Math.round((carbs / 300) * 100),
      fiber: Math.round((fiber / 30) * 100),
      protein: Math.round((protein / 60) * 100),
    }
  };
}

const fileStream = fs.createReadStream(GZ_FILE_PATH);
const unzipStream = zlib.createGunzip();
const rl = readline.createInterface({
  input: fileStream.pipe(unzipStream),
  crlfDelay: Infinity
});

let processedLines = 0;
let importedCount = 0;
const startTime = Date.now();

db.run("BEGIN TRANSACTION;");

rl.on("line", (line) => {
  processedLines++;
  
  // Fast raw string check to skip products from non-target countries
  const lineLower = line.toLowerCase();
  const matchesCountry = 
    lineLower.includes('"india"') || 
    lineLower.includes('"united states"') || 
    lineLower.includes('"united kingdom"') || 
    lineLower.includes('"canada"') || 
    lineLower.includes('"australia"') || 
    lineLower.includes('"japan"') || 
    lineLower.includes('"usa"') || 
    lineLower.includes('"uk"');
    
  if (!matchesCountry) return;
  if (!line.includes('"code"') || !line.includes('"product_name"')) return;

  try {
    const raw = JSON.parse(line);
    const barcode = raw.code ? raw.code.replace(/\D/g, "") : "";
    const name = raw.product_name || raw.product_name_en || raw.product_name_fr || "";
    
    // We filter out products without barcode or name, or with no ingredients and no nutriments
    if (!barcode || !name) return;
    
    const ingredientsText = raw.ingredients_text || raw.ingredients_text_en || "";
    const nutriments = raw.nutriments || {};
    
    if (!ingredientsText && Object.keys(nutriments).length <= 5) return;
    
    const brand = raw.brands ? raw.brands.split(",")[0].trim() : "Generic";
    const category = mapCategory(raw.categories_tags || []);
    const countries = raw.countries || "Unknown";
    const imageUrl = raw.image_front_url || raw.image_url || `https://placehold.co/400x400/fffbeb/d97706?text=${encodeURIComponent(name.slice(0, 15))}`;
    
    // Parse quantity
    const quantityStr = raw.quantity || "100g";
    const qtyParsed = parseQuantity(quantityStr);
    
    // Parse serving size
    const servingStr = raw.serving_size || "100g";
    const servingParsed = parseQuantity(servingStr);
    
    const servingSizeGrams = servingParsed.value;
    const packSizeGrams = qtyParsed.value;
    const servingsPerPack = Math.max(1, Math.round(packSizeGrams / servingSizeGrams)) || 1;
    
    // Calculate scale from 100g to serving
    const scale = servingSizeGrams / 100;
    
    const nutrition = extractNutrition(nutriments, scale);
    nutrition.caloriesPerPack = nutrition.caloriesPerServing * servingsPerPack;
    
    const bodyImpact = computeBodyImpact(nutrition, "Moderate");
    const badges = getNutritionFlags(bodyImpact);
    
    // Calculate trust score
    let trustScore = 70; // base score for standard OFF product
    if (ingredientsText) trustScore += 10;
    if (raw.image_front_url) trustScore += 10;
    if (Object.keys(nutriments).length > 8) trustScore += 10;
    trustScore = Math.min(100, trustScore);
    const trustLevel = trustLabel(trustScore);
    
    const id = barcode; // We use barcode as the product ID to ensure uniqueness
    
    const version: ProductVersion = {
      id: `${id}-v1`,
      country: countries.split(",")[0].trim(),
      packSize: quantityStr,
      unit: qtyParsed.unit,
      servingSize: servingStr,
      servingsPerPack,
      ingredientsText,
      simplifiedIngredients: ingredientsText ? ingredientsText.split(",").map((i: string) => i.trim()).filter(Boolean).slice(0, 8) : [],
      highlightedIngredients: [],
      allergens: raw.allergens_from_ingredients ? raw.allergens_from_ingredients.split(",").map((i: string) => i.trim()).filter(Boolean) : [],
      ingredientComplexity: ingredientsText.split(",").length > 15 ? "Complex" : ingredientsText.split(",").length > 5 ? "Moderate" : "Simple",
      versionDate: new Date().toISOString().split("T")[0],
      nutrition,
      bodyImpact
    };

    const product: Product = {
      id,
      name,
      brand,
      barcode,
      category,
      manufacturer: raw.manufacturers || brand,
      baseDescription: raw.generic_name || `Packaged ${name} by ${brand}.`,
      imageUrl,
      trustScore,
      trustLevel,
      versions: [version],
      prices: [],
      packSizeChanges: [],
      formulaChanges: [],
      submissions: [],
      confirmations: [],
      countryComparisons: [],
      badges
    };
    
    insertStmt.run({
      $id: id,
      $name: name,
      $brand: brand,
      $barcode: barcode,
      $category: category,
      $countries: countries,
      $ingredientsText: ingredientsText,
      $trustScore: trustScore,
      $trustLevel: trustLevel,
      $badges: JSON.stringify(badges),
      $data: JSON.stringify(product)
    });
    
    importedCount++;
    
    if (importedCount % 10000 === 0) {
      db.run("COMMIT;");
      db.run("BEGIN TRANSACTION;");
      const elapsed = (Date.now() - startTime) / 1000;
      console.log(`Processed ${processedLines} lines. Imported ${importedCount} products... (${(importedCount / elapsed).toFixed(0)} products/sec)`);
    }
  } catch (err: any) {
    // Ignore individual parsing errors
  }
});

rl.on("close", () => {
  db.run("COMMIT;");
  const elapsed = (Date.now() - startTime) / 1000;
  console.log("\n--- Import Completed ---");
  console.log(`Total lines read: ${processedLines}`);
  console.log(`Total products imported: ${importedCount}`);
  console.log(`Time taken: ${elapsed.toFixed(1)} seconds`);
  console.log("Database file created successfully.");
  
  // Verify with a count
  const countRow = db.query("SELECT COUNT(*) as count FROM products").get() as { count: number };
  console.log(`Verified DB count: ${countRow.count} rows`);
  
  db.close();
});
