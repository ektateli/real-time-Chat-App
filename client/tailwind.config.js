/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        primary : "#00acb4",
        secondary : "#058187",
        'dark-mode': {
          bg: '#1f2937',
          text: '#f8fafc',
          border: '#374151',
          hover: '#374151',
          accent: '#4b5563',
          light: '#f8fafc',
          dark: '#1f2937',
        },
       
      }
    },
  },
  plugins: [],
}
