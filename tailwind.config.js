/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // High contrast colors for WCAG compliance
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7', // Accessible text on light bg (Contrast ratio > 4.5:1)
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        focus: {
          ring: '#0284c7', // Clear outline for keyboard navigation
        }
      },
      boxShadow: {
        panel: '0 12px 35px -20px rgba(15, 23, 42, 0.45)',
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      addUtilities({
        '.focus-ring': {
          outline: 'none',
          boxShadow: `0 0 0 3px ${theme('colors.focus.ring')}80`, // 50% opacity ring
          borderColor: theme('colors.focus.ring'),
        },
        // Dark mode focus ring variant
        '.dark .focus-ring': {
          boxShadow: `0 0 0 3px ${theme('colors.primary.400')}80`, // 50% opacity ring for dark mode
          borderColor: theme('colors.primary.400'),
        }
      });
    }
  ],
}
