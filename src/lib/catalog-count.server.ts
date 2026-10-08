import { readFile } from "fs/promises";
import path from "path";
import { formatProductCount, getCuratedProductCount } from "./catalog-count";

/** Read lightweight index metadata shipped in /public/data. */
export async function getJsonIndexProductTotal(): Promise<number> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "products_index.json");
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as { total?: number; index?: Record<string, string> };
    if (typeof parsed.total === "number" && parsed.total > 0) return parsed.total;
    if (parsed.index) return Object.keys(parsed.index).length;
  } catch {
    // ignore — caller falls back
  }
  return 0;
}

export async function resolvePublicProductCount(dbCount: number): Promise<string> {
  const jsonTotal = await getJsonIndexProductTotal();
  const best = Math.max(dbCount, jsonTotal, getCuratedProductCount());
  return formatProductCount(best);
}
