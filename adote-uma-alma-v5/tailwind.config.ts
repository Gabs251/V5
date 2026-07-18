import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#faf6f1",
          100: "#f0e6da",
          200: "#dcc4a8",
          300: "#c7a179",
          400: "#a97c4f",
          500: "#8a5f38",
          600: "#6b4a2e",
          700: "#553a25",
          800: "#402b1c",
          900: "#2b1c12",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out both",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(64, 43, 28, 0.15)",
        card: "0 8px 30px -12px rgba(64, 43, 28, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
