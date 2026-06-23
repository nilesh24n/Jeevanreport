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
        // Deep trustworthy navy-blue as primary brand
        brand: {
          50: "#eef3ff",
          100: "#dce6ff",
          200: "#b3ccff",
          300: "#7aa7ff",
          400: "#3d7eff",
          500: "#1a5bdb",
          600: "#1246b5",
          700: "#0d3490",
          800: "#0a2470",
          900: "#071a52",
        },
        // Refined green for positive nutrition
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          500: "#16a34a",
          600: "#15803d",
          700: "#166534",
        },
        // Premium orange/saffron for warnings (India warmth)
        warning: {
          50: "#fff8f1",
          100: "#ffedd5",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
        },
        // Clear red for danger/alerts
        danger: {
          50: "#fff1f2",
          100: "#ffe4e6",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
        },
        // India saffron accent
        saffron: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#f59e0b",
          500: "#d97706",
          600: "#b45309",
          700: "#92400e",
          800: "#78350f",
          900: "#451a03",
        },
        // India green accent
        india: {
          green: "#138808",
          greenLight: "#e8f5e9",
          saffron: "#FF9933",
          saffronLight: "#fff3e0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        "card-hover": "0 4px 12px 0 rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.04)",
        premium: "0 8px 32px 0 rgb(10 36 112 / 0.10), 0 2px 8px 0 rgb(10 36 112 / 0.06)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
