/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      'newdollagreen': {
        DEFAULT: '#1fde55',
        dark: '#1bc14a',
      },
      'nofundsred': {
        DEFAULT: '#f53325',
        dark: '#d82d20',
      },
      'goldcoin': {
        DEFAULT: '#f4f219',
        dark: '#d8d416',
      },
      'crumpleddollagreen': {
        light: '#34e176',
        DEFAULT: '#2dc467',
        dark: '#26a657',
      },
      'bankerblue': {
        DEFAULT: '#2d25f5',
        dark: '#2620d8',
      },
      zinc: colors.zinc,
      white: colors.white,
      black: colors.black,
      green: colors.green,
      blue: colors.blue,
      red: colors.red,
      yellow: colors.yellow,
      slate: colors.slate,
      gray: colors.gray,
      neutral: colors.neutral,
      stone: colors.stone,
      orange: colors.orange,
      amber: colors.amber,
      lime: colors.lime,
      emerald: colors.emerald,
      teal: colors.teal,
      cyan: colors.cyan,
      sky: colors.sky,
      indigo: colors.indigo,
      violet: colors.violet,
      purple: colors.purple,
      fuchsia: colors.fuchsia,
      pink: colors.pink,
      rose: colors.rose,
    },
    extend: {},
  },
  plugins: [],
}

