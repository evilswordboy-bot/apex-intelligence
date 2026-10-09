import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#05070D",
        surface: {
          DEFAULT: "#0B1020",
          card: "#121A2E",
          elevated: "#121A2E",
          hover: "#16223D",
          border: "#1C2745",
        },
        elevated: "#121A2E",
        cricket: {
          DEFAULT: "#B6FF3B",
          glow: "rgba(182, 255, 59, 0.25)",
          dim: "#9DEB2A",
        },
        football: {
          DEFAULT: "#2D6BFF",
          glow: "rgba(45, 107, 255, 0.25)",
          dim: "#2355D4",
        },
        olympics: {
          DEFAULT: "#FF6B2C",
          glow: "rgba(255, 107, 44, 0.25)",
          dim: "#E05517",
        },
        apex: {
          blue: "#2D6BFF",
          lime: "#B6FF3B",
          orange: "#FF6B2C",
        },
        text: {
          primary: "#F5F7FF",
          secondary: "#9AA4BF",
          muted: "#5A6785",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        'cricket-glow': '0 0 25px -3px rgba(182, 255, 59, 0.35)',
        'football-glow': '0 0 25px -3px rgba(45, 107, 255, 0.35)',
        'olympic-glow': '0 0 25px -3px rgba(255, 107, 44, 0.35)',
        'apex-glow': '0 0 35px -5px rgba(45, 107, 255, 0.25), 0 0 15px -3px rgba(182, 255, 59, 0.25)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.45)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'tech-grid': 'linear-gradient(to right, rgba(28, 39, 69, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(28, 39, 69, 0.15) 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
};
export default config;
