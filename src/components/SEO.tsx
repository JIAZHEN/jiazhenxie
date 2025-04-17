import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
}

export default function SEO({
  title,
  description,
  image = "https://jiazhenxie.com/og-image.jpg",
  type = "website",
  publishedTime,
  modifiedTime,
  tags = [],
}: SEOProps) {
  const siteUrl = "https://jiazhenxie.com";
  const fullTitle = `${title} | Jiazhen Xie`;

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="author" content="Jiazhen Xie" />

      {/* Open Graph meta tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Jiazhen Xie" />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Article specific meta tags */}
      {type === "article" && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === "article" ? "BlogPosting" : "WebPage",
          headline: fullTitle,
          description: description,
          image: image,
          author: {
            "@type": "Person",
            name: "Jiazhen Xie",
            url: siteUrl,
          },
          publisher: {
            "@type": "Person",
            name: "Jiazhen Xie",
            url: siteUrl,
          },
          ...(type === "article" && {
            datePublished: publishedTime,
            dateModified: modifiedTime || publishedTime,
            keywords: tags.join(", "),
          }),
        })}
      </script>
    </Helmet>
  );
}
