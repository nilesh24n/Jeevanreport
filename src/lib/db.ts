/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
import path from "path";
import type { Product } from "./types";
import { products, getProductById, getProductByBarcode, searchProducts } from "./data/products";
import * as jsonProducts from "./products-json";
import { fetchProductFromOpenFoodFacts } from "./openfoodfacts";
import { enrichProduct } from "./product-enricher";
import { isConsumableProduct } from "./consumable-filter";

// Turso Database client initialization (Lazy)
let tursoClient: any = null;
const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (TURSO_URL) {
  try {
    const { createClient } = require("@libsql/client");
    tursoClient = createClient({
      url: TURSO_URL,
      authToken: TURSO_TOKEN,
    });
  } catch (err) {
    console.error("Failed to initialize Turso client:", err);
  }
}

// Supabase client initialization (Lazy)
let supabaseClient: any = null;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (SUPABASE_URL && SUPABASE_KEY) {
  try {
    const { createClient } = require("@supabase/supabase-js");
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
  }
}

// Local products.db via libsql file: (no native better-sqlite3 required)
const DB_PATH = path.resolve(process.cwd(), "products.db");
let fileArchiveClient: any = null;
let fileArchiveReady = false;

/** Turso in production, or local products.db on dev machines. */
function getArchiveSqlClient(): any | null {
  if (tursoClient) return tursoClient;
  if (fileArchiveReady) return fileArchiveClient;
  if (typeof window !== "undefined") return null;
  try {
    const fs = require("fs");
    if (!fs.existsSync(DB_PATH)) return null;
    const { createClient } = require("@libsql/client");
    const fileUrl = `file:${DB_PATH.replace(/\\/g, "/")}`;
    fileArchiveClient = createClient({ url: fileUrl });
    fileArchiveReady = true;
    return fileArchiveClient;
  } catch (err) {
    console.error("Failed to open local products.db:", err);
  }
  return null;
}

export async function dbGetProductById(id: string): Promise<Product | null> {
  const p = await rawGetProductById(id);
  return enrichProduct(p);
}

async function rawGetProductById(id: string): Promise<Product | null> {
  const archive = getArchiveSqlClient();
  if (archive) {
    try {
      const result = await archive.execute({
        sql: "SELECT data FROM products WHERE id = ?",
        args: [id],
      });
      if (result.rows.length > 0) {
        const p = parseProductRowData(result.rows[0].data);
        if (p) return p;
      }
    } catch (e) {
      console.error("Archive SQL error in dbGetProductById:", e);
    }
  }

  // 2. Try Supabase
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from("products")
        .select("data")
        .eq("id", id)
        .single();
      if (!error && data?.data) {
        return (typeof data.data === "string" ? JSON.parse(data.data) : data.data) as Product;
      }
    } catch (e) {
      console.error("Supabase error in dbGetProductById:", e);
    }
  }

  // 3. Try JSON products fallback (5000+ products)
  const jsonResult = jsonProducts.getProductById(id);
  if (jsonResult) return jsonResult;

  // 5. Try Open Food Facts API (real-time global database fallback)
  const offResult = await fetchProductFromOpenFoodFacts(id);
  if (offResult) return offResult;

  // 6. Fall back to static dataset (15 products)
  return getProductById(id) || null;
}

export async function dbGetProductByBarcode(barcode: string): Promise<Product | null> {
  const p = await rawGetProductByBarcode(barcode);
  return enrichProduct(p);
}

/** EAN/UPC variants (leading zeros, id-as-barcode) for archive lookup. */
function barcodeLookupKeys(barcode: string): string[] {
  const clean = barcode.replace(/\D/g, "");
  if (!clean) return [];
  const keys = new Set<string>([clean]);
  if (clean.length < 13) keys.add(clean.padStart(13, "0"));
  if (clean.length === 13 && clean.startsWith("0")) {
    const trimmed = clean.replace(/^0+/, "");
    if (trimmed) keys.add(trimmed);
  }
  if (clean.length > 13) keys.add(clean.slice(-13));
  return [...keys];
}

function parseProductRowData(data: unknown): Product | null {
  if (!data) return null;
  try {
    return (typeof data === "string" ? JSON.parse(data) : data) as Product;
  } catch {
    return null;
  }
}

