import { Database } from "bun-sqlite";
import { createClient } from "@libsql/client";

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error("Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN environment variables.");
  process.exit(1);
}

const localDb = new Database("products.db", { readonly: true });
const turso = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN,
});

async function main() {
  console.log("Connecting to Turso database...");

  // 1. Create table and indexes
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      barcode TEXT UNIQUE,
      name TEXT,
      brand TEXT,
      category TEXT,
      countries TEXT,
      ingredients_text TEXT,
      trust_score INTEGER,
      trust_level TEXT,
      badges TEXT,
      data TEXT
    )
  `);

  await turso.execute("CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode)");
  await turso.execute("CREATE INDEX IF NOT EXISTS idx_products_name ON products(name)");
  await turso.execute("CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand)");
  await turso.execute("CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)");

  console.log("Table and indexes verified on Turso.");

  // Get total count
  const countRow = localDb.query("SELECT COUNT(*) as count FROM products").get() as { count: number };
  const total = countRow.count;
  console.log(`Found ${total.toLocaleString()} products locally.`);

  const batchSize = 100; // Batch of 100 rows (~400KB payload)
  let offset = 0;
  let successCount = 0;

  const selectQuery = localDb.prepare(`
    SELECT id, name, brand, barcode, category, countries, ingredients_text, trust_score, trust_level, badges, data 
    FROM products 
    ORDER BY id 
    LIMIT ? OFFSET ?
  `);

  while (offset < total) {
    const rows = selectQuery.all(batchSize, offset) as any[];
    if (rows.length === 0) break;

    // Prepare Turso batch statements
    const stmts = rows.map(row => ({
      sql: `INSERT OR REPLACE INTO products (id, name, brand, barcode, category, countries, ingredients_text, trust_score, trust_level, badges, data) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        row.id,
        row.name,
        row.brand,
        row.barcode,
        row.category,
        row.countries,
        row.ingredients_text,
        row.trust_score,
        row.trust_level,
        row.badges,
        row.data
      ]
    }));

    try {
      await turso.batch(stmts, "write");
      successCount += rows.length;
      console.log(`✓ Migrated ${successCount.toLocaleString()} / ${total.toLocaleString()} products`);
    } catch (err: any) {
      console.error(`\n✗ Error at offset ${offset}:`, err.message || err);
      // Try individually in case one row is failing
      for (const stmt of stmts) {
        try {
          await turso.execute(stmt);
        } catch (rowErr: any) {
          console.error(`  Failed on product ID ${stmt.args[0]}:`, rowErr.message);
        }
      }
    }

    offset += batchSize;
  }

  console.log(`\n🎉 Migration complete! Successfully uploaded ${successCount.toLocaleString()} products.`);
}

main().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});