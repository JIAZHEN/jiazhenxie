import { useState } from "react";
import { motion } from "framer-motion";
import {
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
  FiArrowDown,
} from "react-icons/fi";
import SEO from "../components/SEO";
import { siteConfig } from "../config/site";

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
  hidden: { opacity: 0, scale: 0.95 },
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
    color: "bg-primary-600",
    borderColor: "border-primary-600",
    features: ["E-Commerce & Websites", "Custom Business Apps", "API & Integrations"],
  },
  {
    icon: FiBookOpen,
    title: "Elite Access",
    subtitle: "7+/8+ Private School Strategy • Interview Prep",
    description:
      "Navigate the UK's elite education landscape. Strategic positioning, assessment preparation, and insider knowledge for competitive advantage.",
    color: "bg-sage-600",
    borderColor: "border-sage-600",
    features: ["School Selection", "Assessment Strategy", "Interview Coaching"],
  },
  {
    icon: FiUsers,
    title: "Career & Growth",
    subtitle: "Mentorship • CV Optimization • UK Market Integration",
    description:
      "Accelerate your UK career trajectory. From market positioning to personal branding, unlock opportunities others don't see.",
    color: "bg-charcoal-700",
    borderColor: "border-charcoal-700",
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
    contactMethod: "",
    contactHandle: "",
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
Preferred Contact: ${formData.contactMethod}${formData.contactHandle ? ` - ${formData.contactHandle}` : ""}
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
          contactMethod: "",
          contactHandle: "",
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

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center -mx-4 -mt-6 sm:-mt-8 px-4 overflow-hidden pt-16 sm:pt-20">
        {/* Background */}
        <div className="absolute inset-0 grid-overlay" />
        
        {/* Geometric shapes - responsive */}
        <motion.div
          className="shape-circle bg-primary-500 w-[250px] sm:w-[350px] md:w-[500px] h-[250px] sm:h-[350px] md:h-[500px] -right-[100px] sm:-right-[150px] md:-right-[200px] top-[10%]"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="shape-circle bg-sage-500 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] -left-[80px] sm:-left-[100px] md:-left-[150px] bottom-[20%]"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity }}
        />
        <motion.div
          className="shape-rect bg-primary-400 w-[80px] sm:w-[100px] md:w-[150px] h-[80px] sm:h-[100px] md:h-[150px] right-[10%] sm:right-[15%] bottom-[30%] rotate-12 hidden xs:block"
          animate={{ rotate: [12, 20, 12] }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        {/* Content */}
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl">
            {/* Status badge - hidden on very small screens */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 sm:mb-8 hidden xs:block"
            >
              <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 border border-charcoal-300 dark:border-charcoal-600">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sage-500" />
                </span>
                <span className="text-xs sm:text-sm font-medium text-charcoal-600 dark:text-paper-400">
                  Available for new partnerships
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6 sm:mb-8"
            >
              Your strategic
              <span className="block text-primary-600 dark:text-primary-400">
                bridge to the UK.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-lg lg:text-xl text-charcoal-600 dark:text-paper-400 max-w-2xl mb-8 sm:mb-12"
            >
              I connect{" "}
              <strong className="text-charcoal-900 dark:text-paper-100">
                ambitious tech leaders
              </strong>{" "}
              and{" "}
              <strong className="text-charcoal-900 dark:text-paper-100">
                discerning families
              </strong>{" "}
              to the opportunities that transform their UK journey.
            </motion.p>

            {/* Two pathway cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid gap-4 sm:gap-6 md:grid-cols-2 mb-8 sm:mb-12"
            >
              {/* Tech/Business Card */}
              <a
                href="#pillars"
                className="card-editorial group p-5 sm:p-8 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="p-2.5 sm:p-3 bg-primary-600 text-white">
                    <FiServer className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <FiArrowRight className="w-5 h-5 text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
                  Businesses & Startups
                </h3>
                <p className="text-sm sm:text-base text-charcoal-600 dark:text-paper-400 mb-4 sm:mb-6">
                  Need a website, e-commerce platform, or custom system? I design, build, and deliver.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Websites", "E-Commerce", "Bespoke Systems"].map((tag) => (
                    <span key={tag} className="tag-primary text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </a>

              {/* Families Card */}
              <a
                href="#pillars"
                className="card-editorial group p-5 sm:p-8 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="p-2.5 sm:p-3 bg-sage-600 text-white">
                    <FiBookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <FiArrowRight className="w-5 h-5 text-sage-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
                  Ambitious Families
                </h3>
                <p className="text-sm sm:text-base text-charcoal-600 dark:text-paper-400 mb-4 sm:mb-6">
                  Navigate the UK's elite 7+/8+ private school landscape with insider strategy.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["7+ Strategy", "Interview Prep", "School Selection"].map((tag) => (
                    <span key={tag} className="tag text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 sm:mb-16"
            >
              <a href="#contact" className="btn-primary group justify-center">
                Start a Conversation
                <FiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a href="#pillars" className="btn-ghost justify-center">
                Explore Services
              </a>
            </motion.div>

            {/* Trust indicators - grid on mobile, inline on desktop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="grid grid-cols-2 gap-x-6 gap-y-4 pb-6 sm:pb-0 sm:flex sm:flex-wrap sm:items-center sm:gap-6 lg:gap-8 text-charcoal-500 dark:text-paper-500"
            >
              <div className="flex items-center gap-3">
                <FiAward className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <span className="text-sm font-medium">Oxford MSc</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-charcoal-300 dark:bg-charcoal-600" />
              <div className="flex items-center gap-3">
                <FiTrendingUp className="w-5 h-5 text-sage-600 flex-shrink-0" />
                <span className="text-sm font-medium">15+ Years UK</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-charcoal-300 dark:bg-charcoal-600" />
              <div className="flex items-center gap-3">
                <FiGlobe className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <span className="text-sm font-medium">Cross-Cultural</span>
              </div>
              <div className="hidden lg:block w-px h-4 bg-charcoal-300 dark:bg-charcoal-600" />
              <div className="flex items-center gap-3">
                <FiZap className="w-5 h-5 text-sage-600 flex-shrink-0" />
                <span className="text-sm font-medium">50+ Projects</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator - hidden on small screens */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2"
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

      {/* Three Pillars Section */}
      <section id="pillars" className="py-16 sm:py-20 lg:py-32 -mx-4 px-4 bg-charcoal-50 dark:bg-charcoal-800/50">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-10 sm:mb-16"
          >
            <motion.span
              variants={fadeInUp}
              className="tag-primary mb-4 sm:mb-6 inline-block"
            >
              The Enabler Framework
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="headline-lg mb-4 sm:mb-6"
            >
              Three pillars of
              <span className="block text-primary-600 dark:text-primary-400">
                strategic support.
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="body-lg text-charcoal-600 dark:text-paper-400 max-w-2xl mx-auto"
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
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          >
            {pillars.map((pillar, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="group"
              >
                <div className={`card-editorial h-full p-5 sm:p-6 lg:p-8 border-l-4 ${pillar.borderColor}`}>
                  {/* Icon */}
                  <div className={`inline-flex p-3 sm:p-4 ${pillar.color} text-white mb-4 sm:mb-6`}>
                    <pillar.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>

                  {/* Content */}
                  <h3 className="font-serif text-xl sm:text-2xl font-bold mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-charcoal-500 dark:text-paper-500 mb-3 sm:mb-4 uppercase tracking-wider">
                    {pillar.subtitle}
                  </p>
                  <p className="text-sm sm:text-base text-charcoal-600 dark:text-paper-400 mb-4 sm:mb-6">
                    {pillar.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 sm:space-y-3">
                    {pillar.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 sm:gap-3 text-charcoal-600 dark:text-paper-400"
                      >
                        <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-primary-600 dark:text-primary-400" />
                        <span className="text-xs sm:text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Track Record Section */}
      <section className="py-16 sm:py-20 lg:py-32 -mx-4 px-4">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center"
          >
            {/* Content */}
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 tag mb-4 sm:mb-6">
                <FiShield className="w-4 h-4" />
                Proven Track Record
              </span>
              <h2 className="headline-lg mb-6 sm:mb-8">
                Expertise forged in
                <span className="block text-primary-600 dark:text-primary-400">
                  experience.
                </span>
              </h2>
              <div className="space-y-4 sm:space-y-6 body-md text-charcoal-600 dark:text-paper-400">
                <p>
                  I don't offer theories; I offer{" "}
                  <strong className="text-charcoal-900 dark:text-paper-100">
                    blueprints
                  </strong>
                  .
                </p>
                <p>
                  Having navigated the UK's tech and education systems for over
                  a decade, I provide the{" "}
                  <em>'insider' logic</em> that agencies
                  miss. From scaling engineering teams at leading tech companies
                  to guiding families through the intricacies of the 7+ and 8+
                  process — my recommendations come from firsthand success, not
                  secondhand research.
                </p>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={fadeInUp}>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="card-editorial p-4 sm:p-6 border-l-4 border-primary-600">
                  <FiCode className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 mb-3 sm:mb-4" />
                  <div className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal-900 dark:text-paper-100 mb-1">
                    15+
                  </div>
                  <div className="text-xs sm:text-sm text-charcoal-500 dark:text-paper-500 uppercase tracking-wider">
                    Years in UK Tech
                  </div>
                </div>
                <div className="card-editorial p-4 sm:p-6 border-l-4 border-sage-600">
                  <FiAward className="w-6 h-6 sm:w-8 sm:h-8 text-sage-600 mb-3 sm:mb-4" />
                  <div className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal-900 dark:text-paper-100 mb-1">
                    Oxford
                  </div>
                  <div className="text-xs sm:text-sm text-charcoal-500 dark:text-paper-500 uppercase tracking-wider">
                    MSc Graduate
                  </div>
                </div>
                <div className="card-editorial p-4 sm:p-6 border-l-4 border-primary-600">
                  <FiClipboard className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 mb-3 sm:mb-4" />
                  <div className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal-900 dark:text-paper-100 mb-1">
                    50+
                  </div>
                  <div className="text-xs sm:text-sm text-charcoal-500 dark:text-paper-500 uppercase tracking-wider">
                    Projects Delivered
                  </div>
                </div>
                <div className="card-editorial p-4 sm:p-6 border-l-4 border-sage-600">
                  <FiFileText className="w-6 h-6 sm:w-8 sm:h-8 text-sage-600 mb-3 sm:mb-4" />
                  <div className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal-900 dark:text-paper-100 mb-1">
                    Leader
                  </div>
                  <div className="text-xs sm:text-sm text-charcoal-500 dark:text-paper-500 uppercase tracking-wider">
                    Engineering Manager
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-16 sm:py-20 lg:py-32 -mx-4 px-4 bg-charcoal-900 dark:bg-charcoal-950 text-paper-100">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-10 sm:mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="headline-lg mb-4 sm:mb-6"
            >
              Common challenges
              <span className="block text-primary-400">
                I help solve.
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="body-lg text-paper-400 max-w-2xl mx-auto"
            >
              Tap on a challenge to learn how I can help
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 gap-4 sm:gap-6"
          >
            {challenges.map((challenge, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                onClick={() =>
                  setActiveChallenge(activeChallenge === index ? null : index)
                }
                className={`relative p-5 sm:p-6 lg:p-8 cursor-pointer transition-all duration-300 border tap-highlight-transparent ${
                  activeChallenge === index
                    ? "bg-paper-100 dark:bg-charcoal-800 text-charcoal-900 dark:text-paper-100 border-primary-600 shadow-2xl"
                    : "bg-charcoal-800 dark:bg-charcoal-900 border-charcoal-700 hover:border-charcoal-500"
                }`}
              >
                {/* Tag */}
                <span
                  className={`absolute top-4 sm:top-6 right-4 sm:right-6 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium uppercase tracking-wider ${
                    activeChallenge === index
                      ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                      : "bg-paper-100/10 text-paper-400"
                  }`}
                >
                  {challenge.tag}
                </span>

                <div className="flex items-start gap-3 sm:gap-5 mt-6 sm:mt-0">
                  <div
                    className={`p-2.5 sm:p-3 flex-shrink-0 ${
                      activeChallenge === index
                        ? "bg-primary-600 text-white"
                        : "bg-paper-100/10 text-paper-400"
                    }`}
                  >
                    <challenge.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg sm:text-xl font-bold mb-2 sm:mb-3 pr-16 sm:pr-0">
                      {challenge.question}
                    </h3>
                    <p
                      className={`text-sm sm:text-base leading-relaxed ${
                        activeChallenge === index
                          ? "text-charcoal-600 dark:text-paper-400"
                          : "text-paper-400"
                      }`}
                    >
                      {challenge.description}
                    </p>

                    {/* Expanded action */}
                    {activeChallenge === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-charcoal-200 dark:border-charcoal-600"
                      >
                        <a
                          href="#contact"
                          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400 hover:gap-3 transition-all"
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

      {/* Contact Form Section */}
      <section
        id="contact"
        className="py-16 sm:py-20 lg:py-32 -mx-4 px-4"
      >
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-8 sm:mb-12">
              <span className="inline-flex items-center gap-2 tag mb-4 sm:mb-6">
                <FiUsers className="w-4 h-4" />
                Friend of the Community
              </span>
              <h2 className="headline-lg mb-4 sm:mb-6">
                Let's start a
                <span className="block text-primary-600 dark:text-primary-400">
                  conversation.
                </span>
              </h2>
              <p className="body-lg text-charcoal-600 dark:text-paper-400 max-w-2xl mx-auto">
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
                  className="text-center p-8 sm:p-12 bg-charcoal-50 dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700"
                >
                  <div className="inline-flex p-3 sm:p-4 bg-sage-100 dark:bg-sage-900/30 text-sage-600 dark:text-sage-400 mb-4 sm:mb-6">
                    <FiCheckCircle className="w-10 h-10 sm:w-12 sm:h-12" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                    Message Received!
                  </h3>
                  <p className="text-sm sm:text-base text-charcoal-600 dark:text-paper-400 max-w-md mx-auto">
                    Thank you for reaching out. I'll review your message and get
                    back to you within 24–48 hours.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="p-5 sm:p-8 lg:p-12 bg-charcoal-50 dark:bg-charcoal-800 border border-charcoal-200 dark:border-charcoal-700"
                >
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs sm:text-sm font-medium uppercase tracking-wider text-charcoal-700 dark:text-paper-300 mb-1.5 sm:mb-2"
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
                        className="w-full px-3 sm:px-4 py-3 bg-paper-50 dark:bg-charcoal-900 border border-charcoal-300 dark:border-charcoal-600 text-charcoal-900 dark:text-paper-100 placeholder-charcoal-400 focus:outline-none focus:border-primary-600 transition-colors text-base"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs sm:text-sm font-medium uppercase tracking-wider text-charcoal-700 dark:text-paper-300 mb-1.5 sm:mb-2"
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
                        className="w-full px-3 sm:px-4 py-3 bg-paper-50 dark:bg-charcoal-900 border border-charcoal-300 dark:border-charcoal-600 text-charcoal-900 dark:text-paper-100 placeholder-charcoal-400 focus:outline-none focus:border-primary-600 transition-colors text-base"
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Preferred Contact Method */}
                    <div>
                      <label
                        htmlFor="contactMethod"
                        className="block text-xs sm:text-sm font-medium uppercase tracking-wider text-charcoal-700 dark:text-paper-300 mb-1.5 sm:mb-2"
                      >
                        Preferred Contact Method
                      </label>
                      <select
                        id="contactMethod"
                        name="contactMethod"
                        value={formData.contactMethod}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-3 bg-paper-50 dark:bg-charcoal-900 border border-charcoal-300 dark:border-charcoal-600 text-charcoal-900 dark:text-paper-100 focus:outline-none focus:border-primary-600 transition-colors appearance-none cursor-pointer text-base"
                      >
                        <option value="">Email (default)</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="phone">Phone</option>
                        <option value="wechat">WeChat</option>
                      </select>
                    </div>

                    {/* Contact Handle - only show if a non-email method is selected */}
                    {formData.contactMethod && (
                      <div>
                        <label
                          htmlFor="contactHandle"
                          className="block text-xs sm:text-sm font-medium uppercase tracking-wider text-charcoal-700 dark:text-paper-300 mb-1.5 sm:mb-2"
                        >
                          {formData.contactMethod === "whatsapp"
                            ? "WhatsApp Number"
                            : formData.contactMethod === "phone"
                            ? "Phone Number"
                            : "WeChat ID"}
                        </label>
                        <input
                          type={formData.contactMethod === "wechat" ? "text" : "tel"}
                          id="contactHandle"
                          name="contactHandle"
                          value={formData.contactHandle}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-3 bg-paper-50 dark:bg-charcoal-900 border border-charcoal-300 dark:border-charcoal-600 text-charcoal-900 dark:text-paper-100 placeholder-charcoal-400 focus:outline-none focus:border-primary-600 transition-colors text-base"
                          placeholder={
                            formData.contactMethod === "whatsapp"
                              ? "+1 234 567 8900"
                              : formData.contactMethod === "phone"
                              ? "+1 234 567 8900"
                              : "your_wechat_id"
                          }
                        />
                      </div>
                    )}

                    {/* Interest Area */}
                    <div>
                      <label
                        htmlFor="interest"
                        className="block text-xs sm:text-sm font-medium uppercase tracking-wider text-charcoal-700 dark:text-paper-300 mb-1.5 sm:mb-2"
                      >
                        Area of Interest *
                      </label>
                      <select
                        id="interest"
                        name="interest"
                        required
                        value={formData.interest}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-3 bg-paper-50 dark:bg-charcoal-900 border border-charcoal-300 dark:border-charcoal-600 text-charcoal-900 dark:text-paper-100 focus:outline-none focus:border-primary-600 transition-colors appearance-none cursor-pointer text-base"
                      >
                        <option value="">Select an option</option>
                        <option value="tech">IT Execution & Tech Leadership</option>
                        <option value="education">Elite Education Strategy (7+/8+)</option>
                        <option value="career">Career & Growth Mentoring</option>
                        <option value="multiple">Multiple Areas</option>
                      </select>
                    </div>

                    {/* Referral Source */}
                    <div>
                      <label
                        htmlFor="referralSource"
                        className="block text-xs sm:text-sm font-medium uppercase tracking-wider text-charcoal-700 dark:text-paper-300 mb-1.5 sm:mb-2"
                      >
                        How did you hear about me? *
                      </label>
                      <select
                        id="referralSource"
                        name="referralSource"
                        required
                        value={formData.referralSource}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-3 bg-paper-50 dark:bg-charcoal-900 border border-charcoal-300 dark:border-charcoal-600 text-charcoal-900 dark:text-paper-100 focus:outline-none focus:border-primary-600 transition-colors appearance-none cursor-pointer text-base"
                      >
                        <option value="">Select a source</option>
                        {referralSources.map((source) => (
                          <option
                            key={source}
                            value={source.toLowerCase().replace(" ", "-")}
                          >
                            {source}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-6 sm:mb-8">
                    <label
                      htmlFor="message"
                      className="block text-xs sm:text-sm font-medium uppercase tracking-wider text-charcoal-700 dark:text-paper-300 mb-1.5 sm:mb-2"
                    >
                      Tell me about your situation *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-3 bg-paper-50 dark:bg-charcoal-900 border border-charcoal-300 dark:border-charcoal-600 text-charcoal-900 dark:text-paper-100 placeholder-charcoal-400 focus:outline-none focus:border-primary-600 transition-colors resize-none text-base"
                      placeholder="Share some context about what you're looking for..."
                    />
                  </div>

                  {/* Error Message */}
                  {submitError && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs sm:text-sm">
                      {submitError}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-charcoal-500 dark:text-paper-500">
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
      <section className="py-10 sm:py-16 -mx-4 px-4 border-t border-charcoal-200 dark:border-charcoal-700 safe-area-inset-bottom">
        <div className="container mx-auto text-center">
          <p className="text-sm sm:text-base text-charcoal-500 dark:text-paper-500 mb-3 sm:mb-4">
            Questions? Reach out directly at
          </p>
          <a
            href={`mailto:${siteConfig.links.email}`}
            className="font-serif text-base sm:text-xl font-semibold text-primary-600 dark:text-primary-400 hover:underline underline-offset-4 break-all"
          >
            {siteConfig.links.email}
          </a>
        </div>
      </section>
    </>
  );
}
