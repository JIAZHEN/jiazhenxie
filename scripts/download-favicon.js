import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FAVICON_URL =
  "https://raw.githubusercontent.com/JIAZHEN/jiazhenxie-net/main/public/favicon.ico";
const OUTPUT_DIR = path.join(__dirname, "../public");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Function to download a file
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(`Failed to download ${url}: ${response.statusCode}`),
          );
          return;
        }

        const file = fs.createWriteStream(outputPath);
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

// Main function to download the favicon
async function main() {
  try {
    const outputPath = path.join(OUTPUT_DIR, "favicon.ico");
    console.log("Downloading favicon...");
    await downloadFile(FAVICON_URL, outputPath);
    console.log("✓ Favicon downloaded successfully!");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
