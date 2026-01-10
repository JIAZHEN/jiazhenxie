import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiCalendar, FiClock, FiX } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
import { getAllPosts, type BlogPost } from "../lib/content";
import SEO from "../components/SEO";
import { calculateReadingTime } from "../lib/utils";

// Helper to check if an image URL is valid
const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  if (url.startsWith("/images/")) return true;
  if (url.startsWith("http://") || url.startsWith("https://")) return true;
  return false;
};

const POSTS_PER_PAGE = 6;

export default function Blog() {
  const [page, setPage] = useState(1);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTag = searchParams.get("tag");
  const [featuredImageError, setFeaturedImageError] = useState(false);

  useEffect(() => {
    const blogPosts = getAllPosts();
    setPosts(blogPosts);
    setLoading(false);
  }, []);

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : posts;

  const visiblePosts = filteredPosts.slice(0, page * POSTS_PER_PAGE);

  // Get all unique tags
  const allTags = [...new Set(posts.flatMap((post) => post.tags))].sort();

  const handleTagClick = (tag: string) => {
    setSearchParams({ tag });
    setPage(1);
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
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [visiblePosts.length, filteredPosts.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const featuredPost = filteredPosts[0];
  const remainingPosts = visiblePosts.slice(1);

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

      <div className="mt-16 sm:mt-20 -mx-4 px-4">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto py-8 sm:py-12 lg:py-20 border-b border-charcoal-200 dark:border-charcoal-700"
        >
          <div className="max-w-4xl">
            <span className="tag mb-4 sm:mb-6 inline-block">The Blog</span>
            <h1 className="headline-xl mb-4 sm:mb-6">
              Thoughts on
              <span className="block text-primary-600 dark:text-primary-400">
                engineering leadership.
              </span>
            </h1>
            <p className="body-lg text-charcoal-600 dark:text-paper-400 max-w-2xl">
              Insights on tech leadership, software architecture, and building 
              high-performing teams — from a cross-cultural perspective.
            </p>
          </div>
        </motion.header>

        {/* Tags filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="container mx-auto py-6 sm:py-8 border-b border-charcoal-200 dark:border-charcoal-700"
        >
          <div className="flex flex-col xs:flex-row flex-wrap items-start xs:items-center gap-3">
            <span className="text-xs sm:text-sm font-medium uppercase tracking-wider sm:tracking-widest text-charcoal-500 xs:mr-4">
              Filter by topic
            </span>
            <AnimatePresence mode="popLayout">
              {selectedTag && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleClearFilter}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium"
                >
                  {selectedTag}
                  <FiX className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
            {!selectedTag && (
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 8).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="tag hover:bg-sage-200 dark:hover:bg-sage-800/50"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Featured Post */}
        {featuredPost && !selectedTag && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="container mx-auto py-10 sm:py-16 border-b border-charcoal-200 dark:border-charcoal-700"
          >
            <Link
              to={`/blog/${featuredPost.slug}`}
              className="group grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center tap-highlight-transparent"
            >
              {/* Left: Image */}
              <div className="relative aspect-[16/10] sm:aspect-[4/3] bg-charcoal-100 dark:bg-charcoal-800 overflow-hidden">
                {featuredPost.image && isValidImageUrl(featuredPost.image) && !featuredImageError ? (
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={() => setFeaturedImageError(true)}
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 grid-overlay" />
                    <div className="absolute inset-4 sm:inset-8 border border-charcoal-300 dark:border-charcoal-600 flex items-center justify-center">
                      <span className="font-serif text-5xl sm:text-8xl text-primary-600/20 dark:text-primary-400/20 font-bold">
                        01
                      </span>
                    </div>
                  </>
                )}
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 sm:w-12 sm:h-12 border-t-2 sm:border-t-4 border-l-2 sm:border-l-4 border-primary-600 transition-all duration-300 group-hover:w-10 group-hover:h-10 sm:group-hover:w-16 sm:group-hover:h-16" />
                <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-12 sm:h-12 border-b-2 sm:border-b-4 border-r-2 sm:border-r-4 border-primary-600 transition-all duration-300 group-hover:w-10 group-hover:h-10 sm:group-hover:w-16 sm:group-hover:h-16" />
              </div>

              {/* Right: Content */}
              <div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <span className="tag-primary">Featured</span>
                  <span className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-charcoal-500 dark:text-paper-500">
                    <FiCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {new Date(featuredPost.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="headline-md mb-3 sm:mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="body-md text-charcoal-600 dark:text-paper-400 mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3">
                  {featuredPost.description}
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  {featuredPost.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="inline-flex items-center gap-2 text-sm sm:text-base text-primary-600 dark:text-primary-400 font-medium group-hover:gap-3 sm:group-hover:gap-4 transition-all duration-300">
                  Read article
                  <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
              </div>
            </Link>
          </motion.section>
        )}

        {/* Posts Grid */}
        <section className="container mx-auto py-10 sm:py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {(selectedTag ? visiblePosts : remainingPosts).map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="card-editorial block h-full p-4 sm:p-6 group tap-highlight-transparent"
                >
                  {/* Number */}
                  <span className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary-600/10 dark:text-primary-400/10 font-bold mb-3 sm:mb-4 block">
                    {String(index + (selectedTag ? 1 : 2)).padStart(2, "0")}
                  </span>

                  {/* Meta */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm text-charcoal-500 dark:text-paper-500">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock className="w-3 h-3" />
                      {calculateReadingTime(post.description || "")}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-lg sm:text-xl font-semibold mb-2 sm:mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Description */}
                  <p className="text-charcoal-600 dark:text-paper-400 text-xs sm:text-sm line-clamp-3 mb-3 sm:mb-4">
                    {post.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        onClick={(e) => {
                          e.preventDefault();
                          handleTagClick(tag);
                        }}
                        className="tag text-[10px] sm:text-xs cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Read more */}
                  <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-primary-600 dark:text-primary-400 font-medium">
                    Read more
                    <FiArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* Infinite scroll trigger */}
          {visiblePosts.length < filteredPosts.length && (
            <div ref={observerTarget} className="flex justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full"
              />
            </div>
          )}

          {/* End of posts */}
          {visiblePosts.length === filteredPosts.length && filteredPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="section-divider mb-8" />
              <p className="text-sm font-medium uppercase tracking-widest text-charcoal-500">
                You've reached the end
              </p>
            </motion.div>
          )}

          {/* No posts */}
          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-xl text-charcoal-500 mb-6">
                No posts found for "{selectedTag}"
              </p>
              <button onClick={handleClearFilter} className="btn-ghost">
                Clear filter
              </button>
            </motion.div>
          )}
        </section>
      </div>
    </>
  );
}
