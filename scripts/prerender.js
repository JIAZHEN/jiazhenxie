import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postsDir = path.join(__dirname, '../src/content/posts');
const distDir = path.join(__dirname, '../dist');
const templatePath = path.join(distDir, 'index.html');

// Site configuration
const siteConfig = {
  name: 'Jiazhen Xie',
  url: 'https://jiazhenxie.com',
  author: {
    name: 'Jiazhen Xie',
    education: 'MSc Software Engineering, University of Oxford',
    location: 'United Kingdom',
  }
};

// Static pages to pre-render
const staticPages = [
  {
    path: '/about',
    title: 'About Jiazhen Xie | Engineering Leader UK | Oxford Alumni',
    description: 'Learn about Jiazhen Xie - Chinese engineering leader in the UK with over a decade of experience. Oxford MSc graduate specializing in engineering leadership, software architecture, and building high-performing teams.',
    keywords: ['about jiazhen xie', 'engineering leader UK', 'Oxford alumni', 'Chinese tech leader'],
    type: 'profile',
  },
  {
    path: '/blog',
    title: 'Engineering Leadership Blog | Tech Insights by Jiazhen Xie',
    description: 'Insights on engineering leadership, software architecture, team management, and technical best practices from a Chinese engineering leader in the UK tech industry.',
    keywords: ['engineering leadership blog', 'tech management insights', 'software engineering blog'],
    type: 'blog',
  },
  {
    path: '/projects',
    title: 'Projects & Portfolio | Jiazhen Xie',
    description: 'Explore projects and technical work by Jiazhen Xie - from distributed systems to full-stack applications, showcasing engineering excellence and innovation.',
    keywords: ['software projects', 'engineering portfolio', 'technical projects'],
    type: 'website',
  },
  {
    path: '/solutions',
    title: 'Engineering Solutions & Services | Jiazhen Xie',
    description: 'Engineering leadership consulting, technical advisory, and software architecture solutions. Helping teams build scalable systems and high-performing engineering cultures.',
    keywords: ['engineering consulting', 'technical advisory', 'software architecture consulting'],
    type: 'website',
  },
];

// ============ Utility Functions ============

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function stripMarkdown(content) {
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/#+\s*/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/[-*+]\s+/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// ============ Meta Tag Generators ============

function generateMetaTags({ url, title, description, keywords, image, type, publishedTime }) {
  const ogType = type === 'article' ? 'article' : type === 'blog' ? 'blog' : 'website';
  
  let meta = `
    <!-- Primary Meta Tags -->
    <title>${escapeHtml(title)}</title>
    <meta name="title" content="${escapeHtml(title)}" />
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="author" content="${siteConfig.author.name}" />
    <meta name="keywords" content="${keywords.map(k => escapeHtml(k)).join(', ')}" />
    <link rel="canonical" href="${url}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${ogType}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:site_name" content="${siteConfig.name}" />`;
  
  if (publishedTime) {
    meta += `
    <meta property="article:published_time" content="${publishedTime}" />
    <meta property="article:author" content="${siteConfig.author.name}" />`;
    keywords.forEach(tag => {
      meta += `
    <meta property="article:tag" content="${escapeHtml(tag)}" />`;
    });
  }
  
  meta += `
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${url}" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${image}" />
  `;
  
  return meta;
}

function generateStructuredData({ url, title, description, type, keywords, image, publishedTime }) {
  let schema;
  
  if (type === 'article') {
    schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": title,
      "description": description,
      "author": { "@type": "Person", "name": siteConfig.author.name, "url": siteConfig.url },
      "datePublished": publishedTime,
      "dateModified": publishedTime,
      "publisher": { "@type": "Person", "name": siteConfig.author.name, "url": siteConfig.url },
      "mainEntityOfPage": { "@type": "WebPage", "@id": url },
      "url": url,
      "keywords": keywords.join(', '),
      ...(image && { image })
    };
  } else if (type === 'profile') {
    schema = {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "mainEntity": {
        "@type": "Person",
        "name": siteConfig.author.name,
        "url": siteConfig.url,
        "jobTitle": "Engineering Leader",
        "alumniOf": { "@type": "EducationalOrganization", "name": "University of Oxford" },
        "nationality": "Chinese"
      }
    };
  } else if (type === 'blog') {
    schema = {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": title,
      "description": description,
      "url": url,
      "author": { "@type": "Person", "name": siteConfig.author.name, "url": siteConfig.url }
    };
  } else {
    schema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": title,
      "description": description,
      "url": url,
      "author": { "@type": "Person", "name": siteConfig.author.name, "url": siteConfig.url }
    };
  }
  
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

// ============ HTML Generation ============

