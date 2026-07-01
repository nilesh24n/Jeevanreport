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
  // 1. Delete standalone output entirely to prevent deployment bloat and Netlify upload issues
  const standalonePath = path.join(process.cwd(), ".next", "standalone");
  if (fs.existsSync(standalonePath)) {
    console.log(`Found ${standalonePath}. Deleting standalone output to prevent deployment bloat...`);
    deleteFolderRecursive(standalonePath);
    console.log("✓ Successfully deleted standalone directory from build output.");
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
