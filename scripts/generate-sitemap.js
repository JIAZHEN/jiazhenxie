import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple sitemap generator for static site
const siteUrl = "https://jiazhenxie.com";

const staticPages = [
  { url: "", changefreq: "weekly", priority: "1.0" },
  { url: "/about", changefreq: "monthly", priority: "0.8" },
  { url: "/blog", changefreq: "daily", priority: "0.9" },
  { url: "/projects", changefreq: "monthly", priority: "0.7" },
];

// Get blog posts
const postsDir = path.join(__dirname, "../src/content/posts");
const blogPosts = [];

if (fs.existsSync(postsDir)) {
  const files = fs.readdirSync(postsDir);
  files.forEach((file) => {
    if (file.endsWith(".md")) {
      const slug = file.replace(".md", "");
      const filePath = path.join(postsDir, file);
      const content = fs.readFileSync(filePath, "utf8");

      // Extract date from frontmatter
      const dateMatch = content.match(/date:\s*(\d{4}-\d{2}-\d{2})/);
      const date = dateMatch
        ? dateMatch[1]
        : new Date().toISOString().split("T")[0];

      blogPosts.push({
        url: `/blog/${slug}`,
        changefreq: "yearly",
        priority: "0.6",
        lastmod: date,
      });
    }
  });
}

// Generate sitemap
const urls = [...staticPages, ...blogPosts];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (page) => `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${page.lastmod || new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

// Write sitemap to public directory
const outputPath = path.join(__dirname, "../public/sitemap.xml");
fs.writeFileSync(outputPath, sitemap);

console.log(`Sitemap generated with ${urls.length} URLs at ${outputPath}`);
