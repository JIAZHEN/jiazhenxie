export interface BlogPostFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  image?: string;
  draft?: boolean;
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogPostFrontmatter;
  content: string;
}
