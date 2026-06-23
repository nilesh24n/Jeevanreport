#!/usr/bin/env node
const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

// Open the database
const dbPath = "C:\\Jeevanreport2.0\\products.db";
const db = new Database(dbPath, { readonly: true });

try {
  // Get table structure
  const tables = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table'"
  ).all();
  
  console.log("Tables in database:", tables);

  // Check products table schema
  const schema = db.prepare("PRAGMA table_info(products)").all();
  console.log("\nProducts table schema:", schema);

  // Count total products
  const count = db.prepare("SELECT COUNT(*) as total FROM products").get();
  console.log(`\nTotal products: ${count.total}`);

  // Get sample products
  console.log("\nSample products (first 3):");
  const samples = db.prepare("SELECT * FROM products LIMIT 3").all();
  samples.forEach((p, i) => {
    console.log(`\n--- Product ${i + 1} ---`);
    console.log(`ID: ${p.id}`);
    console.log(`Barcode: ${p.barcode}`);
    console.log(`Data preview:`, JSON.stringify(JSON.parse(p.data), null, 2).substring(0, 300) + "...");
  });

} catch (err) {
  console.error("Error reading database:", err);
} finally {
  db.close();
}
