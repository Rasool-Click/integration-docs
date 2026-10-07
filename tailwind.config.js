/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // WESSAAL brand palette
        brand: {
          50: '#eef2ff',
          100: '#dce4ff',
          200: '#c2cfff',
          300: '#9BB1FF',
          400: '#73C0FC',
          500: '#465FF1',
          600: '#3b52d4',
          700: '#2e40ab',
          800: '#27368c',
          900: '#111128',
          950: '#0a0b18',
        },
        focus: {
          ring: '#465FF1',
        },
      },
      boxShadow: {
        panel: '0 12px 35px -20px rgba(17, 17, 40, 0.45)',
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      addUtilities({
        '.focus-ring': {
          outline: 'none',
          boxShadow: `0 0 0 3px ${theme('colors.brand.500')}33`,
          borderColor: theme('colors.brand.500'),
        },
        '.dark .focus-ring': {
          boxShadow: `0 0 0 3px ${theme('colors.brand.300')}33`,
          borderColor: theme('colors.brand.300'),
        }
      });
    }
  ],
}
