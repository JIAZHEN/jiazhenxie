import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGithub,
  FiLinkedin,
  FiMoon,
  FiSun,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { siteConfig } from "../config/site";

const navLinks = [
  { path: "/", label: "Home" },
  // { path: "/solutions", label: "Solutions" },
  { path: "/about", label: "About" },
  { path: "/blog", label: "Blog" },
];

const Navbar = () => {
  const [isDark, setIsDark] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 safe-area-inset-top ${
          isScrolled
            ? "bg-paper-100/95 dark:bg-charcoal-900/95 backdrop-blur-md border-b border-charcoal-200 dark:border-charcoal-700"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="group flex items-center gap-2 sm:gap-3 tap-highlight-transparent"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary-600 flex items-center justify-center transition-transform duration-300 group-hover:rotate-3">
                <span className="text-white font-serif font-bold text-base sm:text-lg">
                  J
                </span>
              </div>
              <span className="font-serif text-lg sm:text-xl font-semibold tracking-tight hidden xs:block">
                {siteConfig.name}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className="relative group">
                  <span
                    className={`text-sm font-medium tracking-wide uppercase transition-colors duration-200 ${
                      location.pathname === link.path
                        ? "text-primary-600 dark:text-primary-400"
                        : "text-charcoal-700 dark:text-paper-300 hover:text-primary-600 dark:hover:text-primary-400"
                    }`}
                  >
                    {link.label}
                  </span>
                  <motion.span
                    className="absolute -bottom-1 left-0 h-[2px] bg-primary-600"
                    initial={{ width: 0 }}
                    animate={{
                      width: location.pathname === link.path ? "100%" : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  />
                  <span className="absolute -bottom-1 left-0 h-[2px] bg-primary-600 w-0 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-0 sm:gap-2">
              {/* Social icons - hidden on mobile, shown in mobile menu */}
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex p-2.5 text-charcoal-600 dark:text-paper-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="GitHub"
              >
                <FiGithub size={20} />
              </a>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex p-2.5 text-charcoal-600 dark:text-paper-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="LinkedIn"
              >
                <FiLinkedin size={20} />
              </a>

              {/* Theme toggle - larger touch target on mobile */}
              <button
                onClick={toggleTheme}
                className="p-3 sm:p-2.5 text-charcoal-600 dark:text-paper-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors tap-highlight-transparent"
                aria-label="Toggle theme"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isDark ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDark ? (
                    <FiSun size={22} className="sm:w-5 sm:h-5" />
                  ) : (
                    <FiMoon size={22} className="sm:w-5 sm:h-5" />
                  )}
                </motion.div>
              </button>

              {/* Mobile menu button - larger touch target */}
              <button
                type="button"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="md:hidden p-3 text-charcoal-600 dark:text-paper-400 tap-highlight-transparent touch-manipulation"
                aria-label="Toggle menu"
                aria-expanded={isMobileOpen}
              >
                {isMobileOpen ? <FiX size={26} /> : <FiMenu size={26} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Menu panel - full width on small screens */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-full xs:w-80 bg-paper-100 dark:bg-charcoal-900 border-l border-charcoal-200 dark:border-charcoal-700 safe-area-inset-bottom"
            >
              <div className="p-5 sm:p-6 pt-20 sm:pt-24 h-full overflow-y-auto">
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <Link
                        to={link.path}
                        className={`block py-4 px-4 text-base sm:text-lg font-medium border-l-4 transition-all duration-200 tap-highlight-transparent ${
                          location.pathname === link.path
                            ? "border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                            : "border-transparent hover:border-primary-300 hover:bg-charcoal-50 dark:hover:bg-charcoal-800 active:bg-charcoal-100 dark:active:bg-charcoal-700"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Social links in mobile - larger touch targets */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-charcoal-200 dark:border-charcoal-700"
                >
                  <p className="text-xs font-medium uppercase tracking-widest text-charcoal-500 mb-4">
                    Connect
                  </p>
                  <div className="flex gap-3">
                    <a
                      href={siteConfig.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-charcoal-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-paper-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors tap-highlight-transparent"
                    >
                      <FiGithub size={22} />
                    </a>
                    <a
                      href={siteConfig.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-charcoal-100 dark:bg-charcoal-800 text-charcoal-700 dark:text-paper-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors tap-highlight-transparent"
                    >
                      <FiLinkedin size={22} />
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
