import { useState } from "react";
import { Link } from "react-router-dom";
import { FiGithub, FiLinkedin, FiMoon, FiSun } from "react-icons/fi";

const Navbar = () => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            Your Name
          </Link>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex space-x-6">
              <Link
                to="/about"
                className="hover:text-primary-500 transition-colors"
              >
                About
              </Link>
              <Link
                to="/blog"
                className="hover:text-primary-500 transition-colors"
              >
                Blog
              </Link>
              <Link
                to="/projects"
                className="hover:text-primary-500 transition-colors"
              >
                Projects
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-500 transition-colors"
              >
                <FiGithub size={20} />
              </a>
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-500 transition-colors"
              >
                <FiLinkedin size={20} />
              </a>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
