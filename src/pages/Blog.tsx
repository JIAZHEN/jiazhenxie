import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FiArrowRight, FiX } from "react-icons/fi";
import { getAllPosts, type BlogPost } from "../lib/content";

const POSTS_PER_PAGE = 5;

export default function Blog() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Get all posts and filter based on selected tag
  const allPosts = useMemo(() => getAllPosts(), []);
  const filteredPosts = useMemo(() => {
    return selectedTag
      ? allPosts.filter((post: BlogPost) => post.tags.includes(selectedTag))
      : allPosts;
  }, [allPosts, selectedTag]);

  // Calculate visible posts
  const visiblePosts = useMemo(() => {
    const startIndex = 0;
    const endIndex = page * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, page]);

  // Reset to first page when tag changes
  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
    setPage(1);
  };

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          visiblePosts.length < filteredPosts.length
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [visiblePosts.length, filteredPosts.length]);

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Blog
          </h1>
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <span>Showing: #{selectedTag}</span>
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="grid gap-8">
          {visiblePosts.map((post: BlogPost) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {format(new Date(post.date), "MMMM d, yyyy")}
                </p>
                {post.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-line">
                    {post.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag: string) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`text-sm px-2 py-1 rounded ${
                        selectedTag === tag
                          ? "bg-primary-500 text-white hover:bg-primary-600"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
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

        {/* Infinite scroll trigger */}
        {visiblePosts.length < filteredPosts.length && (
          <div
            ref={observerTarget}
            className="h-20 flex items-center justify-center"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
