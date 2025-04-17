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
  let currentKey = "";
  let isList = false;
  let isFoldedString = false;
  let listItems: string[] = [];
  let foldedString = "";

  frontmatter.split("\n").forEach((line) => {
    // Handle folded strings (lines starting with >-)
    if (line.trim().startsWith(">-")) {
      isFoldedString = true;
      foldedString = line.trim().slice(2).trim();
      return;
    }

    // Continue collecting folded string content
    if (isFoldedString) {
      if (line.trim() === "") {
        // End of folded string
        data[currentKey] = foldedString;
        isFoldedString = false;
      } else {
        foldedString += " " + line.trim();
      }
      return;
    }

    // Handle list items
    if (line.trim().startsWith("-")) {
      if (!isList) {
        isList = true;
        listItems = [];
      }
      listItems.push(line.trim().slice(1).trim());
      return;
    }

    // If we were processing a list and hit a non-list item, save the list
    if (isList && !line.trim().startsWith("-")) {
      data[currentKey] = listItems;
      isList = false;
    }

    // Handle regular key-value pairs
    const [key, ...values] = line.split(":");
    if (key && values.length > 0) {
      currentKey = key.trim();
      const value = values.join(":").trim();
      if (value.startsWith("[") && value.endsWith("]")) {
        data[currentKey] = value
          .slice(1, -1)
          .split(",")
          .map((v) => v.trim());
      } else if (!value.startsWith(">-")) {
        data[currentKey] = value;
      }
    }
  });

  // Handle case where the last item was a list
  if (isList) {
    data[currentKey] = listItems;
  }

  // Handle case where the last item was a folded string
  if (isFoldedString) {
    data[currentKey] = foldedString;
  }

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
