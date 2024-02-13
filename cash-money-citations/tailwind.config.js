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
      'cashgreen': {
        DEFAULT: '#24e19c',
        dark: '#20bc73',
      },
      'pennyred': {
        DEFAULT: '#e14724',
        dark: '#bd2d20',
      },
      'goldcoin': {
        DEFAULT: '#e1d224',
        dark: '#bca220',
      },
      'ivymoney': {
        light: '#65c2a0',
        DEFAULT: '#54aa8b',
        dark: '#468870',
      },
      'bankerblue': {
        light: '#4d25dc',
        DEFAULT: '#481fc3',
        dark: '#381ba1',
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

