import { useState } from "react";
import { motion } from "framer-motion";
import { FiClock, FiTag } from "react-icons/fi";

// This would typically come from an API or file system
const mockPosts = [
  {
    id: 1,
    title: "Getting Started with React and TypeScript",
    excerpt:
      "Learn how to set up a new React project with TypeScript and best practices for type safety.",
    date: "2024-03-15",
    readTime: "5 min read",
    tags: ["React", "TypeScript", "Web Development"],
  },
  {
    id: 2,
    title: "Building a Modern Web App with Next.js",
    excerpt:
      "A comprehensive guide to building scalable web applications using Next.js and its features.",
    date: "2024-03-10",
    readTime: "8 min read",
    tags: ["Next.js", "React", "Web Development"],
  },
];

const Blog = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(mockPosts.flatMap((post) => post.tags)));

  const filteredPosts = selectedTag
    ? mockPosts.filter((post) => post.tags.includes(selectedTag))
    : mockPosts;

  return (
    <div className="max-w-4xl mx-auto py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8">Blog</h1>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1 rounded-full text-sm ${
                !selectedTag
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTag === tag
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg"
            >
              <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {post.excerpt}
              </p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center mr-4">
                  <FiClock className="mr-1" />
                  {post.readTime}
                </span>
                <span className="flex items-center">
                  <FiTag className="mr-1" />
                  {post.tags.join(", ")}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Blog;
