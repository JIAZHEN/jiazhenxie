import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Projects from "./pages/Projects";
import BlogPost from "./pages/BlogPost";
import PageTracker from "./components/PageTracker";

function App() {
  return (
    <Router>
      <PageTracker />
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8"
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
          </Routes>
        </motion.main>
      </div>
    </Router>
  );
}

export default App;
