/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ===================================
  // NOVO: Adicionar darkMode: 'class'
  // ===================================
  darkMode: 'class', 
  theme: {
    extend: {},
  },
  plugins: [],
}