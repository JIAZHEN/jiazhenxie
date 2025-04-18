import frontMatter from "front-matter";

interface FrontMatterAttributes {
  title: string;
  date: string;
  description: string;
  tags: string[];
  image: string;
  draft: boolean;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  image: string;
  draft: boolean;
  content: string;
}

// Use Vite's import.meta.glob to import all markdown files
const blogFiles = import.meta.glob("../content/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: false,
});

export async function getBlogPosts(
  includeDrafts: boolean = false,
): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];

  // Process each blog file
  for (const path in blogFiles) {
    const fileContents = (await blogFiles[path]()) as string;
    const { attributes, body } =
      frontMatter<FrontMatterAttributes>(fileContents);

    // Skip draft posts unless includeDrafts is true
    if (attributes.draft && !includeDrafts) {
      continue;
    }

    // Extract slug from filename
    const slug = path.split("/").pop()?.replace(/\.md$/, "") || "";

    posts.push({
      slug,
      title: attributes.title,
      date: attributes.date,
      description: attributes.description,
      tags: attributes.tags || [],
      image: attributes.image || "/images/blog-placeholder.jpg",
      draft: attributes.draft || false,
      content: body,
    });
  }

  // Sort posts by date (newest first)
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  // Find the post with the matching slug
  const posts = await getBlogPosts(true); // Include drafts when getting a specific post
  return posts.find((post) => post.slug === slug) || null;
}
