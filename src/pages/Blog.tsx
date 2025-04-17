import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FiArrowRight } from "react-icons/fi";
import { blogPosts } from "../lib/blog-posts";
import type { BlogPost } from "../types/blog";

export default function Blog() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Filter posts based on selected tag
  const filteredPosts = selectedTag
    ? blogPosts.filter((post: BlogPost) => post.tags.includes(selectedTag))
    : blogPosts;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
          Blog
        </h1>

        <div className="grid gap-8">
          {filteredPosts.map((post: BlogPost) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag: string) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`text-sm px-3 py-1 rounded-full ${
                        selectedTag === tag
                          ? "bg-primary-500 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>

                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {format(new Date(post.date), "MMMM d, yyyy")}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {post.description}
                </p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Read more
                  <FiArrowRight className="ml-2" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
