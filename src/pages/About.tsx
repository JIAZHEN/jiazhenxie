import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  FiDatabase,
  FiCpu,
  FiUsers,
  FiTarget,
  FiBriefcase,
  FiArrowRight,
  FiAward,
  FiMapPin,
  FiBook,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const skills = [
  {
    category: "Backend & Systems",
    icon: FiDatabase,
    color: "bg-primary-600",
    items: [
      "Distributed Systems",
      "Microservices",
      "Event-Driven Architecture",
      "High-Performance Systems",
    ],
  },
  {
    category: "DevOps & Cloud",
    icon: FiCpu,
    color: "bg-sage-600",
    items: [
      "Cloud Architecture",
      "Infrastructure as Code",
      "CI/CD Pipelines",
      "Monitoring & Observability",
    ],
  },
  {
    category: "Leadership",
    icon: FiUsers,
    color: "bg-primary-700",
    items: [
      "Engineering Leadership",
      "People Management",
      "Performance Management",
      "Flow Engineering",
    ],
  },
  {
    category: "Strategy",
    icon: FiTarget,
    color: "bg-sage-700",
    items: [
      "Product Vision",
      "Technical Strategy",
      "Cross-functional Leadership",
      "Stakeholder Management",
    ],
  },
  {
    category: "Domains",
    icon: FiBriefcase,
    color: "bg-charcoal-700",
    items: [
      "High-Tech Retail",
      "SaaS Platforms",
      "Subscription Services",
      "Social Media",
    ],
  },
];

const timeline = [
  {
    year: "2024",
    title: "Engineering Manager",
    company: "Canva",
    description: "Leading engineering teams to deliver impactful products at scale. Driving technical strategy and building high-performing, inclusive teams.",
  },
  {
    year: "2020",
    title: "Founding Engineering Lead",
    company: "SaaS Startup",
    description: "Built engineering team from 0 to 10+ people. Architected and shipped a SaaS platform from concept to production.",
  },
  {
    year: "2018",
    title: "MSc Software Engineering",
    company: "University of Oxford",
    description: "Deepened expertise in distributed systems and software architecture while working full-time.",
  },
  {
    year: "2015",
    title: "Senior Software Engineer → Tech Lead",
    description: "Transitioned into technical leadership. Led cross-functional delivery teams and mentored junior engineers.",
  },
  {
    year: "2010",
    title: "Started UK Journey",
    description: "Moved to the UK and began career as a software engineer. Built foundation in full-stack development and agile practices.",
  },
];

