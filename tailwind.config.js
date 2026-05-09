/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/hooks/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#F94F50",
          white: "#FFFFFF",
          gold: "#D4AF37",
          black: "#000000",
          soft: "#FAFAFA",
          ivory: "#FDFBF7",
        },
      },
      boxShadow: {
        verification: "0 20px 60px rgba(0, 0, 0, 0.06)",
      },
    },
  },
};
