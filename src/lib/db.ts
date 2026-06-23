/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
import path from "path";
import type { Product } from "./types";
import { products, getProductById, getProductByBarcode, searchProducts } from "./data/products";
import * as jsonProducts from "./products-json";
import { fetchProductFromOpenFoodFacts } from "./openfoodfacts";
import { enrichProduct } from "./product-enricher";

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

// Local SQLite DB (Lazy)
const DB_PATH = path.resolve(process.cwd(), "products.db");
let localDb: any = null;
let localDbAvailable = false;

function initLocalDb() {
  if (localDbAvailable) return true;
  try {
    // Only attempt on server environment
    if (typeof window === "undefined") {
      const fs = require("fs");
      if (fs.existsSync(DB_PATH)) {
        const BetterSqlite3 = require("better-sqlite3");
        localDb = new BetterSqlite3(DB_PATH, { readonly: true });
        localDbAvailable = true;
        return true;
      }
    }
  } catch (err) {
    // ignore
  }
  return false;
}

export async function dbGetProductById(id: string): Promise<Product | null> {
  const p = await rawGetProductById(id);
  return enrichProduct(p);
}

async function rawGetProductById(id: string): Promise<Product | null> {
  // 1. Try Turso
  if (tursoClient) {
    try {
      const result = await tursoClient.execute({
        sql: "SELECT data FROM products WHERE id = ?",
        args: [id],
      });
      if (result.rows.length > 0) {
        const row = result.rows[0];
        return JSON.parse(row.data as string) as Product;
      }
    } catch (e) {
      console.error("Turso error in dbGetProductById:", e);
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

  // 3. Try Local SQLite
  if (initLocalDb() && localDb) {
    try {
      const row = localDb.prepare("SELECT data FROM products WHERE id = ?").get(id);
      if (row?.data) {
        return JSON.parse(row.data) as Product;
      }
    } catch (e) {
      console.error("Local SQLite error in dbGetProductById:", e);
    }
  }

  // 4. Try JSON products fallback (5000+ products)
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

async function rawGetProductByBarcode(barcode: string): Promise<Product | null> {
  const clean = barcode.replace(/\D/g, "");

  // 1. Try Turso
  if (tursoClient) {
    try {
      const result = await tursoClient.execute({
        sql: "SELECT data FROM products WHERE barcode = ?",
        args: [clean],
      });
      if (result.rows.length > 0) {
        const row = result.rows[0];
        return JSON.parse(row.data as string) as Product;
      }
    } catch (e) {
      console.error("Turso error in dbGetProductByBarcode:", e);
    }
  }

  // 2. Try Supabase
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from("products")
        .select("data")
        .eq("barcode", clean)
        .single();
      if (!error && data?.data) {
        return (typeof data.data === "string" ? JSON.parse(data.data) : data.data) as Product;
      }
    } catch (e) {
      console.error("Supabase error in dbGetProductByBarcode:", e);
    }
  }

  // 3. Try Local SQLite
  if (initLocalDb() && localDb) {
    try {
      const row = localDb.prepare("SELECT data FROM products WHERE barcode = ?").get(clean);
      if (row?.data) {
        return JSON.parse(row.data) as Product;
      }
    } catch (e) {
      console.error("Local SQLite error in dbGetProductByBarcode:", e);
    }
  }

  // 4. Try JSON products first (5000+ products)
  const jsonResult = jsonProducts.getProductByBarcode(clean);
  if (jsonResult) return jsonResult;

  // 5. Try Open Food Facts API (real-time global database fallback)
  const offResult = await fetchProductFromOpenFoodFacts(clean);
  if (offResult) return offResult;

  // 6. Fall back to static dataset (15 products)
  return getProductByBarcode(clean) || null;
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

  // 1. Try Turso
  if (tursoClient) {
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

      const result = await tursoClient.execute({ sql, args: params });
      const results: Product[] = [];
      for (const row of result.rows) {
        try {
          const p = JSON.parse(row.data as string) as Product;
          if (filters?.onlyChanged) {
            if ((p.packSizeChanges?.length || 0) === 0 && (p.formulaChanges?.length || 0) === 0) continue;
          }
          results.push(p);
        } catch (_) {}
      }
      return sortResults(results, filters?.sort);
    } catch (e) {
      console.error("Turso error in dbSearchProducts:", e);
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
            results.push(p);
          } catch (_) {}
        }
        return sortResults(results, filters?.sort);
      }
    } catch (e) {
      console.error("Supabase error in dbSearchProducts:", e);
    }
  }

  // 3. Try Local SQLite
  if (initLocalDb() && localDb) {
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

      const stmt = localDb.prepare(sql);
      const rows = stmt.all(...params);
      const results: Product[] = [];
      for (const row of rows) {
        try {
          const p = JSON.parse(row.data) as Product;
          if (filters?.onlyChanged) {
            if ((p.packSizeChanges?.length || 0) === 0 && (p.formulaChanges?.length || 0) === 0) continue;
          }
          results.push(p);
        } catch (_) {}
      }
      return sortResults(results, filters?.sort);
    } catch (e) {
      console.error("Local SQLite error in dbSearchProducts:", e);
    }
  }

  // 4. Try JSON products search (5000+ products)
  const jsonResults = jsonProducts.searchProducts(q || "", 150);
  if (jsonResults.length > 0) {
    return jsonResults;
  }

  // 5. Static fallback (15 products)
  const staticResults = searchProducts(q || "", {
    country: filters?.country,
    category: filters?.category,
    nutritionFlag: filters?.nutritionFlag,
    changeType: filters?.onlyChanged ? "shrinkflation" : undefined,
    brand: filters?.brand,
    minTrustScore: filters?.minTrustScore,
  });
  return sortResults(staticResults, filters?.sort);
}

export async function dbGetProductCount(): Promise<number> {
  // 1. Try Turso
  if (tursoClient) {
    try {
      const result = await tursoClient.execute("SELECT COUNT(*) as count FROM products");
      if (result.rows.length > 0) {
        return Number(result.rows[0].count);
      }
    } catch (e) {
      console.error("Turso error in dbGetProductCount:", e);
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

  // 3. Try Local SQLite
  if (initLocalDb() && localDb) {
    try {
      const row = localDb.prepare("SELECT COUNT(*) as count FROM products").get();
      if (row) return Number(row.count);
    } catch (e) {
      console.error("Local SQLite error in dbGetProductCount:", e);
    }
  }

  // 4. Try JSON products count
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
