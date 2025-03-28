/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      heading: ["Oddval", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#353FD7",
        secondary: "#C0FF58",
        bg: "#FFFFFF",
        "bg-gray-1": "#F9F9F9",
        "bg-gray-2": "#FAFAFA",
        "bg-gray-3": "#F1F1F1",
        muted: "#F1F1F1",
        "dark-bg": "#000",
        "secondary-bg": "#CFFC75",
        "dark-secondary": "#86CE15",
        "blue-in-green": "#0C19EA",
        "text-primary": "#000000",
        "text-inverted": "#fff",
        "text-muted": "#4D4D4D",
      },
      letterSpacing: {
        tighter: "-0.32px", // Override default tighter spacing
        tight: "-0.28px", // Override default tighter spacing
      },
    },
  },
  plugins: [],
};
