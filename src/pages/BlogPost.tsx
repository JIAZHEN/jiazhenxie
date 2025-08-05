import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { FiClock, FiUser, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { BlogPost, getBlogPost } from "../lib/markdown";
import { getAllPosts } from "../lib/content";
import { formatDate, calculateReadingTime, getWordCount } from "../lib/utils";
import { siteConfig } from "../config/site";
import SEO from "../components/SEO";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPost() {
      if (slug) {
        try {
          const decodedSlug = decodeURIComponent(slug);
          const postData = await getBlogPost(decodedSlug);
          setPost(postData);

          // Get related posts based on tags
          const allPosts = getAllPosts();
          const related = allPosts
            .filter((p) => p.slug !== decodedSlug)
            .filter(
              (p) =>
                postData && p.tags.some((tag) => postData.tags.includes(tag)),
            )
            .slice(0, 3);
          setRelatedPosts(related);

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
  }, [slug]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>
    );
  }

  if (!post) {
    return <div className="container mx-auto px-4 py-8">Post not found</div>;
  }

  const readingTime = calculateReadingTime(post.content);
  const wordCount = getWordCount(post.content);
  const isLeadershipPost = post.tags.some(
    (tag) =>
      tag.includes("leadership") ||
      tag.includes("management") ||
      tag.includes("engineering-leadership"),
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
      <article className="container mx-auto px-4 py-8 max-w-4xl mt-16">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            to="/blog"
            className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
          >
            <FiArrowLeft className="mr-1" />
            Back to Engineering Leadership Blog
          </Link>
        </nav>

        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-1">
              <FiUser className="w-4 h-4" />
              <span>{siteConfig.author.name}</span>
            </div>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <div className="flex items-center gap-1">
              <FiClock className="w-4 h-4" />
              <span>{readingTime}</span>
            </div>
            <span>{wordCount} words</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/blog?tag=${encodeURIComponent(tag)}`}
                className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-xs hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </header>

        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Author bio */}
        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {siteConfig.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                About {siteConfig.author.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Chinese engineering leader in the UK with{" "}
                {siteConfig.author.experience}.{siteConfig.author.education}.
                Specializing in engineering leadership, software architecture,
                and building high-performing diverse teams.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/about"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Learn more about my background
                </Link>
                <a
                  href={siteConfig.author.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Connect on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">
              Related Engineering Leadership Posts
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  to={`/blog/${relatedPost.slug}`}
                  className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                >
                  <h3 className="font-semibold mb-2 text-sm line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs mb-2 line-clamp-2">
                    {relatedPost.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <time>{formatDate(relatedPost.date)}</time>
                    <FiArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
