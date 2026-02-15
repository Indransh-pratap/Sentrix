/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#09090b", // zinc-950
        foreground: "#fafafa", // zinc-50
        primary: {
          DEFAULT: "#8b5cf6", // violet-500
          foreground: "#ffffff",
          hover: "#7c3aed", // violet-600
        },
        secondary: {
          DEFAULT: "#ec4899", // pink-500
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#22d3ee", // cyan-400
          foreground: "#09090b",
        },
        muted: {
          DEFAULT: "#27272a", // zinc-800
          foreground: "#a1a1aa", // zinc-400
        },
        card: {
          DEFAULT: "#18181b", // zinc-900
          foreground: "#fafafa",
        },
        border: "#27272a", // zinc-800
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)',
      },
    },
  },
  plugins: [],
};
