const fs = require("fs");
const path = require("path");

function deleteFolderRecursive(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(directoryPath);
  }
}

function main() {
  // When running on Netlify, skip cache deletion — the @netlify/plugin-nextjs
  // plugin runs its onPostBuild AFTER this script and needs .next/cache intact.
  // Only delete products.db (3GB+) to prevent deploy bloat.
  const isNetlify = process.env.NETLIFY === "true";

  // 1. Delete products.db from standalone output if it exists
  const dbPath = path.join(process.cwd(), ".next", "standalone", "products.db");
  if (fs.existsSync(dbPath)) {
    console.log(`Found ${dbPath} (3GB+). Deleting to prevent deployment bloat...`);
    fs.unlinkSync(dbPath);
    console.log("✓ Successfully deleted products.db from standalone output.");
  }

  // 2. Delete Next.js build cache — ONLY when NOT on Netlify.
  // On Netlify, the plugin-nextjs needs .next/cache for its onPostBuild step.
  if (!isNetlify) {
    const cachePath = path.join(process.cwd(), ".next", "cache");
    if (fs.existsSync(cachePath)) {
      console.log(`Found ${cachePath} (200MB+). Deleting build cache (local only)...`);
      deleteFolderRecursive(cachePath);
      console.log("✓ Successfully deleted Next.js cache from build output.");
    }
  } else {
    console.log("Running on Netlify — skipping cache deletion so plugin-nextjs can complete onPostBuild.");
  }
}

main();
