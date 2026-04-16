/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          indigo: '#4F46E5',
          cyan: '#06B6D4',
        },
        dark: {
          bg: '#0A0A0F',
          card: '#13131A',
          lighter: '#1A1A24',
        },
      },
    },
  },
  plugins: [],
};
