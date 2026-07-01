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
  // 1. Delete products.db from standalone output if it exists (as a safety fallback)
  const dbPath = path.join(process.cwd(), ".next", "standalone", "products.db");
  if (fs.existsSync(dbPath)) {
    console.log(`Found ${dbPath} (3GB+). Deleting to prevent deployment bloat...`);
    fs.unlinkSync(dbPath);
    console.log("✓ Successfully deleted products.db from standalone output.");
  }

  // 2. Delete Next.js build cache from output
  const cachePath = path.join(process.cwd(), ".next", "cache");
  if (fs.existsSync(cachePath)) {
    console.log(`Found ${cachePath} (200MB+). Deleting build cache to prevent Netlify upload size issues...`);
    deleteFolderRecursive(cachePath);
    console.log("✓ Successfully deleted Next.js cache from build output.");
  }
}

main();
