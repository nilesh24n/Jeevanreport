const fs = require("fs");
const path = require("path");

function main() {
  // When running on Netlify, skip all post-build cleanup — the @netlify/plugin-nextjs
  // plugin manages the output and runs its onPostBuild AFTER this script.
  // Interfering with .next/ contents causes "Failed publishing static content".
  const isNetlify = process.env.NETLIFY === "true";

  if (isNetlify) {
    console.log("Running on Netlify — skipping post-build cleanup (plugin-nextjs handles output).");
    return;
  }

  // Local-only: delete large local DB files that may have been copied by old standalone builds
  const standaloneDb = path.join(process.cwd(), ".next", "standalone", "products.db");
  if (fs.existsSync(standaloneDb)) {
    console.log(`Found ${standaloneDb} (3GB+). Deleting...`);
    fs.unlinkSync(standaloneDb);
    console.log("✓ Deleted products.db from standalone output.");
  }

  // Local-only: delete build cache to save disk space
  const cachePath = path.join(process.cwd(), ".next", "cache");
  if (fs.existsSync(cachePath)) {
    console.log(`Found ${cachePath}. Deleting build cache...`);
    deleteFolderRecursive(cachePath);
    console.log("✓ Deleted Next.js build cache.");
  }
}

function deleteFolderRecursive(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(directoryPath);
  }
}

main();