async function rawGetProductByBarcode(barcode: string): Promise<Product | null> {
  const keys = barcodeLookupKeys(barcode);
  if (keys.length === 0) return null;

  const archive = getArchiveSqlClient();
  if (archive) {
    try {
      for (const key of keys) {
        const result = await archive.execute({
          sql: "SELECT data FROM products WHERE barcode = ? OR id = ? LIMIT 1",
          args: [key, key],
        });
        if (result.rows.length > 0) {
          const p = parseProductRowData(result.rows[0].data);
          if (p) return p;
        }
      }
    } catch (e) {
      console.error("Archive SQL error in dbGetProductByBarcode:", e);
    }
  }

  // 2. Try Supabase
  if (supabaseClient) {
    try {
      for (const key of keys) {
        const { data, error } = await supabaseClient
          .from("products")
          .select("data")
          .or(`barcode.eq.${key},id.eq.${key}`)
          .limit(1)
          .maybeSingle();
        if (!error && data?.data) {
          const p = parseProductRowData(data.data);
          if (p) return p;
        }
      }
    } catch (e) {
      console.error("Supabase error in dbGetProductByBarcode:", e);
    }
  }

  // 3. Try JSON products first (5000+ products)
  for (const key of keys) {
    const jsonResult = jsonProducts.getProductByBarcode(key);
    if (jsonResult) return jsonResult;
  }

  // 5. Try Open Food Facts API (real-time global database fallback)
  for (const key of keys) {
    const offResult = await fetchProductFromOpenFoodFacts(key);
    if (offResult) return offResult;
  }

  // 6. Fall back to static dataset (15 products)
  for (const key of keys) {
    const curated = getProductByBarcode(key);
    if (curated) return curated;
  }
  return null;
}

export type DataBackendStatus = {
  turso: boolean;
  supabase: boolean;
  localSqlite: boolean;
  productCount: number | null;
};

export async function getDataBackendStatus(): Promise<DataBackendStatus> {
  const status: DataBackendStatus = {
    turso: Boolean(TURSO_URL && tursoClient),
    supabase: Boolean(supabaseClient),
    localSqlite: Boolean(!TURSO_URL && getArchiveSqlClient()),
    productCount: null,
  };
  try {
    status.productCount = await dbGetProductCount();
  } catch {
    status.productCount = null;
  }
  return status;
}

export interface DbSearchFilters {
  country?: string;
  category?: string;
  nutritionFlag?: string;
  brand?: string;
  minTrustScore?: number;
  sort?: string;
  onlyChanged?: boolean;
}

export async function dbSearchProducts(query: string, filters?: DbSearchFilters): Promise<Product[]> {
  const list = await rawSearchProducts(query, filters);
  return list.map((p) => enrichProduct(p)).filter(Boolean) as Product[];
}

