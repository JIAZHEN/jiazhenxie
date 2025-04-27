import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getAllPosts, type BlogPost } from "../lib/content";
import SEO from "../components/SEO";

const POSTS_PER_PAGE = 5;

export default function Blog() {
  const [page, setPage] = useState(1);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const blogPosts = getAllPosts();
    setPosts(blogPosts);
    setLoading(false);
  }, []);

  const visiblePosts = posts.slice(0, page * POSTS_PER_PAGE);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visiblePosts.length < posts.length) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [visiblePosts.length, posts.length]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <>
      <SEO
        title="Blog | Jiazhen Xie"
        description="Read my thoughts on software development, architecture, and technology."
        type="website"
      />
      <div className="container mx-auto px-4 py-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-8">Blog</h1>

          {/* Posts grid */}
          <div className="grid gap-8">
            {visiblePosts.map((post) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="border-b border-gray-200 dark:border-gray-800 pb-8"
              >
                <Link to={`/blog/${post.slug}`} className="block">
                  <h2 className="text-2xl font-bold mb-2 hover:text-primary-600 dark:hover:text-primary-400">
                    {post.title}
                  </h2>
                </Link>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString()}
                  </time>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {post.description}
                </p>
                <div className="flex gap-2 mt-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 mt-4 text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Read more <FiArrowRight />
                </Link>
              </motion.article>
            ))}
          </div>

          {/* Infinite scroll trigger */}
          {visiblePosts.length < posts.length && (
            <div ref={observerTarget} className="h-20" />
          )}
        </motion.div>
      </div>
    </>
  );
}
