import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const cachedProducts: Array<Record<string, unknown>> = [];

function loadProducts() {
  if (cachedProducts.length > 0) return;

  try {
    const dataDir = path.join(process.cwd(), "public/data");

    // Load all product pages
    for (let i = 1; i <= 5; i++) {
      const filePath = path.join(dataDir, `products_page_${i}.json`);
      if (fs.existsSync(filePath)) {
        const products = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        cachedProducts.push(...products);
      }
    }

    console.log(`[API] Loaded ${cachedProducts.length} products`);
  } catch (err) {
    console.error("[API] Error loading products:", err);
  }
}

export async function GET(request: Request) {
  loadProducts();

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const barcode = searchParams.get("barcode");
  const id = searchParams.get("id");
  const limit = parseInt(searchParams.get("limit") || "20");

  // Search by query
  if (query) {
    const q = query.toLowerCase();
    const results = cachedProducts
      .filter(
        (p) =>
          (typeof p.name === 'string' && p.name.toLowerCase().includes(q)) ||
          (typeof p.brand === 'string' && p.brand.toLowerCase().includes(q)) ||
          (typeof p.barcode === 'string' && p.barcode.includes(q))
      )
      .slice(0, limit);

    return NextResponse.json({ count: results.length, products: results });
  }

  // Search by barcode
  if (barcode) {
    const clean = barcode.replace(/\D/g, "");
    const product = cachedProducts.find((p) => p.barcode === clean);
    return NextResponse.json(product || { error: "Not found" });
  }

  // Search by ID
  if (id) {
    const product = cachedProducts.find((p) => p.id === id);
    return NextResponse.json(product || { error: "Not found" });
  }

  // Return basic stats
  return NextResponse.json({
    totalProducts: cachedProducts.length,
    status: "ok",
  });
}
