import { NextResponse } from "next/server";
import { dbGetProductByBarcode, dbSearchProducts } from "@/lib/db";
import { getProductByBarcode } from "@/lib/data/products";
import type { Product } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const country = searchParams.get("country");
  const barcode = searchParams.get("barcode");
  const q = searchParams.get("q") || "";
  const brand = searchParams.get("brand");
  const minTrustScore = searchParams.get("minTrustScore");
  const nutritionFlag = searchParams.get("nutritionFlag");
  const changeType = searchParams.get("changeType");
  const sort = searchParams.get("sort");
  const onlyChanged = searchParams.get("onlyChanged") === "true";

  let results: Product[] = [];

  if (barcode) {
    const clean = barcode.replace(/\D/g, "");
    
    // Check mock products first
    const mock = getProductByBarcode(clean);
    if (mock) {
      results = [mock];
    } else {
      const dbProd = await dbGetProductByBarcode(clean);
      if (dbProd) {
        results = [dbProd];
      }
    }
  } else {
    // Run search on database
    results = await dbSearchProducts(q, {
      category: category || undefined,
      country: country || undefined,
      brand: brand || undefined,
      minTrustScore: minTrustScore ? parseInt(minTrustScore, 10) : undefined,
      nutritionFlag: nutritionFlag || undefined,
      sort: sort || undefined,
      onlyChanged: onlyChanged || undefined,
    });
  }

  return NextResponse.json({
    count: results.length,
    products: results,
  });
}