function generateHtml(template, { url, title, description, keywords, image, type, publishedTime, noscriptContent }) {
  const metaTags = generateMetaTags({ url, title, description, keywords, image, type, publishedTime });
  const structuredData = generateStructuredData({ url, title, description, type, keywords, image, publishedTime });
  
  let html = template;
  
  // Replace the title
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  
  // Insert meta tags before </head>
  html = html.replace('</head>', `${metaTags}\n    ${structuredData}\n  </head>`);
  
  // Insert noscript content after <div id="root">
  if (noscriptContent) {
    html = html.replace('<div id="root"></div>', `<div id="root"></div>${noscriptContent}`);
  }
  
  return html;
}

// ============ Pre-render Functions ============

function prerenderStaticPages(template) {
  console.log('📄 Static Pages:');
  let count = 0;
  
  for (const page of staticPages) {
    const pagePath = page.path.substring(1);
    const pageDir = path.join(distDir, pagePath);
    fs.mkdirSync(pageDir, { recursive: true });
    
    const noscriptContent = `
    <noscript>
      <div style="max-width: 800px; margin: 0 auto; padding: 40px 20px; font-family: system-ui, sans-serif;">
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">${escapeHtml(page.title)}</h1>
        <p style="color: #666; line-height: 1.6;">${escapeHtml(page.description)}</p>
        <p style="margin-top: 2rem;"><a href="/" style="color: #C45A3B;">← Back to Home</a></p>
      </div>
    </noscript>`;
    
    const html = generateHtml(template, {
      url: `${siteConfig.url}${page.path}`,
      title: page.title,
      description: page.description,
      keywords: page.keywords,
      image: `${siteConfig.url}/images/jiazhen-xie.jpeg`,
      type: page.type,
      noscriptContent
    });
    
    fs.writeFileSync(path.join(pageDir, 'index.html'), html);
    console.log(`   ✅ ${page.path}/`);
    count++;
  }
  
  return count;
}

function prerenderBlogPosts(template) {
  console.log('\n📝 Blog Posts:');
  let count = 0;
  
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  
  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data: frontMatter, content: postContent } = matter(content);
    
    if (frontMatter.draft) {
      console.log(`   ⏭️  Skipping draft: ${file}`);
      continue;
    }
    
    const slug = file.replace(/\.md$/, '');
    const url = `${siteConfig.url}/blog/${slug}`;
    const description = frontMatter.description || stripMarkdown(postContent).substring(0, 160);
    const plainContent = stripMarkdown(postContent);
    const excerpt = plainContent.substring(0, 500) + (plainContent.length > 500 ? '...' : '');
    
    const noscriptContent = `
    <noscript>
      <article style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: system-ui, sans-serif;">
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">${escapeHtml(frontMatter.title)}</h1>
        <p style="color: #666; margin-bottom: 1rem;">
          By ${siteConfig.author.name} | ${formatDate(frontMatter.date)}
        </p>
        ${frontMatter.tags?.length ? `<p style="margin-bottom: 1rem;">Tags: ${frontMatter.tags.map(t => escapeHtml(t)).join(', ')}</p>` : ''}
        <div style="line-height: 1.6;"><p>${escapeHtml(excerpt)}</p></div>
        <p style="margin-top: 2rem;"><a href="/" style="color: #C45A3B;">← Back to Home</a></p>
      </article>
    </noscript>`;
    
    const html = generateHtml(template, {
      url,
      title: `${frontMatter.title} | ${siteConfig.name}`,
      description,
      keywords: frontMatter.tags || [],
      image: frontMatter.image || `${siteConfig.url}/images/jiazhen-xie.jpeg`,
      type: 'article',
      publishedTime: frontMatter.date,
      noscriptContent
    });
    
    const postDir = path.join(distDir, 'blog', slug);
    fs.mkdirSync(postDir, { recursive: true });
    fs.writeFileSync(path.join(postDir, 'index.html'), html);
    
    console.log(`   ✅ /blog/${slug}/`);
    count++;
  }
  
  return count;
}

// ============ Main ============

async function prerender() {
  console.log('\n🚀 Pre-rendering pages for SEO...\n');
  
  if (!fs.existsSync(distDir)) {
    console.error('❌ dist directory not found. Run "vite build" first.');
    process.exit(1);
  }
  
  if (!fs.existsSync(templatePath)) {
    console.error('❌ index.html not found in dist directory.');
    process.exit(1);
  }
  
  const template = fs.readFileSync(templatePath, 'utf-8');
  
  const staticCount = prerenderStaticPages(template);
  const blogCount = prerenderBlogPosts(template);
  
  console.log(`\n🎉 Pre-rendered ${staticCount + blogCount} pages total!`);
  console.log('   • Static pages: ' + staticCount);
  console.log('   • Blog posts: ' + blogCount);
  console.log('\n📌 All pages now return HTTP 200 with proper SEO meta tags.\n');
}

prerender().catch(console.error);
