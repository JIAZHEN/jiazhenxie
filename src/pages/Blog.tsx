import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
import { getAllPosts, type BlogPost } from "../lib/content";
import SEO from "../components/SEO";

const POSTS_PER_PAGE = 5;

export default function Blog() {
  const [page, setPage] = useState(1);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTag = searchParams.get("tag");

  useEffect(() => {
    const blogPosts = getAllPosts();
    setPosts(blogPosts);
    setLoading(false);
  }, []);

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : posts;

  const visiblePosts = filteredPosts.slice(0, page * POSTS_PER_PAGE);

  const handleTagClick = (tag: string) => {
    setSearchParams({ tag });
    setPage(1); // Reset pagination when changing tags
  };

  const handleClearFilter = () => {
    setSearchParams({});
    setPage(1);
  };

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
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [visiblePosts.length, filteredPosts.length]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <>
      <SEO
        title="Engineering Leadership Blog - Insights from UK Tech Industry | Jiazhen Xie"
        description="Engineering leadership insights from Chinese tech leader in UK. Read about software architecture, team management, cross-cultural leadership, and engineering best practices from Oxford-educated engineering manager."
        type="website"
        keywords={[
          "engineering leadership blog",
          "tech leadership insights UK",
          "software engineering management",
          "Chinese engineering leader blog",
          "Oxford tech blog",
          "engineering team management",
          "cross-cultural leadership",
          "software architecture insights",
          "tech management blog UK",
          "inclusive engineering leadership",
        ]}
        canonicalUrl="https://jiazhenxie.com/blog"
      />
      <div className="container mx-auto px-4 py-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Engineering Leadership Blog
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Insights on tech leadership, software architecture, and
                engineering management from a Chinese leader in the UK tech
                industry
              </p>
            </div>
            {selectedTag && (
              <button
                onClick={handleClearFilter}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>

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
                    <button
                      key={tag}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTagClick(tag);
                      }}
                      className={`px-2 py-1 rounded-full text-xs ${
                        tag === selectedTag
                          ? "bg-primary-600 dark:bg-primary-400 text-white dark:text-gray-900"
                          : "bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 hover:bg-primary-200 dark:hover:bg-primary-800"
                      }`}
                    >
                      {tag}
                    </button>
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
          {visiblePosts.length < filteredPosts.length && (
            <div ref={observerTarget} className="h-20" />
          )}
        </motion.div>
      </div>
    </>
  );
}
