import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Projects from "./pages/Projects";
import BlogPost from "./pages/BlogPost";
import Solutions from "./pages/Solutions";
import PageTracker from "./components/PageTracker";

function App() {
  return (
    <Router>
      <PageTracker />
      <div className="min-h-screen bg-paper-100 dark:bg-charcoal-900 text-charcoal-900 dark:text-paper-100 transition-colors duration-300">
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto px-4 sm:px-6 py-6 sm:py-8"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
            </Routes>
          </motion.main>
        </AnimatePresence>

        {/* Footer */}
        <footer className="border-t border-charcoal-200 dark:border-charcoal-700 py-8 sm:py-12 mt-auto safe-area-inset-bottom">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-600 flex items-center justify-center">
                  <span className="text-white font-serif font-bold text-base sm:text-lg">J</span>
                </div>
                <span className="font-serif text-base sm:text-lg font-semibold">Jiazhen Xie</span>
              </div>
              <div className="text-xs sm:text-sm text-charcoal-500 dark:text-paper-500">
                © {new Date().getFullYear()} All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
