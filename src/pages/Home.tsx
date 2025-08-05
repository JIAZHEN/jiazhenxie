import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";
import VantaBackground from "../components/VantaBackground";
import { siteConfig } from "../config/site";
import SEO from "../components/SEO";

export default function Home() {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const texts = [
    "Software Engineering Manager",
    "Tech Leader",
    "Team Builder",
    "Problem Solver",
  ];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < texts[currentTextIndex].length) {
        setCurrentText((prev) => prev + texts[currentTextIndex][currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentText("");
          setCurrentIndex(0);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, currentTextIndex]);

  return (
    <>
      <SEO
        title="Jiazhen Xie - Engineering Leader UK | Oxford Alumni | Chinese Tech Leader"
        description="Engineering leader in the UK with 14+ years experience. Oxford MSc graduate specializing in tech management, team building, and software architecture. Rare Chinese leader in UK tech industry with proven track record in scaling high-performing engineering teams."
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
      <VantaBackground>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center z-10"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              Hi, I'm{" "}
              <span className="text-primary-500">{siteConfig.name}</span>
            </h1>

            <div className="h-12 mb-8">
              <span className="text-2xl md:text-3xl text-white">
                {currentText}
                <span className="animate-pulse">|</span>
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-200"
            >
              <p className="mb-4">
                Engineering leader with 14+ years experience leading
                high-performing teams in the UK tech industry. Oxford MSc
                graduate specializing in software architecture, team management,
                and technical leadership.
              </p>
              <p>
                Bringing unique perspective as a Chinese engineering leader in
                the UK, fostering inclusive cultures and driving innovation in
                distributed systems and cloud architecture.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center space-x-4"
            >
              <Link
                to="/blog"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
              >
                Blog Posts
                <FiArrowRight className="ml-2" />
              </Link>
            </motion.div>

            <div className="mt-8 flex gap-4">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <FiGithub className="w-6 h-6" />
              </a>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <FiLinkedin className="w-6 h-6" />
              </a>
              <a
                href={`mailto:${siteConfig.links.email}`}
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <FiMail className="w-6 h-6" />
              </a>
            </div>
          </motion.div>
        </div>
      </VantaBackground>
    </>
  );
}
