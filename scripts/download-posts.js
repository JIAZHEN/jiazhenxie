import fs from "fs";
import path from "path";
import https from "https";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GITHUB_API_URL =
  "https://api.github.com/repos/JIAZHEN/jiazhenxie-net/contents/src/pages/posts";
const OUTPUT_DIR = path.join(__dirname, "../src/content/posts");

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

// Function to format markdown content
function formatMarkdown(content, filename) {
  // Extract frontmatter if it exists
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  let frontmatter = {};
  let markdownContent = content;

  if (frontmatterMatch) {
    const frontmatterText = frontmatterMatch[1];
    markdownContent = content.slice(frontmatterMatch[0].length).trim();

    // Parse frontmatter
    frontmatterText.split("\n").forEach((line) => {
      const [key, ...values] = line.split(":");
      if (key && values.length > 0) {
        frontmatter[key.trim()] = values.join(":").trim();
      }
    });
  }

  // Generate title from filename if not present
  if (!frontmatter.title) {
    frontmatter.title = filename
      .replace(/\.md$/, "")
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Ensure required frontmatter fields
  const date =
    frontmatter.pubDate || frontmatter.date || new Date().toISOString();
  const description =
    frontmatter.description ||
    `${
      frontmatter.title
    } - A blog post about ${frontmatter.title.toLowerCase()}`;

  // Format the new frontmatter
  const newFrontmatter = {
    title: frontmatter.title.replace(/^['"]|['"]$/g, ""),
    description: description.replace(/^['"]|['"]$/g, ""),
    date: date.split("T")[0],
    tags: frontmatter.tags?.split(",").map((t) => t.trim()) || [
      "uncategorized",
    ],
    image: (frontmatter.imgSrc || "/images/blog-placeholder.jpg").replace(
      /^['"]|['"]$/g,
      "",
    ),
    draft: false,
  };

  // Format the frontmatter with proper YAML escaping
  const formattedFrontmatter = Object.entries(newFrontmatter)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}: [${value
          .map((v) => `"${v.replace(/"/g, '\\"')}"`)
          .join(", ")}]`;
      } else if (typeof value === "boolean") {
        return `${key}: ${value}`;
      } else {
        // For strings, use proper YAML escaping
        const needsQuotes =
          /[:#\[\],\{\}&\*!|>'"%@\`]/.test(value) ||
          value.includes("\n") ||
          value === "";
        return needsQuotes
          ? `${key}: "${value.replace(/"/g, '\\"')}"`
          : `${key}: ${value}`;
      }
    })
    .join("\n");

  return `---
${formattedFrontmatter}
---

${markdownContent}`;
}

// Main function to download and process files
async function main() {
  try {
    // Get list of files from GitHub API
    const response = await new Promise((resolve, reject) => {
      https
        .get(
          GITHUB_API_URL,
          {
            headers: {
              "User-Agent": "Node.js",
              Accept: "application/vnd.github.v3+json",
            },
          },
          (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => resolve(JSON.parse(data)));
          },
        )
        .on("error", reject);
    });

    // Filter for markdown files
    const markdownFiles = response.filter(
      (file) =>
        file.name.endsWith(".md") &&
        file.name !== "getting-started-with-react.md",
    );

    console.log(`Found ${markdownFiles.length} markdown files to process`);

    // Download and process each file
    for (const file of markdownFiles) {
      const outputPath = path.join(OUTPUT_DIR, file.name);
      console.log(`Processing ${file.name}...`);

      // Download the file
      await downloadFile(file.download_url, outputPath);

      // Read the downloaded file
      let content = fs.readFileSync(outputPath, "utf8");

      // Format the content
      const formattedContent = formatMarkdown(content, file.name);

      // Write the formatted content back
      fs.writeFileSync(outputPath, formattedContent);

      console.log(`✓ Processed ${file.name}`);
    }

    console.log("All files processed successfully!");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
