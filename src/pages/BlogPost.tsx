import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { motion } from "framer-motion";
import { FiClock, FiUser, FiArrowLeft, FiCalendar, FiShare2, FiTwitter, FiLinkedin } from "react-icons/fi";
import { BlogPost, getBlogPost } from "../lib/markdown";
import { formatDate, calculateReadingTime, getWordCount } from "../lib/utils";
import { siteConfig } from "../config/site";
import SEO from "../components/SEO";

// Helper to check if an image URL is valid/accessible
const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  // Check if it's a local image or a valid external URL
  if (url.startsWith("/images/")) return true;
  if (url.startsWith("http://") || url.startsWith("https://")) return true;
  return false;
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    async function loadPost() {
      if (slug) {
        try {
          const decodedSlug = decodeURIComponent(slug);
          const postData = await getBlogPost(decodedSlug);
          setPost(postData);

          setError(null);
        } catch (err) {
          setError("Failed to load post");
          console.error("Error loading post:", err);
        } finally {
          setLoading(false);
        }
      }
    }

    loadPost();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShare = (platform: "twitter" | "linkedin") => {
    if (!post) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post.title);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`,
    };

    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="headline-md mb-4 text-primary-600">Oops!</h1>
          <p className="text-charcoal-600 dark:text-paper-400 mb-8">{error}</p>
          <Link to="/blog" className="btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="headline-md mb-4">Post not found</h1>
          <Link to="/blog" className="btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(post.content);
  const wordCount = getWordCount(post.content);
  const isLeadershipPost = post.tags.some(
    (tag) =>
      tag.includes("leadership") ||
      tag.includes("management") ||
      tag.includes("engineering-leadership")
  );

  return (
    <>
      <SEO
        title={`${post.title} | Engineering Leadership Blog`}
        description={`${
          post.description || post.content.substring(0, 160)
        } - Insights from ${
          siteConfig.author.name
        }, Chinese engineering leader in UK tech industry.`}
        type="article"
        publishedTime={post.date}
        tags={post.tags}
        image={post.image}
        keywords={[
          ...post.tags,
          ...(isLeadershipPost
            ? [
                "engineering leadership",
                "tech management",
                "software engineering management",
                "Chinese engineering leader",
                "UK tech industry",
              ]
            : []),
        ]}
        canonicalUrl={`https://jiazhenxie.com/blog/${post.slug}`}
        readingTime={readingTime}
        wordCount={wordCount}
      />

      <article className="mt-16 sm:mt-20 -mx-4">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="border-b border-charcoal-200 dark:border-charcoal-700"
        >
          <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-20">
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 sm:mb-8"
            >
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-charcoal-500 dark:text-paper-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors tap-highlight-transparent py-2"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
            </motion.nav>

            <div className="max-w-4xl">
              {/* Tags */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6"
              >
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="tag"
                  >
                    {tag}
                  </Link>
                ))}
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="headline-lg mb-6 sm:mb-8"
              >
                {post.title}
              </motion.h1>

              {/* Meta */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-charcoal-500 dark:text-paper-500"
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <FiUser className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{siteConfig.author.name}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <FiCalendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <FiClock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{readingTime}</span>
                </div>
                <span className="hidden xs:inline text-charcoal-400 dark:text-paper-600">
                  {wordCount.toLocaleString()} words
                </span>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* Cover Image */}
        {post.image && isValidImageUrl(post.image) && !imageError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="container mx-auto px-4 py-8"
          >
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-[21/9] overflow-hidden rounded-lg bg-charcoal-100 dark:bg-charcoal-800">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/30 to-transparent" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="container mx-auto px-4"
        >
          <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 py-8 sm:py-12 lg:py-16">
            {/* Sidebar - Share buttons */}
            <aside className="lg:col-span-2 order-2 lg:order-1">
              <div className="lg:sticky lg:top-24">
                {/* Mobile: horizontal layout, Desktop: vertical */}
                <div className="flex lg:flex-col gap-3 sm:gap-4">
                  <span className="text-xs font-medium uppercase tracking-widest text-charcoal-500 dark:text-paper-500 hidden lg:block mb-2">
                    Share
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wider text-charcoal-500 dark:text-paper-500 lg:hidden flex items-center">
                    Share:
                  </span>
                  <button
                    onClick={() => handleShare("twitter")}
                    className="p-2.5 sm:p-3 border border-charcoal-200 dark:border-charcoal-700 text-charcoal-600 dark:text-paper-400 hover:border-primary-600 hover:text-primary-600 transition-all tap-highlight-transparent"
                    aria-label="Share on Twitter"
                  >
                    <FiTwitter className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="p-2.5 sm:p-3 border border-charcoal-200 dark:border-charcoal-700 text-charcoal-600 dark:text-paper-400 hover:border-primary-600 hover:text-primary-600 transition-all tap-highlight-transparent"
                    aria-label="Share on LinkedIn"
                  >
                    <FiLinkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(window.location.href)}
                    className="p-2.5 sm:p-3 border border-charcoal-200 dark:border-charcoal-700 text-charcoal-600 dark:text-paper-400 hover:border-primary-600 hover:text-primary-600 transition-all tap-highlight-transparent"
                    aria-label="Copy link"
                  >
                    <FiShare2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              {/* End divider */}
              <div className="my-10 sm:my-16">
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <div className="w-12 sm:w-16 h-px bg-charcoal-300 dark:bg-charcoal-600" />
                  <div className="w-2 h-2 bg-primary-600 rotate-45" />
                  <div className="w-12 sm:w-16 h-px bg-charcoal-300 dark:bg-charcoal-600" />
                </div>
              </div>

              {/* Author bio */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-4 sm:p-6 lg:p-8 bg-charcoal-50 dark:bg-charcoal-800 border-l-4 border-primary-600"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <img
                    src="/images/jiazhen-xie.jpeg"
                    alt={siteConfig.author.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover flex-shrink-0"
                  />
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold mb-2">
                      About {siteConfig.author.name}
                    </h3>
                    <p className="text-sm sm:text-base text-charcoal-600 dark:text-paper-400 mb-3 sm:mb-4">
                      Chinese engineering leader in the UK with{" "}
                      {siteConfig.author.experience}. {siteConfig.author.education}.
                      Specializing in engineering leadership, software architecture,
                      and building high-performing diverse teams.
                    </p>
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                      <Link
                        to="/about"
                        className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline"
                      >
                        Learn more →
                      </Link>
                      <a
                        href={siteConfig.author.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline"
                      >
                        Connect on LinkedIn →
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right sidebar - placeholder */}
            <aside className="lg:col-span-2 hidden lg:block order-3" />
          </div>
        </motion.div>

      </article>
    </>
  );
}
