/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EEF6F5",
          100: "#D2E8E5",
          200: "#A6D1CA",
          300: "#78B7AC",
          400: "#4C9A8E",
          500: "#1F786C",
          600: "#146058",
          700: "#0E4A44",
          800: "#0A3733",
        },
        accent: {
          50: "#FFF7EB",
          100: "#FEEAC7",
          300: "#FBC96C",
          400: "#F5AD3D",
          500: "#EC9522",
          600: "#C97814",
        },
        ink: "#132420",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
