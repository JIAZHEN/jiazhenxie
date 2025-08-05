import { Helmet } from "react-helmet-async";
import { siteConfig } from "../config/site";

function getStructuredData(
  type: string,
  title: string,
  description: string,
  image: string,
  url: string,
  publishedTime?: string,
  modifiedTime?: string,
  tags: string[] = [],
  readingTime?: string,
  wordCount?: number,
) {
  const authorData = {
    "@type": "Person",
    name: siteConfig.author.name,
    url: siteConfig.url,
    nationality: siteConfig.author.nationality,
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "University of Oxford",
      address: {
        "@type": "PostalAddress",
        addressCountry: "GB",
        addressLocality: "Oxford",
      },
    },
    jobTitle: "Engineering Leader",
    worksFor: {
      "@type": "Organization",
      name: "Technology Industry",
    },
    knowsAbout: siteConfig.author.expertise,
    email: siteConfig.author.email,
    sameAs: [siteConfig.author.linkedin, siteConfig.author.github],
  };

  if (type === "article") {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: title,
      description: description,
      image: {
        "@type": "ImageObject",
        url: image,
        width: 1200,
        height: 630,
      },
      author: authorData,
      publisher: {
        "@type": "Person",
        name: siteConfig.author.name,
        logo: {
          "@type": "ImageObject",
          url: image,
        },
      },
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      keywords: tags.join(", "),
      articleSection: "Engineering Leadership",
      inLanguage: "en-US",
      ...(wordCount && { wordCount: wordCount }),
      ...(readingTime && { timeRequired: readingTime }),
      about: [
        {
          "@type": "Thing",
          name: "Engineering Leadership",
        },
        {
          "@type": "Thing",
          name: "Software Engineering",
        },
        {
          "@type": "Thing",
          name: "Tech Management",
        },
      ],
    };
  }

  if (type === "profile") {
    return {
      "@context": "https://schema.org",
      ...authorData,
      description: description,
      image: image,
      url: url,
    };
  }

  // Default website/page schema
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description,
    url: url,
    image: image,
    author: authorData,
    publisher: authorData,
    inLanguage: "en-US",
    about: [
      {
        "@type": "Thing",
        name: "Engineering Leadership",
      },
      {
        "@type": "Thing",
        name: "Software Engineering",
      },
    ],
  };
}

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  keywords?: string[];
  canonicalUrl?: string;

  readingTime?: string;
  wordCount?: number;
}

export default function SEO({
  title,
  description,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  tags = [],
  keywords = [],
  canonicalUrl,
  readingTime,
  wordCount,
}: SEOProps) {
  const siteUrl = siteConfig.url;
  const fullTitle = title.includes(siteConfig.name)
    ? title
    : `${title} | ${siteConfig.name}`;
  const ogImage = image || siteConfig.ogImage;
  const pageKeywords = [...siteConfig.keywords, ...keywords, ...tags].join(
    ", ",
  );
  const currentUrl = canonicalUrl || siteUrl;

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content={siteConfig.author.name} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="en-US" />
      <meta name="revisit-after" content="7 days" />
      <link rel="canonical" href={currentUrl} />

      {/* Additional SEO meta tags */}
      <meta name="geo.region" content="GB" />
      <meta name="geo.placename" content="United Kingdom" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Open Graph meta tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage} />
      <meta
        property="og:image:alt"
        content={`${siteConfig.author.name} - Engineering Leader`}
      />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta
        name="twitter:creator"
        content={`@${siteConfig.author.name.replace(" ", "").toLowerCase()}`}
      />

      {/* Article specific meta tags */}
      {type === "article" && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          <meta property="article:author" content={siteConfig.author.name} />
          <meta property="article:section" content="Engineering Leadership" />
          {tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
          {readingTime && <meta name="twitter:label1" content="Reading time" />}
          {readingTime && <meta name="twitter:data1" content={readingTime} />}
          {wordCount && <meta name="twitter:label2" content="Word count" />}
          {wordCount && (
            <meta name="twitter:data2" content={wordCount.toString()} />
          )}
        </>
      )}

      {/* Comprehensive Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(
          getStructuredData(
            type,
            fullTitle,
            description,
            ogImage,
            currentUrl,
            publishedTime,
            modifiedTime,
            tags,
            readingTime,
            wordCount,
          ),
        )}
      </script>
    </Helmet>
  );
}
