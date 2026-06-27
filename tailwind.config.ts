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
        // ── Pantone 2025 Mocha Mousse colour system ─────────────────────────
        brand: {
          50:  "#f7f1eb",
          100: "#eedde9", // re-mapped to latte range
          200: "#e8ddd0", // Latte surface
          300: "#d4bea6",
          400: "#bf9f7c",
          500: "#a98566",
          600: "#9b7653", // Mocha Mousse — primary accent
          700: "#7d5e40",
          800: "#5e4530",
          900: "#3f2d1f",
          950: "#2c1a0e", // Espresso — deep text
        },
        // Warm off-white background
        canvas: "#faf7f2",
        // Espresso text
        espresso: "#2c1a0e",
        // Latte surface
        latte: "#e8ddd0",
        // Semantic colours
        success: {
          50:  "#ecf4e5",
          100: "#d2e7be",
          500: "#3b6d11",
          600: "#3b6d11",
          700: "#2d5409",
        },
        warning: {
          50:  "#fdf3e7",
          100: "#f9e0bc",
          500: "#854f0b",
          600: "#854f0b",
          700: "#6b3f08",
          800: "#854f0b",
        },
        danger: {
          50:  "#faeaea",
          100: "#f3cece",
          500: "#a32d2d",
          600: "#a32d2d",
          700: "#832424",
        },
        // India saffron accent kept
        saffron: {
          50:  "#fffbeb",
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
        india: {
          green:        "#138808",
          greenLight:   "#e8f5e9",
          saffron:      "#FF9933",
          saffronLight: "#fff3e0",
        },
      },
      fontFamily: {
        sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      boxShadow: {
        card:       "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        "card-hover": "0 4px 12px 0 rgb(155 118 83 / 0.12), 0 2px 4px -2px rgb(155 118 83 / 0.06)",
        premium:    "0 8px 32px 0 rgb(44 26 14 / 0.10), 0 2px 8px 0 rgb(44 26 14 / 0.06)",
        mocha:      "0 4px 24px 0 rgb(155 118 83 / 0.18)",
      },
      borderRadius: {
        xl:   "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
