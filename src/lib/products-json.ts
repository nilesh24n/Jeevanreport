import type { Product } from "@/lib/types";

const cachedProducts: Product[] = [];

// Load products on startup (server-side only)
function loadProducts() {
  if (typeof window !== "undefined") return;
  if (cachedProducts.length > 0) return;

  try {
    const req = eval("require");
    const fs = req("fs");
    const path = req("path");
    const dataDir = path.join(process.cwd(), "public/data");

    // Load all product pages
    for (let i = 1; i <= 5; i++) {
      const filePath = path.join(dataDir, `products_page_${i}.json`);
      if (fs.existsSync(filePath)) {
        const rawList = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        for (const p of rawList) {
          if (!p || !p.id) continue;
          if (!p.versions || !Array.isArray(p.versions) || p.versions.length === 0) {
            p.versions = [{
              versionNumber: 1,
              versionDate: "2024-01-01",
              country: "India",
              packSize: "Standard",
              unit: "pack",
              ingredientsText: p.ingredients_text || p.ingredients || "",
              nutrition: {
                caloriesPerServing: 100,
                caloriesPerPack: 100,
                totalFat: 0,
                saturatedFat: 0,
                transFat: 0,
                carbs: 0,
                sugar: 0,
                addedSugar: 0,
                fiber: 0,
                protein: 0,
                sodium: 0,
                cholesterol: 0,
                dailyValuePercentages: {},
              },
              bodyImpact: {
                sugarFlag: "Low",
                saturatedFatFlag: "Low",
                sodiumFlag: "Low",
                proteinFlag: "Moderate",
                fiberFlag: "Low",
                processingFlag: "Moderate",
                occasionLabel: "Moderate frequency",
                balanceLabel: "Moderate balance",
                satietyLabel: "Moderately filling",
                energyDensityLabel: "Moderate",
                recommendedFrequency: "Moderate",
                frequencyReasoning: "Standard consumer product",
              },
              highlightedIngredients: [],
            }];
          }
          if (!p.prices) p.prices = [];
          if (!p.badges) p.badges = [];
          if (!p.packSizeChanges) p.packSizeChanges = [];
          if (!p.formulaChanges) p.formulaChanges = [];
          cachedProducts.push(p);
        }
      }
    }

    if (cachedProducts.length > 0) {
      console.log(`✓ Loaded ${cachedProducts.length} products from JSON`);
    }
  } catch (err) {
    console.error("Error loading products:", err);
  }
}

export function getProductByBarcode(barcode: string): Product | null {
  loadProducts();
  const clean = barcode.replace(/\D/g, "");
  return cachedProducts.find((p) => p.barcode === clean) || null;
}

export function getProductById(id: string): Product | null {
  loadProducts();
  return cachedProducts.find((p) => p.id === id) || null;
}

export function searchProducts(query: string, limit = 20): Product[] {
  loadProducts();
  const q = (query || "").toLowerCase();
  return cachedProducts
    .filter((p) => 
      (p.name || "").toLowerCase().includes(q) || 
      (p.brand || "").toLowerCase().includes(q) ||
      (p.barcode || "").includes(q)
    )
    .slice(0, limit);
}

export function getProductsByCategory(
  category: string,
  limit = 50
): Product[] {
  loadProducts();
  return cachedProducts
    .filter((p) => p.category === category)
    .slice(0, limit);
}

export function getAllProducts(): Product[] {
  loadProducts();
  return cachedProducts;
}

export function getTotalProductCount(): number {
  loadProducts();
  return cachedProducts.length;
}

export function getProductsByTrustScore(minScore: number): Product[] {
  loadProducts();
  return cachedProducts.filter((p) => (p.trustScore || 0) >= minScore);
}

export function getRandomProducts(count: number): Product[] {
  loadProducts();
  const shuffled = [...cachedProducts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
