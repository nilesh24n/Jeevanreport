const path = require('path');

const DB_PATH = path.resolve(process.cwd(), 'products.db');

async function main() {
  try {
    const BetterSqlite3 = require('better-sqlite3');
    const db = new BetterSqlite3(DB_PATH, { readonly: true });
    const row = db.prepare('SELECT COUNT(*) as c FROM products').get();
    console.log(`products.db path: ${DB_PATH}`);
    console.log(`rows in products table: ${row?.c ?? 0}`);
  } catch (err) {
    console.error('Error: could not open products.db with better-sqlite3.');
    console.error('Install it with: npm install better-sqlite3');
    console.error(err.message || err);
    process.exit(1);
  }
}

main();
