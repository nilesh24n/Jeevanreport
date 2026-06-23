import { NextResponse } from "next/server";
import { dbGetProductById, dbGetProductByBarcode } from "@/lib/db";
import { getProductById } from "@/lib/data/products";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Check mock products first
  let product = getProductById(id);

  if (!product) {
    // Check database by ID or barcode
    product = (await dbGetProductById(id)) || (await dbGetProductByBarcode(id)) || undefined;
  }

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
