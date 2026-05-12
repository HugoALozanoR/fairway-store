/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        fairway: {
          50: "#f1f6f1",
          100: "#dceadc",
          200: "#b9d4b9",
          300: "#8eb88f",
          400: "#5e9762",
          500: "#3f7d44",
          600: "#2f6336",
          700: "#27502d",
          800: "#214126",
          900: "#1c3621",
          950: "#0e1f12",
        },
        cream: {
          50: "#fbf9f4",
          100: "#f5f1e6",
          200: "#ece5d0",
          300: "#ddd0ad",
          400: "#c7b481",
          500: "#b29964",
          600: "#9a8052",
        },
        charcoal: {
          50: "#f5f5f6",
          100: "#e6e6e8",
          200: "#c7c7cc",
          300: "#a0a0a7",
          400: "#73737c",
          500: "#52525a",
          600: "#3d3d44",
          700: "#2c2c33",
          800: "#1f1f25",
          900: "#15151a",
        },
        gold: {
          400: "#d4b572",
          500: "#c19a4a",
          600: "#a37f33",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ['"Playfair Display"', "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15,20,15,0.04), 0 8px 24px -12px rgba(15,20,15,0.10)",
      },
    },
  },
  plugins: [],
};
