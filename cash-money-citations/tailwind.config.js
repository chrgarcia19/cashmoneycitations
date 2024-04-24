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
        'theme-red': 'var(--theme-red)',
        'theme-purple': 'var(--theme-purple)',
      },
    },
    },
  darkMode: "class",
  variants: {},
  plugins: [nextui(), require("daisyui")],
  daisyui: {
    themes: true,
  },
}
