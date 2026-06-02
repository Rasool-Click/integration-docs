/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        panel: '0 12px 35px -20px rgba(15, 23, 42, 0.45)',
      },
    },
  },
  plugins: [],
}
