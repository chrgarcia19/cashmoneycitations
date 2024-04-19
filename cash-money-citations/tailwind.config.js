/** @type {import('tailwindcss').Config} */
const {nextui} = require("@nextui-org/react");
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        red: {
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        purple: {
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
      },
    },
  },
  darkMode: "class",
  variants: {
    extend: {
      backgroundColor: ['red', 'purple'],  // enabling custom utilities for backgroundColor
      textColor: ['red', 'purple'],
      borderColor: ['red', 'purple'],
      boxShadow: ['red', 'purple'],
    },
  },
  plugins: [nextui(), require("daisyui")],
  daisyui: {
    themes: true,
  },
}
