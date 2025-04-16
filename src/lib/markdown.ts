import frontMatter from "front-matter";

interface FrontMatterAttributes {
  title: string;
  date: string;
  description: string;
  tags: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  content: string;
}

// Use Vite's import.meta.glob to import all markdown files
const blogFiles = import.meta.glob("../content/blog/*.md", {
  as: "raw",
  eager: true,
});

export function getBlogPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  // Process each blog file
  for (const path in blogFiles) {
    const fileContents = blogFiles[path] as string;
    const { attributes, body } =
      frontMatter<FrontMatterAttributes>(fileContents);

    // Extract slug from filename
    const slug = path.split("/").pop()?.replace(/\.md$/, "") || "";

    posts.push({
      slug,
      title: attributes.title,
      date: attributes.date,
      description: attributes.description,
      tags: attributes.tags || [],
      content: body,
    });
  }

  // Sort posts by date (newest first)
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getBlogPost(slug: string): BlogPost | null {
  // Find the post with the matching slug
  const posts = getBlogPosts();
  return posts.find((post) => post.slug === slug) || null;
}
