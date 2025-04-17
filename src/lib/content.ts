// Define the type for our blog post
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  content: string;
}

// Get all markdown files from the content directory
const posts = import.meta.glob<string>("../content/posts/*.md", {
  eager: true,
  as: "raw",
});

// Simple frontmatter parser
const parseFrontmatter = (content: string) => {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return { data: {}, content };

  const frontmatter = frontmatterMatch[1];
  const markdownContent = content.slice(frontmatterMatch[0].length).trim();

  const data: Record<string, string | string[]> = {};
  frontmatter.split("\n").forEach((line) => {
    const [key, ...values] = line.split(":");
    if (key && values.length > 0) {
      const value = values.join(":").trim();
      if (value.startsWith("[") && value.endsWith("]")) {
        data[key.trim()] = value
          .slice(1, -1)
          .split(",")
          .map((v) => v.trim());
      } else {
        data[key.trim()] = value;
      }
    }
  });

  return { data, content: markdownContent };
};

// Process all posts and return them in a sorted array
export const getAllPosts = (): BlogPost[] => {
  return Object.entries(posts)
    .map(([path, content]) => {
      const slug = path.split("/").pop()?.replace(".md", "") || "";
      const { data, content: markdownContent } = parseFrontmatter(content);

      return {
        slug,
        title: (data.title as string) || "",
        date: (data.date as string) || new Date().toISOString(),
        description: (data.description as string) || "",
        tags: (data.tags as string[]) || [],
        content: markdownContent,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get a single post by slug
export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return getAllPosts().find((post) => post.slug === slug);
};
