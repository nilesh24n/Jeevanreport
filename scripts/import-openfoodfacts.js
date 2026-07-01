const fs = require('fs');
const zlib = require('zlib');
const readline = require('readline');
const path = require('path');

const DB_PATH = path.resolve(process.cwd(), 'products.db');
const GZ_FILE_PATH = path.resolve(process.cwd(), 'openfoodfacts-products.jsonl.gz');

if (!fs.existsSync(GZ_FILE_PATH)) {
  console.error('Error: openfoodfacts-products.jsonl.gz not found in project root.');
  process.exit(1);
}

// Minimal nutrition/body impact helpers (keeps import script independent)
function computeBodyImpact(nutrition) {
  const sugar = nutrition.addedSugar ?? nutrition.sugar ?? 0;
  const sodium = nutrition.sodium ?? 0;
  const calories = nutrition.caloriesPerServing ?? 0;
  return {
    energyDensityLabel: calories > 250 ? 'High' : calories > 100 ? 'Moderate' : 'Low',
    sugarFlag: sugar >= 10 ? 'High' : sugar >= 5 ? 'Moderate' : 'Low',
    sodiumFlag: sodium >= 600 ? 'High' : sodium >= 200 ? 'Moderate' : 'Low'
  };
}

function getNutritionFlags(bodyImpact) {
  const badges = [];
  if (bodyImpact.sugarFlag === 'High') badges.push('High sugar');
  if (bodyImpact.sodiumFlag === 'High') badges.push('High sodium');
  if (bodyImpact.energyDensityLabel === 'High') badges.push('Calorie dense');
  return badges;
}

function trustLabel(score) {
  if (score >= 90) return 'Verified';
  if (score >= 75) return 'Community verified';
  return 'Unverified';
}

function mapCategory(categoriesTags) {
  if (!categoriesTags || !Array.isArray(categoriesTags)) return 'snacks';
  for (const tag of categoriesTags) {
    const t = tag.toLowerCase();
    if (t.includes('snack') || t.includes('biscuit') || t.includes('cookie') || t.includes('chip') || t.includes('confectionery') || t.includes('chocolate') || t.includes('sweet')) return 'snacks';
    if (t.includes('noodle') || t.includes('pasta') || t.includes('instant') || t.includes('meal') || t.includes('ready-to-eat')) return 'instant-foods';
    if (t.includes('dairy') || t.includes('milk') || t.includes('yogurt') || t.includes('cheese') || t.includes('butter') || t.includes('cream')) return 'dairy';
    if (t.includes('beverage') || t.includes('drink') || t.includes('soda') || t.includes('juice') || t.includes('water') || t.includes('coffee') || t.includes('tea')) return 'drinks';
    if (t.includes('pet') || t.includes('dog') || t.includes('cat') || t.includes('animal')) return 'pet-food';
    if (t.includes('supplement') || t.includes('medicine') || t.includes('health') || t.includes('vitamins') || t.includes('pharmacy')) return 'otc-health';
    if (t.includes('soap') || t.includes('shampoo') || t.includes('hygiene') || t.includes('cosmetic') || t.includes('care') || t.includes('toilet')) return 'toiletries';
  }
  return 'snacks';
}

function parseQuantity(qtyStr) {
  if (!qtyStr) return { value: 100, unit: 'g' };
  const match = qtyStr.match(/^([\d.,]+)\s*(kg|g|l|ml|oz|lbs|sachets|can|refill|pouch|bottle)?/i);
  if (!match) return { value: 100, unit: 'g' };
  const val = parseFloat(match[1].replace(',', '.'));
  const unit = (match[2] || 'g').toLowerCase();
  return { value: val, unit };
}

function extractNutrition(nutriments, scale) {
  const getVal = (key) => {
    if (!nutriments) return 0;
    if (nutriments[`${key}_serving`] !== undefined) return Number(nutriments[`${key}_serving`]);
    if (nutriments[`${key}_100g`] !== undefined) return Number(nutriments[`${key}_100g`]) * scale;
    return 0;
  };
  const calories = getVal('energy-kcal') || (getVal('energy') / 4.184) || 0;
  const fat = getVal('fat');
  const satFat = getVal('saturated-fat');
  const transFat = getVal('trans-fat');
  const carbs = getVal('carbohydrates');
  const sugar = getVal('sugars');
  const addedSugar = getVal('added-sugars') || sugar;
  const fiber = getVal('fiber');
  const protein = getVal('proteins');
  let sodiumG = 0;
  if (nutriments && nutriments['sodium_serving'] !== undefined) sodiumG = Number(nutriments['sodium_serving']);
  else if (nutriments && nutriments['sodium_100g'] !== undefined) sodiumG = Number(nutriments['sodium_100g']) * scale;
  const sodium = Math.round(sodiumG * 1000);
  const cholesterolG = getVal('cholesterol');
  const cholesterol = Math.round(cholesterolG * 1000);
  return {
    caloriesPerServing: Math.round(calories),
    caloriesPerPack: Math.round(calories),
    totalFat: Number((fat || 0).toFixed(1)),
    saturatedFat: Number((satFat || 0).toFixed(1)),
    transFat: Number((transFat || 0).toFixed(1)),
    carbs: Number((carbs || 0).toFixed(1)),
    sugar: Number((sugar || 0).toFixed(1)),
    addedSugar: Number((addedSugar || 0).toFixed(1)),
    fiber: Number((fiber || 0).toFixed(1)),
    protein: Number((protein || 0).toFixed(1)),
    sodium,
    cholesterol,
    dailyValuePercentages: {
      totalFat: Math.round(((fat || 0) / 78) * 100),
      saturatedFat: Math.round(((satFat || 0) / 20) * 100),
      sodium: Math.round((sodium / 2000) * 100),
      carbs: Math.round(((carbs || 0) / 300) * 100),
      fiber: Math.round(((fiber || 0) / 30) * 100),
      protein: Math.round(((protein || 0) / 60) * 100),
    }
  };
}

