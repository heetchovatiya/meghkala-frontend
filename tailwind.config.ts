import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-bg": "#F8F7F4",
        "secondary-bg": "#E9E4DE",
        accent: "#E6A285",
        "accent-hover": "#D67D55",
        "heading-color": "#2D2D2D",
        "text-color": "#5A5A5A",
        // Warm earthy palette
        earth: {
          50: "#FDF8F6",
          100: "#F2E8E5",
          200: "#EADDDA",
          300: "#E0CEC7",
          400: "#D2BAB0",
          500: "#BFA094",
          600: "#A18072",
          700: "#8B6F61",
          800: "#6B5449",
          900: "#4A3C35",
        },
        terracotta: {
          50: "#FDF4F0",
          100: "#FBE8E0",
          200: "#F6D0C0",
          300: "#F0B39A",
          400: "#E8906E",
          500: "#E67D55",
          600: "#D66B42",
          700: "#B85A38",
          800: "#944A30",
          900: "#7A3E2A",
        },
        sage: {
          50: "#f0f4f0",
          100: "#dde8dd",
          200: "#bdd1bd",
          300: "#8fb08f",
          400: "#6a8a6a",
          500: "#4f6f4f",
          600: "#3d583d",
          700: "#324732",
          800: "#2b3a2b",
          900: "#253125",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // ✅ THIS LINE MUST BE HERE
  ],
};
export default config;