async function rawSearchProducts(query: string, filters?: DbSearchFilters): Promise<Product[]> {
  const q = (query || "").trim();

  const archive = getArchiveSqlClient();
  if (archive) {
    try {
      let sql = "SELECT data FROM products WHERE 1=1";
      const params: any[] = [];

      if (q) {
        sql += " AND (name LIKE ? OR brand LIKE ? OR barcode LIKE ? OR ingredients_text LIKE ?)";
        const like = `%${q}%`;
        params.push(like, like, like, like);
      }
      if (filters?.country) {
        sql += " AND countries LIKE ?";
        params.push(`%${filters.country}%`);
      }
      if (filters?.category) {
        sql += " AND category = ?";
        params.push(filters.category);
      }
      if (filters?.brand) {
        sql += " AND brand LIKE ?";
        params.push(`%${filters.brand}%`);
      }
      if (filters?.minTrustScore) {
        sql += " AND trust_score >= ?";
        params.push(filters.minTrustScore);
      }
      if (filters?.nutritionFlag) {
        sql += " AND badges LIKE ?";
        params.push(`%${filters.nutritionFlag.toLowerCase()}%`);
      }

      sql += " LIMIT 150";

      const result = await archive.execute({ sql, args: params });
      const results: Product[] = [];
      for (const row of result.rows) {
        try {
          const p = parseProductRowData(row.data);
          if (!p) continue;
          if (filters?.onlyChanged) {
            if ((p.packSizeChanges?.length || 0) === 0 && (p.formulaChanges?.length || 0) === 0) continue;
          }
          if (isConsumableProduct(p)) {
            results.push(p);
          }
        } catch (_) {}
      }
      return sortResults(results, filters?.sort);
    } catch (e) {
      console.error("Archive SQL error in dbSearchProducts:", e);
    }
  }

  // 2. Try Supabase
  if (supabaseClient) {
    try {
      let queryBuilder = supabaseClient.from("products").select("data");

      if (q) {
        queryBuilder = queryBuilder.or(`name.ilike.%${q}%,brand.ilike.%${q}%,barcode.ilike.%${q}%,ingredients_text.ilike.%${q}%`);
      }
      if (filters?.country) {
        queryBuilder = queryBuilder.ilike("countries", `%${filters.country}%`);
      }
      if (filters?.category) {
        queryBuilder = queryBuilder.eq("category", filters.category);
      }
      if (filters?.brand) {
        queryBuilder = queryBuilder.ilike("brand", `%${filters.brand}%`);
      }
      if (filters?.minTrustScore) {
        queryBuilder = queryBuilder.gte("trust_score", filters.minTrustScore);
      }
      if (filters?.nutritionFlag) {
        queryBuilder = queryBuilder.ilike("badges", `%${filters.nutritionFlag.toLowerCase()}%`);
      }

      const { data, error } = await queryBuilder.limit(150);
      if (!error && data) {
        const results: Product[] = [];
        for (const row of data) {
          try {
            const p = (typeof row.data === "string" ? JSON.parse(row.data) : row.data) as Product;
            if (filters?.onlyChanged) {
              if ((p.packSizeChanges?.length || 0) === 0 && (p.formulaChanges?.length || 0) === 0) continue;
            }
            // Only include consumable products
            if (isConsumableProduct(p)) {
              results.push(p);
            }
          } catch (_) {}
        }
        return sortResults(results, filters?.sort);
      }
    } catch (e) {
      console.error("Supabase error in dbSearchProducts:", e);
    }
  }

  // 3. Try JSON products search (5000+ products)
  let jsonResults = jsonProducts.searchProducts(q || "", 150);
  // Filter to only consumable products
  jsonResults = jsonResults.filter(p => isConsumableProduct(p));
  if (jsonResults.length > 0) {
    return jsonResults;
  }

  // 5. Static fallback (15 products)
  let staticResults = searchProducts(q || "", {
    country: filters?.country,
    category: filters?.category,
    nutritionFlag: filters?.nutritionFlag,
    changeType: filters?.onlyChanged ? "shrinkflation" : undefined,
    brand: filters?.brand,
    minTrustScore: filters?.minTrustScore,
  });
  // Filter to only consumable products
  staticResults = staticResults.filter(p => isConsumableProduct(p));
  return sortResults(staticResults, filters?.sort);
}

export async function dbGetProductCount(): Promise<number> {
  const archive = getArchiveSqlClient();
  if (archive) {
    try {
      const result = await archive.execute("SELECT COUNT(*) as count FROM products");
      if (result.rows.length > 0) {
        return Number(result.rows[0].count);
      }
    } catch (e) {
      console.error("Archive SQL error in dbGetProductCount:", e);
    }
  }

  // 2. Try Supabase
  if (supabaseClient) {
    try {
      const { count, error } = await supabaseClient
        .from("products")
        .select("*", { count: "exact", head: true });
      if (!error && count !== null) {
        return count;
      }
    } catch (e) {
      console.error("Supabase error in dbGetProductCount:", e);
    }
  }

  // 3. Try JSON products count
  return jsonProducts.getTotalProductCount() || products.length;
}

// Stub for backward compatibility
export function getDb(): any {
  return null;
}

// Helper function to handle sorting consistently across all database adapters
function sortResults(results: Product[], sortKey?: string): Product[] {
  const key = sortKey || "name";
  results.sort((a, b) => {
    if (key === "trust") return (b.trustScore || 0) - (a.trustScore || 0);
    if (key === "calories") {
      const ca = a.versions.at(-1)?.nutrition.caloriesPerServing ?? 0;
      const cb = b.versions.at(-1)?.nutrition.caloriesPerServing ?? 0;
      return cb - ca;
    }
    if (key === "changes") {
      const ca = (a.packSizeChanges?.length || 0) + (a.formulaChanges?.length || 0);
      const cb = (b.packSizeChanges?.length || 0) + (b.formulaChanges?.length || 0);
      return cb - ca;
    }
    return a.name.localeCompare(b.name);
  });
  return results;
}