// Initialize DB
let BetterSqlite3;
try {
  BetterSqlite3 = require('better-sqlite3');
} catch (e) {
  console.error('Please install better-sqlite3: npm install better-sqlite3');
  process.exit(1);
}

const db = new BetterSqlite3(DB_PATH);

// Create table if missing
db.exec(`
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

const insertStmt = db.prepare(`INSERT OR REPLACE INTO products
  (id, name, brand, barcode, category, countries, ingredients_text, trust_score, trust_level, badges, data)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const fileStream = fs.createReadStream(GZ_FILE_PATH);
const unzipStream = zlib.createGunzip();
const rl = readline.createInterface({ input: fileStream.pipe(unzipStream), crlfDelay: Infinity });

let processedLines = 0;
let importedCount = 0;
const startTime = Date.now();

const insertMany = db.transaction((rows) => {
  for (const r of rows) insertStmt.run(r);
});

let batch = [];
const BATCH_SIZE = 5000;

rl.on('line', (line) => {
  processedLines++;
  const lineLower = line.toLowerCase();
  const matchesCountry = lineLower.includes('"india"') || lineLower.includes('"united states"') || lineLower.includes('"united kingdom"') || lineLower.includes('"canada"') || lineLower.includes('"australia"') || lineLower.includes('"japan"') || lineLower.includes('"usa"') || lineLower.includes('"uk"');
  if (!matchesCountry) return;
  if (!line.includes('"code"') || !line.includes('"product_name"')) return;
  try {
    const raw = JSON.parse(line);
    const barcode = raw.code ? String(raw.code).replace(/\D/g, '') : '';
    const name = raw.product_name || raw.product_name_en || raw.product_name_fr || '';
    if (!barcode || !name) return;
    const ingredientsText = raw.ingredients_text || raw.ingredients_text_en || '';
    const nutriments = raw.nutriments || {};
    if (!ingredientsText && Object.keys(nutriments).length <= 5) return;
    const brand = raw.brands ? String(raw.brands).split(',')[0].trim() : 'Generic';
    const category = mapCategory(raw.categories_tags || []);
    const countries = raw.countries || 'Unknown';
    const imageUrl = raw.image_front_url || raw.image_url || `https://placehold.co/400x400/fffbeb/d97706?text=${encodeURIComponent(name.slice(0,15))}`;
    const quantityStr = raw.quantity || '100g';
    const qtyParsed = parseQuantity(quantityStr);
    const servingStr = raw.serving_size || '100g';
    const servingParsed = parseQuantity(servingStr);
    const servingSizeGrams = servingParsed.value || 100;
    const packSizeGrams = qtyParsed.value || 100;
    const servingsPerPack = Math.max(1, Math.round(packSizeGrams / servingSizeGrams)) || 1;
    const scale = servingSizeGrams / 100;
    const nutrition = extractNutrition(nutriments, scale);
    nutrition.caloriesPerPack = nutrition.caloriesPerServing * servingsPerPack;
    const bodyImpact = computeBodyImpact(nutrition);
    const badges = getNutritionFlags(bodyImpact);
    let trustScore = 70;
    if (ingredientsText) trustScore += 10;
    if (raw.image_front_url) trustScore += 10;
    if (Object.keys(nutriments).length > 8) trustScore += 10;
    trustScore = Math.min(100, trustScore);
    const trustLevel = trustLabel(trustScore);
    const id = barcode;
    const version = {
      id: `${id}-v1`,
      country: countries.split(',')[0].trim(),
      packSize: quantityStr,
      unit: qtyParsed.unit,
      servingSize: servingStr,
      servingsPerPack,
      ingredientsText,
      simplifiedIngredients: ingredientsText ? String(ingredientsText).split(',').map(i => i.trim()).filter(Boolean).slice(0,8) : [],
      highlightedIngredients: [],
      allergens: raw.allergens_from_ingredients ? String(raw.allergens_from_ingredients).split(',').map(i => i.trim()).filter(Boolean) : [],
      ingredientComplexity: (ingredientsText ? String(ingredientsText).split(',').length : 0) > 15 ? 'Complex' : (ingredientsText ? String(ingredientsText).split(',').length : 0) > 5 ? 'Moderate' : 'Simple',
      versionDate: new Date().toISOString().split('T')[0],
      nutrition,
      bodyImpact
    };
    const product = {
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

    batch.push([id, name, brand, barcode, category, countries, ingredientsText, trustScore, trustLevel, JSON.stringify(badges), JSON.stringify(product)]);
    importedCount++;

    if (batch.length >= BATCH_SIZE) {
      insertMany(batch);
      batch = [];
      const elapsed = (Date.now() - startTime) / 1000;
      console.log(`Processed ${processedLines} lines. Imported ${importedCount} products... (${(importedCount / elapsed).toFixed(0)} products/sec)`);
    }
  } catch (err) {
    // ignore
  }
});

rl.on('close', () => {
  if (batch.length) insertMany(batch);
  const elapsed = (Date.now() - startTime) / 1000;
  console.log('\n--- Import Completed ---');
  console.log(`Total lines read: ${processedLines}`);
  console.log(`Total products imported: ${importedCount}`);
  console.log(`Time taken: ${elapsed.toFixed(1)} seconds`);
  try {
    const row = db.prepare('SELECT COUNT(*) as c FROM products').get();
    console.log(`Verified DB count: ${row.c}`);
  } catch (e) {
    // ignore
  }
  process.exit(0);
});
