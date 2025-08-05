import { getAllPosts } from "./content";
import { siteConfig } from "../config/site";

export interface SitemapUrl {
  url: string;
  lastmod?: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

export function generateSitemap(): string {
  const urls: SitemapUrl[] = [
    {
      url: siteConfig.url,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/about`,
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastmod: new Date().toISOString(),
      changefreq: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/projects`,
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: 0.7,
    },
  ];

  // Add blog posts
  const posts = getAllPosts();
  posts.forEach((post) => {
    urls.push({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastmod: post.date,
      changefreq: "yearly",
      priority: 0.6,
    });
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.url}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ""}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ""}
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return sitemap;
}

export function generateRSSFeed(): string {
  const posts = getAllPosts().slice(0, 20); // Latest 20 posts

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.title}</title>
    <description>${siteConfig.description}</description>
    <link>${siteConfig.url}</link>
    <atom:link href="${
      siteConfig.url
    }/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-US</language>
    <managingEditor>${siteConfig.author.email} (${
    siteConfig.author.name
  })</managingEditor>
    <webMaster>${siteConfig.author.email} (${
    siteConfig.author.name
  })</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Custom React Blog</generator>
    
${posts
  .map(
    (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${
        post.description || post.content.substring(0, 200)
      }]]></description>
      <link>${siteConfig.url}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteConfig.url}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${siteConfig.author.email} (${siteConfig.author.name})</author>
      ${post.tags
        .map((tag) => `<category><![CDATA[${tag}]]></category>`)
        .join("\n      ")}
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>`;

  return rss;
}
