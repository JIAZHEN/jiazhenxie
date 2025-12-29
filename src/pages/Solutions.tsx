import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiHome,
  FiBookOpen,
  FiUsers,
  FiServer,
  FiCode,
  FiClipboard,
  FiAward,
  FiFileText,
  FiCpu,
  FiHelpCircle,
  FiArrowRight,
  FiStar,
  FiShield,
  FiTarget,
  FiSend,
  FiCheckCircle,
  FiZap,
  FiGlobe,
  FiTrendingUp,
} from "react-icons/fi";
import SEO from "../components/SEO";
import { siteConfig } from "../config/site";

// Floating orb component for atmospheric effect - theme aware
const FloatingOrb = ({
  delay,
  duration,
  size,
  lightColor,
  darkColor,
  initialX,
  initialY,
}: {
  delay: number;
  duration: number;
  size: number;
  lightColor: string;
  darkColor: string;
  initialX: string;
  initialY: string;
}) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-30 dark:opacity-20 ${lightColor} ${darkColor}`}
    style={{
      width: size,
      height: size,
      left: initialX,
      top: initialY,
    }}
    animate={{
      x: [0, 30, -20, 0],
      y: [0, -40, 20, 0],
      scale: [1, 1.1, 0.9, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);


// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

// Pillar data
const pillars = [
  {
    icon: FiServer,
    title: "IT Execution",
    subtitle: "Websites • E-Commerce • Bespoke Systems",
    description:
      "From company landing pages to full e-commerce platforms and custom business systems — I design, build, and deliver production-ready solutions.",
    gradient: "from-blue-500 to-cyan-400",
    bgLight: "bg-blue-50",
    bgDark: "dark:bg-blue-900/20",
    features: ["E-Commerce & Websites", "Custom Business Apps", "API & Integrations"],
  },
  {
    icon: FiBookOpen,
    title: "Elite Access",
    subtitle: "7+/8+ Private School Strategy • Interview Prep",
    description:
      "Navigate the UK's elite education landscape. Strategic positioning, assessment preparation, and insider knowledge for competitive advantage.",
    gradient: "from-amber-500 to-orange-400",
    bgLight: "bg-amber-50",
    bgDark: "dark:bg-amber-900/20",
    features: ["School Selection", "Assessment Strategy", "Interview Coaching"],
  },
  {
    icon: FiUsers,
    title: "Career & Growth",
    subtitle: "Mentorship • CV Optimization • UK Market Integration",
    description:
      "Accelerate your UK career trajectory. From market positioning to personal branding, unlock opportunities others don't see.",
    gradient: "from-emerald-500 to-teal-400",
    bgLight: "bg-emerald-50",
    bgDark: "dark:bg-emerald-900/20",
    features: ["Career Strategy", "Personal Branding", "Network Building"],
  },
];

// Challenge cards data
const challenges = [
  {
    icon: FiCpu,
    question: "Need a website or system built?",
    description:
      "From e-commerce stores to company websites and custom business apps — I deliver production-ready solutions, not just advice.",
    tag: "Businesses",
  },
  {
    icon: FiHelpCircle,
    question: "Confused by the 7+ process?",
    description:
      "The UK private school system is opaque by design. I've decoded the pathway and can map yours.",
    tag: "Parents",
  },
  {
    icon: FiTarget,
    question: "Stuck in your career?",
    description:
      "Hitting an invisible ceiling? I help international professionals break through UK-specific barriers.",
    tag: "Professionals",
  },
  {
    icon: FiStar,
    question: "New to the UK?",
    description:
      "Relocating is complex. I provide the frameworks, contacts, and cultural insights to accelerate your integration.",
    tag: "New Arrivals",
  },
];

// Referral sources
const referralSources = [
  "LinkedIn",
  "Personal Referral",
  "Professional Network",
  "Community Event",
  "Previous Collaboration",
  "Other",
];

// Web3Forms access key
const WEB3FORMS_ACCESS_KEY = "51313b96-4384-4004-aac4-2313c03e7dc8";

export default function Solutions() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interest: "",
    referralSource: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          from_name: formData.name,
          email: formData.email,
          subject: `New Solutions Inquiry: ${formData.interest}`,
          message: `
