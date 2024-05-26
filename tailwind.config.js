/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-blue': '#EBF8FF',
        'purple-blue': '#6B46C1',
      },
      
    },
  },
  plugins: [],
}

