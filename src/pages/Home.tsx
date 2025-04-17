import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import VantaBackground from "../components/VantaBackground";
import { siteConfig } from "../config/site";

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
    <VantaBackground>
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            Hi, I'm <span className="text-primary-500">{siteConfig.name}</span>
          </h1>

          <div className="h-12 mb-8">
            <span className="text-2xl md:text-3xl text-white">
              {currentText}
              <span className="animate-pulse">|</span>
            </span>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-200"
          >
            I lead engineering teams to build scalable solutions and solve
            complex technical challenges.
          </motion.p>

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
              Learn More
              <FiArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </VantaBackground>
  );
}
