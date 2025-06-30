/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#537D5D',
          medium: '#73946B',
          light: '#9EBC8A',
          background: '#F0F0E0', // A lighter version of the beige for the body
          accent: '#D2D0A0'
        }
      }
    },
  },
  plugins: [],
};