Name: ${formData.name}
Email: ${formData.email}
Area of Interest: ${formData.interest}
Referral Source: ${formData.referralSource}

Message:
${formData.message}
          `.trim(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          interest: "",
          referralSource: "",
          message: "",
        });
      } else {
        setSubmitError("Something went wrong. Please try again or email me directly.");
      }
    } catch {
      setSubmitError("Network error. Please try again or email me directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <SEO
        title="Solutions - Jiazhen Xie | Your Strategic Partner in the UK"
        description="Connector & Enabler for businesses, tech leaders, and ambitious families in the UK. IT execution, elite education strategy, and career growth services."
        type="website"
        keywords={[
          "UK tech consultant",
          "7+ school preparation",
          "UK career mentor",
          "tech leadership consulting",
          "UK private school advisor",
          "software architecture consultant UK",
        ]}
        canonicalUrl="https://jiazhenxie.com/solutions"
      />

      {/* Hero Section - Theme Aware */}
      <section className="relative min-h-screen flex items-center -mx-4 -mt-8 px-4 overflow-hidden">
        {/* Theme-aware gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950" />
        
        {/* Floating orbs for atmosphere - theme aware */}
        <FloatingOrb delay={0} duration={8} size={400} lightColor="bg-blue-400" darkColor="dark:bg-blue-500" initialX="10%" initialY="20%" />
        <FloatingOrb delay={2} duration={10} size={300} lightColor="bg-cyan-300" darkColor="dark:bg-cyan-500" initialX="60%" initialY="60%" />
        <FloatingOrb delay={4} duration={12} size={350} lightColor="bg-amber-300" darkColor="dark:bg-amber-500" initialX="80%" initialY="10%" />
        <FloatingOrb delay={1} duration={9} size={250} lightColor="bg-primary-400" darkColor="dark:bg-primary-500" initialX="30%" initialY="70%" />

        {/* Grid pattern overlay - theme aware */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Main content */}
        <div className="container mx-auto relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Top badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gray-900/5 dark:bg-white/5 border border-gray-900/10 dark:border-white/10 backdrop-blur-sm">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  Available for new partnerships
                </span>
              </div>
            </motion.div>

            {/* Main headline - Staggered reveal */}
            <div className="text-center mb-12">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
              >
                <span className="block">Your Strategic</span>
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-amber-500 dark:from-blue-400 dark:via-cyan-400 dark:to-amber-400 bg-clip-text text-transparent"
                >
                  Bridge to the UK
                </motion.span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
              >
                I connect <span className="text-gray-900 dark:text-white font-medium">ambitious tech leaders</span> and{" "}
                <span className="text-gray-900 dark:text-white font-medium">discerning families</span> to the opportunities
                that transform their UK journey.
              </motion.p>
            </div>

            {/* Two pathways - Visual bridge concept */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-12"
            >
              {/* Tech Leaders Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group relative p-8 rounded-2xl bg-white dark:bg-white/5 border border-blue-200 dark:border-blue-500/20 shadow-lg shadow-blue-500/5 dark:shadow-none backdrop-blur-sm cursor-pointer overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                      <FiServer className="w-6 h-6" />
                    </div>
                    <FiArrowRight className="w-5 h-5 text-blue-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Businesses & Startups
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Need a website, e-commerce platform, or custom system? I design, build, and deliver.
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {["Websites", "E-Commerce", "Bespoke Systems"].map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Families Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group relative p-8 rounded-2xl bg-white dark:bg-white/5 border border-amber-200 dark:border-amber-500/20 shadow-lg shadow-amber-500/5 dark:shadow-none backdrop-blur-sm cursor-pointer overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                      <FiBookOpen className="w-6 h-6" />
                    </div>
                    <FiArrowRight className="w-5 h-5 text-amber-500 dark:text-amber-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Ambitious Families
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Navigate the UK's elite 7+/8+ private school landscape with insider strategy.
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {["7+ Strategy", "Interview Prep", "School Selection"].map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg shadow-gray-900/20 dark:shadow-white/10"
              >
                Start a Conversation
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#pillars"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gray-900/5 dark:bg-white/5 text-gray-900 dark:text-white font-medium text-lg border border-gray-900/10 dark:border-white/10 hover:bg-gray-900/10 dark:hover:bg-white/10 transition-all"
              >
                Explore Services
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex flex-wrap justify-center items-center gap-8 text-gray-500 dark:text-gray-500"
            >
              <div className="flex items-center gap-2">
                <FiAward className="w-5 h-5 text-amber-500" />
                <span className="text-sm">Oxford MSc</span>
              </div>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
              <div className="flex items-center gap-2">
                <FiTrendingUp className="w-5 h-5 text-emerald-500" />
                <span className="text-sm">14+ Years UK Experience</span>
              </div>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
              <div className="flex items-center gap-2">
                <FiGlobe className="w-5 h-5 text-blue-500" />
                <span className="text-sm">Cross-Cultural Expert</span>
              </div>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />
              <div className="flex items-center gap-2">
                <FiZap className="w-5 h-5 text-cyan-500" />
                <span className="text-sm">50+ Projects</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-gray-300 dark:border-white/20 flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-white/60" />
          </motion.div>
        </motion.div>
      </section>

      {/* Enabler Framework - 3 Pillars */}
      <section id="pillars" className="py-24 lg:py-32 -mx-4 px-4 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16 lg:mb-20"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-6"
            >
              The Enabler Framework
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
            >
              Three Pillars of
              <span className="block bg-gradient-to-r from-primary-600 to-cyan-500 bg-clip-text text-transparent">
                Strategic Support
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            >
              A holistic approach to unlocking your potential in the UK —
              whether in technology, education, or career development.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group"
              >
                <div className="h-full p-8 lg:p-10 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm group-hover:shadow-lg group-hover:border-gray-300 dark:group-hover:border-gray-600 transition-all duration-300">
                  {/* Icon */}
                  <div
                    className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${pillar.gradient} text-white shadow-lg mb-6`}
                  >
                    <pillar.icon className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 tracking-wide">
                    {pillar.subtitle}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {pillar.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3">
                    {pillar.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-gray-600 dark:text-gray-400"
                      >
                        <FiCheckCircle
                          className={`w-5 h-5 flex-shrink-0 text-primary-500`}
                        />
                        <span className="text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Proven Track Record */}
      <section className="py-24 lg:py-32 -mx-4 px-4">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            {/* Content */}
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold mb-6">
                <FiShield className="w-4 h-4" />
                Proven Track Record
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
                Expertise Forged in
                <span className="block bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  Experience.
                </span>
              </h2>
              <div className="prose prose-lg dark:prose-invert">
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  I don't offer theories; I offer{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    blueprints
                  </span>
                  .
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  Having navigated the UK's tech and education systems for over
                  a decade, I provide the{" "}
                  <span className="italic">'insider' logic</span> that agencies
                  miss. From scaling engineering teams at leading tech companies
                  to guiding families through the intricacies of the 7+ and 8+
                  process — my recommendations come from firsthand success, not
                  secondhand research.
                </p>
              </div>
            </motion.div>

            {/* Stats/Credentials Grid */}
            <motion.div variants={fadeInUp}>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <FiCode className="w-8 h-8 text-primary-500 mb-4" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    14+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Years in UK Tech
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <FiAward className="w-8 h-8 text-amber-500 mb-4" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    Oxford
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    MSc Graduate
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <FiClipboard className="w-8 h-8 text-emerald-500 mb-4" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    50+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Projects Delivered
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <FiFileText className="w-8 h-8 text-violet-500 mb-4" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    Leader
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Engineering Manager
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Common Challenges Grid */}
      <section className="py-24 lg:py-32 -mx-4 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
            >
              Common Challenges
              <span className="block text-primary-600 dark:text-primary-400">
                I Help Solve
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
            >
              Click on a challenge to learn how I can help
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6"
          >
            {challenges.map((challenge, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                onClick={() =>
                  setActiveChallenge(activeChallenge === index ? null : index)
                }
                className={`relative p-8 rounded-2xl cursor-pointer transition-all duration-500 border ${
                  activeChallenge === index
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent shadow-2xl scale-[1.02]"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700"
                }`}
              >
                {/* Tag */}
                <span
                  className={`absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-semibold ${
                    activeChallenge === index
                      ? "bg-white/20 dark:bg-gray-900/20"
                      : "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                  }`}
                >
                  {challenge.tag}
                </span>

                <div className="flex items-start gap-5">
                  <div
                    className={`p-3 rounded-xl ${
                      activeChallenge === index
                        ? "bg-white/10 dark:bg-gray-900/10"
                        : "bg-gradient-to-br from-primary-500 to-cyan-500 text-white"
                    }`}
                  >
                    <challenge.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3">
                      {challenge.question}
                    </h3>
                    <p
                      className={`leading-relaxed ${
                        activeChallenge === index
                          ? "text-white/80 dark:text-gray-700"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {challenge.description}
                    </p>

                    {/* Expanded action */}
                    {activeChallenge === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-6 pt-6 border-t border-white/20 dark:border-gray-800/30"
                      >
                        <a
                          href="#contact"
                          className="inline-flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all"
                        >
                          Let's discuss your situation
                          <FiArrowRight className="w-4 h-4" />
                        </a>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Friend of the Community CTA */}
      <section
        id="contact"
        className="py-24 lg:py-32 -mx-4 px-4 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
      >
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/10 dark:bg-white/10 text-gray-700 dark:text-white/80 text-sm font-medium mb-6">
                <FiUsers className="w-4 h-4" />
                Friend of the Community
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                Let's Start a
                <span className="block bg-gradient-to-r from-primary-600 to-cyan-500 dark:from-primary-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Conversation.
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Whether you were referred by a friend, found me through a
                professional network, or are simply exploring options — I'd love
                to hear about your goals.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-12 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-none"
                >
                  <div className="inline-flex p-4 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mb-6">
                    <FiCheckCircle className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Message Received!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                    Thank you for reaching out. I'll review your message and get
                    back to you within 24–48 hours.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="p-8 lg:p-12 rounded-2xl bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-none"
                >
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Interest Area */}
                    <div>
                      <label
                        htmlFor="interest"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Area of Interest *
                      </label>
                      <select
                        id="interest"
                        name="interest"
                        required
                        value={formData.interest}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-white dark:bg-gray-900">
                          Select an option
                        </option>
                        <option value="tech" className="bg-white dark:bg-gray-900">
                          IT Execution & Tech Leadership
                        </option>
                        <option value="education" className="bg-white dark:bg-gray-900">
                          Elite Education Strategy (7+/8+)
                        </option>
                        <option value="career" className="bg-white dark:bg-gray-900">
                          Career & Growth Mentoring
                        </option>
                        <option value="multiple" className="bg-white dark:bg-gray-900">
                          Multiple Areas
                        </option>
                      </select>
                    </div>

                    {/* Referral Source */}
                    <div>
                      <label
                        htmlFor="referralSource"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        How did you hear about me? *
                      </label>
                      <select
                        id="referralSource"
                        name="referralSource"
                        required
                        value={formData.referralSource}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-white dark:bg-gray-900">
                          Select a source
                        </option>
                        {referralSources.map((source) => (
                          <option
                            key={source}
                            value={source.toLowerCase().replace(" ", "-")}
                            className="bg-white dark:bg-gray-900"
                          >
                            {source}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-8">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Tell me about your situation *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                      placeholder="Share some context about what you're looking for..."
                    />
                  </div>

                  {/* Error Message */}
                  {submitError && (
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                      {submitError}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-4 rounded-lg bg-gradient-to-r from-primary-500 to-cyan-500 text-white font-semibold shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend className="w-5 h-5" />
                        Start the Conversation
                      </>
                    )}
                  </button>

                  {/* Privacy note */}
                  <p className="mt-6 text-sm text-gray-500">
                    Your information is kept confidential. I respond to all
                    inquiries personally within 48 hours.
                  </p>
                </form>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 -mx-4 px-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Questions? Reach out directly at
          </p>
          <a
            href={`mailto:${siteConfig.links.email}`}
            className="text-xl font-semibold text-primary-600 dark:text-primary-400 hover:underline"
          >
            {siteConfig.links.email}
          </a>
        </div>
      </section>
    </>
  );
}
