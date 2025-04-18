import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { BlogPost, getBlogPost } from "../lib/markdown";
import { formatDate } from "../lib/utils";
import SEO from "../components/SEO";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPost() {
      if (slug) {
        try {
          const postData = await getBlogPost(slug);
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

  return (
    <>
      <SEO
        title={post.title}
        description={post.description || post.content.substring(0, 160)}
        type="article"
        publishedTime={post.date}
        tags={post.tags}
        image={post.image}
      />
      <article className="container mx-auto px-4 py-8 max-w-4xl mt-16">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
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
        </header>

        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </>
  );
}
