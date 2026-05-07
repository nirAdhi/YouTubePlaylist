/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          750: '#2d2d2d',
          850: '#1f1f1f',
          950: '#0f0f0f',
        },
      },
    },
  },
  plugins: [],
};
