export interface BlogPost {
  title: string;
  date: string;
  description: string;
  tags: string[];
  slug: string;
  content: string;
}

export type BlogPosts = BlogPost[];
