import { Link } from "react-router-dom";
import { getBlogPosts } from "../lib/markdown";
import { formatDate } from "../lib/utils";

export default function Blog() {
  const posts = getBlogPosts();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 mt-16">Blog</h1>
        <div className="grid gap-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <Link to={`/blog/${post.slug}`} className="block">
                <h2 className="text-2xl font-semibold mb-2 hover:text-primary-600 dark:hover:text-primary-400">
                  {post.title}
                </h2>
              </Link>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {post.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <div className="flex gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
