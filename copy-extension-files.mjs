import { copyFile } from "node:fs/promises";

await Promise.all([
    copyFile("manifest.json", "dist/manifest.json"),
    copyFile("background.js", "dist/background.js")
]);

console.log("Soubory Chrome rozšíření byly zkopírovány do dist.");