// Animated skill bar
const SkillBar = ({ skill, index }: { skill: typeof skills[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
    >
      <div className="card-editorial p-4 sm:p-6 h-full">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className={`p-2.5 sm:p-3 ${skill.color} text-white`}>
            <skill.icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-semibold">{skill.category}</h3>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {skill.items.map((item, i) => (
            <motion.span
              key={item}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1 + i * 0.05 + 0.3 }}
              className="px-2 py-1 sm:px-3 sm:py-1.5 bg-charcoal-100 dark:bg-charcoal-700 text-xs sm:text-sm"
            >
              {item}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const About = () => {
  return (
    <>
      <SEO
        title="About Jiazhen Xie - Oxford Engineering Leader | Chinese Tech Management Expert"
        description="Meet Jiazhen Xie, a Chinese engineering leader in the UK with Oxford MSc degree and over a decade of experience. Specializing in distributed systems, team leadership, and cross-cultural tech management in diverse environments."
        type="profile"
        keywords={[
          "Oxford engineering graduate",
          "Chinese engineering leader UK",
          "bilingual tech leader",
          "cross-cultural engineering management",
          "distributed systems expert",
          "inclusive leadership",
          "software architecture",
          "engineering team building",
        ]}
        canonicalUrl="https://jiazhenxie.com/about"
      />

      <div className="mt-16 sm:mt-20 -mx-4">
        {/* Hero Section - Asymmetric Layout */}
        <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-16">
            {/* Left: Large number/visual */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-4 flex items-start justify-center lg:justify-start"
            >
              <div className="relative">
                <span className="font-serif text-[100px] xs:text-[120px] sm:text-[150px] lg:text-[200px] xl:text-[240px] font-bold leading-none text-primary-600/10 dark:text-primary-400/10">
                  15
                </span>
                <div className="absolute bottom-0 left-0 right-0 text-center lg:text-left lg:pl-4">
                  <span className="text-xs sm:text-sm font-medium uppercase tracking-wider sm:tracking-widest text-charcoal-500 dark:text-paper-500">
                    Years of Experience
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-8"
            >
              <span className="tag-primary mb-4 sm:mb-6 inline-block">About Me</span>
              <h1 className="headline-xl mb-6 sm:mb-8">
                Engineering leader with a 
                <span className="text-primary-600 dark:text-primary-400"> global </span>
                perspective.
              </h1>
              <div className="space-y-4 sm:space-y-6 body-lg text-charcoal-600 dark:text-paper-400 max-w-2xl">
                <p>
                  I'm an engineering leader with over a decade of experience
                  building and scaling high-performing teams across the UK tech
                  industry. As an Oxford MSc graduate, I've led complex,
                  cross-functional projects to success and improved delivery
                  efficiency by up to 50%.
                </p>
                <p>
                  My leadership style is grounded in clarity, empathy, and
                  data—I strive to foster a culture of ownership, continuous
                  improvement, and high trust.
                </p>
              </div>

              {/* Quick stats - stack on mobile */}
              <div className="grid grid-cols-1 xs:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-charcoal-200 dark:border-charcoal-700">
                <div className="flex xs:block items-center justify-between xs:justify-start gap-2">
                  <div className="flex items-center gap-2 text-charcoal-500 dark:text-paper-500 xs:mb-2">
                    <FiMapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium uppercase tracking-wider">Location</span>
                  </div>
                  <p className="font-serif text-base sm:text-lg lg:text-xl">United Kingdom</p>
                </div>
                <div className="flex xs:block items-center justify-between xs:justify-start gap-2">
                  <div className="flex items-center gap-2 text-charcoal-500 dark:text-paper-500 xs:mb-2">
                    <FiAward className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium uppercase tracking-wider">Education</span>
                  </div>
                  <p className="font-serif text-base sm:text-lg lg:text-xl">Oxford MSc</p>
                </div>
                <div className="flex xs:block items-center justify-between xs:justify-start gap-2">
                  <div className="flex items-center gap-2 text-charcoal-500 dark:text-paper-500 xs:mb-2">
                    <FiBook className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium uppercase tracking-wider">Focus</span>
                  </div>
                  <p className="font-serif text-base sm:text-lg lg:text-xl">Leadership</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Cross-cultural Section */}
        <section className="bg-charcoal-900 dark:bg-charcoal-950 text-paper-100 py-12 sm:py-16 lg:py-24 px-4">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 border border-paper-100/20 text-xs sm:text-sm font-medium uppercase tracking-wider sm:tracking-widest mb-4 sm:mb-6">
                  Cross-Cultural Leadership
                </span>
                <h2 className="headline-lg mb-6 sm:mb-8">
                  Bridging
                  <span className="text-primary-400"> Eastern & Western </span>
                  perspectives.
                </h2>
                <div className="space-y-4 sm:space-y-6 body-md text-paper-400">
                  <p>
                    I bring a strong technical foundation—enough to operate at a
                    Principal Engineer level—paired with the strategic mindset needed
                    for senior leadership.
                  </p>
                  <p>
                    As a Chinese engineering leader fluent in both Western and Chinese
                    business and engineering cultures, I help teams lead inclusively,
                    navigate global collaboration, and bring diverse perspectives to
                    the table.
                  </p>
                  <p>
                    This rare combination of technical depth and cross-cultural
                    leadership enables me to create impact, build trust, and inspire
                    diverse engineering teams.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative order-first lg:order-last"
              >
                {/* Global Mindset Image */}
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src="/images/Global-Mindset.png"
                    alt="Cross-cultural leadership - Bridging Eastern and Western perspectives"
                    className="w-full h-auto object-cover"
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/30 to-transparent" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-12 sm:py-16 lg:py-24 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mb-8 sm:mb-12"
            >
              <span className="tag mb-4 sm:mb-6 inline-block">Expertise</span>
              <h2 className="headline-lg mb-4 sm:mb-6">
                Skills &
                <span className="text-primary-600 dark:text-primary-400"> capabilities.</span>
              </h2>
              <p className="body-md text-charcoal-600 dark:text-paper-400">
                A blend of deep technical expertise and strategic leadership skills,
                built over a decade in the UK tech industry.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {skills.map((skill, index) => (
                <SkillBar key={skill.category} skill={skill} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="bg-charcoal-50 dark:bg-charcoal-800/50 py-12 sm:py-16 lg:py-24 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-16"
            >
              <span className="tag-primary mb-4 sm:mb-6 inline-block">Journey</span>
              <h2 className="headline-lg">
                Career
                <span className="text-primary-600 dark:text-primary-400"> milestones.</span>
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-6 sm:pl-8 pb-8 sm:pb-12 last:pb-0"
                >
                  {/* Timeline line */}
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-charcoal-300 dark:bg-charcoal-600" />
                  
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1 w-2 h-2 -translate-x-1/2 bg-primary-600 rotate-45" />

                  <div className="flex flex-col xs:flex-row xs:flex-wrap xs:items-baseline gap-1 xs:gap-3 sm:gap-4 mb-2">
                    <span className="font-serif text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {item.year}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-semibold">{item.title}</h3>
                  </div>
                  {item.company && (
                    <p className="text-xs sm:text-sm font-medium text-charcoal-500 dark:text-paper-500 mb-2">
                      {item.company}
                    </p>
                  )}
                  <p className="text-sm sm:text-base text-charcoal-600 dark:text-paper-400">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-24 px-4">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center px-2"
            >
              <h2 className="headline-lg mb-4 sm:mb-6">
                Let's work
                <span className="text-primary-600 dark:text-primary-400"> together.</span>
              </h2>
              <p className="body-lg text-charcoal-600 dark:text-paper-400 mb-8 sm:mb-10">
                Whether you're looking for strategic guidance, technical leadership,
                or want to explore collaboration opportunities — I'd love to connect.
              </p>
              <div className="flex flex-col xs:flex-row justify-center gap-3 sm:gap-4">
                <Link to="/solutions" className="btn-primary group w-full xs:w-auto">
                  View Solutions
                  <FiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/blog" className="btn-ghost w-full xs:w-auto">
                  Read My Blog
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
