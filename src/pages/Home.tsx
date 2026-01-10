import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { FiArrowRight, FiArrowDown, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";
import { siteConfig } from "../config/site";
import SEO from "../components/SEO";
import { getAllPosts } from "../lib/content";
import type { BlogPost } from "../types/blog";

// Animated counter component
const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

// Staggered text animation
const AnimatedText = ({ text, className = "" }: { text: string; className?: string }) => {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const posts = getAllPosts();
    setLatestPosts(posts.slice(0, 3)); // Get the 3 most recent posts
  }, []);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const roles = [
    "Engineering Leader",
    "Tech Strategist",
    "Team Builder",
    "Problem Solver",
  ];

  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: 14, suffix: "+", label: "Years Experience" },
    { value: 50, suffix: "+", label: "Projects Delivered" },
    { value: 100, suffix: "%", label: "Commitment" },
  ];

  return (
    <>
      <SEO
        title="Jiazhen Xie - Engineering Leader UK | Oxford Alumni | Chinese Tech Leader"
        description="Engineering leader in the UK with over a decade of experience. Oxford MSc graduate specializing in tech management, team building, and software architecture. Rare Chinese leader in UK tech industry with proven track record in scaling high-performing engineering teams."
        type="profile"
        keywords={[
          "engineering leader UK",
          "Oxford alumni tech",
          "Chinese engineering leader",
          "software engineering manager UK",
          "tech leadership",
          "cross-cultural leadership",
          "engineering management",
          "UK tech industry leader",
        ]}
        canonicalUrl="https://jiazhenxie.com"
      />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[100dvh] flex items-center -mx-4 -mt-6 sm:-mt-8 overflow-hidden pt-16 sm:pt-20">
        {/* Background Elements */}
        <div className="absolute inset-0 grid-overlay" />
        
        {/* Geometric shapes - smaller on mobile */}
        <motion.div
          className="shape-circle bg-primary-500 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] -right-[100px] sm:-right-[150px] md:-right-[200px] -top-[100px] sm:-top-[150px] md:-top-[200px]"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="shape-circle bg-sage-500 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] -left-[80px] sm:-left-[100px] md:-left-[150px] bottom-[10%]"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="shape-rect bg-primary-400 w-[100px] sm:w-[150px] md:w-[200px] h-[100px] sm:h-[150px] md:h-[200px] right-[5%] sm:right-[10%] bottom-[20%] rotate-12 hidden xs:block"
          animate={{ rotate: [12, 18, 12] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <div className="max-w-5xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-4 sm:mb-6 md:mb-8"
            >
              <span className="tag">Engineering Leader • Oxford MSc</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="headline-xl mb-4 sm:mb-6"
            >
              <AnimatedText text="Building the" />
              <br />
              <span className="text-primary-600 dark:text-primary-400">
                <AnimatedText text="future of tech" />
              </span>
              <br />
              <AnimatedText text="leadership." />
            </motion.h1>

            {/* Role Switcher */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="h-10 sm:h-12 mb-6 sm:mb-8 overflow-hidden"
            >
              <motion.div
                key={currentRoleIndex}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2 sm:gap-3"
              >
                <span className="w-8 sm:w-12 h-[2px] bg-primary-600" />
                <span className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-body text-charcoal-600 dark:text-paper-400">
                  {roles[currentRoleIndex]}
                </span>
              </motion.div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="body-lg text-charcoal-600 dark:text-paper-400 max-w-2xl mb-8 sm:mb-10"
            >
              I'm <strong className="text-charcoal-900 dark:text-paper-100">{siteConfig.name}</strong>, 
              an Oxford-educated engineering leader with over a decade building and scaling 
              high-performing teams across the UK tech industry. Bridging cultures, 
              driving innovation, and creating impact.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-12"
            >
              <Link to="/blog" className="btn-primary group w-full xs:w-auto">
                Read My Insights
                <FiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/solutions" className="btn-ghost group w-full xs:w-auto">
                Explore Solutions
                <FiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex items-center gap-4 sm:gap-6"
            >
              <span className="text-xs sm:text-sm font-medium uppercase tracking-widest text-charcoal-500 dark:text-paper-500 hidden xs:block">
                Connect
              </span>
              <div className="flex gap-2 sm:gap-3">
                <a
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 sm:p-3 border border-charcoal-200 dark:border-charcoal-700 text-charcoal-600 dark:text-paper-400 hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 tap-highlight-transparent"
                  aria-label="GitHub"
                >
                  <FiGithub className="w-5 h-5" />
                </a>
                <a
                  href={siteConfig.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 sm:p-3 border border-charcoal-200 dark:border-charcoal-700 text-charcoal-600 dark:text-paper-400 hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 tap-highlight-transparent"
                  aria-label="LinkedIn"
                >
                  <FiLinkedin className="w-5 h-5" />
                </a>
                <a
                  href={`mailto:${siteConfig.links.email}`}
                  className="p-3 sm:p-3 border border-charcoal-200 dark:border-charcoal-700 text-charcoal-600 dark:text-paper-400 hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 tap-highlight-transparent"
                  aria-label="Email"
                >
                  <FiMail className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator - hidden on small screens */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="hidden sm:flex absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="text-xs font-medium uppercase tracking-widest text-charcoal-400">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <FiArrowDown className="w-5 h-5 text-charcoal-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 md:py-24 -mx-4 px-4 bg-charcoal-900 dark:bg-charcoal-950 text-paper-100">
        <div className="container mx-auto">
          <div className="grid grid-cols-3 gap-4 sm:gap-8 lg:gap-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center"
              >
                <div className="font-serif text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-400 mb-2 sm:mb-4">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[10px] xs:text-xs sm:text-sm font-medium uppercase tracking-wider sm:tracking-widest text-paper-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-16 sm:py-20 lg:py-32 -mx-4 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="tag-primary mb-4 sm:mb-6 inline-block">About Me</span>
              <h2 className="headline-lg mb-6 sm:mb-8">
                Cross-cultural
                <span className="block text-primary-600 dark:text-primary-400">
                  leadership excellence.
                </span>
              </h2>
              <div className="space-y-4 sm:space-y-6 body-md text-charcoal-600 dark:text-paper-400">
                <p>
                  As a Chinese engineering leader in the UK, I bring a unique perspective 
                  that bridges Eastern and Western business cultures. This rare combination 
                  enables me to lead diverse teams with empathy, clarity, and cultural intelligence.
                </p>
                <p>
                  My approach centers on building high-trust environments where every team 
                  member can thrive. With an Oxford education and hands-on experience scaling 
                  teams at leading tech companies, I've developed frameworks that consistently 
                  deliver results.
                </p>
              </div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 mt-6 sm:mt-8 text-primary-600 dark:text-primary-400 font-medium hover:gap-3 transition-all duration-300 text-sm sm:text-base"
              >
                Learn more about my journey
                <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </motion.div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative order-first lg:order-last"
            >
              <div className="aspect-[4/5] sm:aspect-square bg-charcoal-100 dark:bg-charcoal-800 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 grid-overlay" />
                <div className="absolute top-4 sm:top-8 right-4 sm:right-8 w-20 sm:w-32 h-20 sm:h-32 bg-primary-500/20 rounded-full blur-2xl" />
                <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 w-16 sm:w-24 h-16 sm:h-24 bg-sage-500/20 rounded-full blur-2xl" />
                
                {/* Photo */}
                <img
                  src="/images/jiazhen-xie.jpeg"
                  alt="Jiazhen Xie"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Overlay with name */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/50 to-transparent p-4 sm:p-8">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">Jiazhen Xie</h3>
                  <p className="text-xs sm:text-sm text-paper-300 uppercase tracking-widest">
                    Engineering Leader
                  </p>
                </div>

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-l-2 border-primary-600" />
                <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-r-2 border-primary-600" />
                <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-l-2 border-primary-600" />
                <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-b-2 border-r-2 border-primary-600" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-16 sm:py-20 lg:py-32 -mx-4 px-4 bg-charcoal-50 dark:bg-charcoal-800/50">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-12 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="tag mb-3 sm:mb-4 inline-block">Latest Insights</span>
              <h2 className="headline-lg">
                From the
                <span className="text-primary-600 dark:text-primary-400"> blog.</span>
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium hover:gap-3 transition-all duration-300 text-sm sm:text-base"
              >
                View all posts
                <FiArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </motion.div>
          </div>

          {/* Latest Blog Posts - horizontal scroll on mobile */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {latestPosts.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`} className="card-editorial block p-4 sm:p-6 h-full tap-highlight-transparent">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
                    {post.tags[0] && (
                      <span className="tag text-[10px] sm:text-xs">{post.tags[0]}</span>
                    )}
                    <span className="text-[10px] sm:text-xs text-charcoal-500 dark:text-paper-500">
                      {new Date(post.date).toLocaleDateString("en-GB", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-semibold mb-2 sm:mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-charcoal-600 dark:text-paper-400 text-xs sm:text-sm line-clamp-3 mb-3 sm:mb-4">
                    {post.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-primary-600 dark:text-primary-400 font-medium">
                    Read more
                    <FiArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-32 -mx-4 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center px-2"
          >
            <h2 className="headline-lg mb-4 sm:mb-6">
              Ready to
              <span className="text-primary-600 dark:text-primary-400"> connect?</span>
            </h2>
            <p className="body-lg text-charcoal-600 dark:text-paper-400 mb-8 sm:mb-10">
              Whether you're looking for strategic guidance, technical leadership, 
              or just want to exchange ideas — I'd love to hear from you.
            </p>
            <Link to="/solutions" className="btn-primary group w-full xs:w-auto">
              Get in Touch
              <FiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
