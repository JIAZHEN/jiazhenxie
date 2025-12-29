/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        // Warm terracotta primary - distinctive, earthy
        primary: {
          50: "#fdf5f3",
          100: "#fae8e3",
          200: "#f6d5cb",
          300: "#eeb6a5",
          400: "#e28f77",
          500: "#d4694d",
          600: "#c45a3b", // Main terracotta
          700: "#a34832",
          800: "#873d2d",
          900: "#70362a",
          950: "#3c1a13",
        },
        // Sage green accent - organic, calm
        sage: {
          50: "#f4f7f4",
          100: "#e6ebe6",
          200: "#cdd8cd",
          300: "#a8bda8",
          400: "#7d9b7d",
          500: "#6b8e6b", // Main sage
          600: "#4d704d",
          700: "#3f5a3f",
          800: "#354935",
          900: "#2d3d2d",
          950: "#161f16",
        },
        // Warm paper background for light mode
        paper: {
          50: "#fdfcfa",
          100: "#faf7f2",
          200: "#f5f0e8",
          300: "#ebe3d6",
          400: "#d9cdb9",
          500: "#c4b49a",
        },
        // Charcoal for dark mode - warm undertone
        charcoal: {
          50: "#f6f6f6",
          100: "#e7e7e7",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6d6d6d",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#454545",
          900: "#1a1a1a", // Main dark bg
          950: "#0d0d0d",
        },
        background: {
          DEFAULT: "hsl(var(--background))",
        },
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
        body: ["Source Serif 4", "Georgia", "serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-in": "slideIn 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.5s ease-out forwards",
        "border-draw": "borderDraw 0.8s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        borderDraw: {
          "0%": { strokeDashoffset: "100" },
          "100%": { strokeDashoffset: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "inherit",
            a: {
              color: "#c45a3b",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              "&:hover": {
                color: "#a34832",
              },
            },
            "h1, h2, h3, h4": {
              fontFamily: "Playfair Display, Georgia, serif",
              fontWeight: "700",
            },
            blockquote: {
              borderLeftColor: "#c45a3b",
              fontStyle: "italic",
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};
