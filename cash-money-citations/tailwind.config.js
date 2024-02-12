/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      cashgreen: {
        DEFAULT: '#24e19c',
        dark: '#20bc73',
      },
      pennyred: {
        DEFAULT: '#e14724',
        dark: '#bd2d20',
      },
      goldcoin: {
        DEFAULT: '#e1d224',
        dark: '#bca220',
      },
      ivymoney: {
        light: '#65c2a0',
        DEFAULT: '#54aa8b',
        dark: '#468870',
      },
      bankerblue: {
        light: '#4d25dc',
        DEFAULT: '#481fc3',
        dark: '#381ba1',
      }
    },
    extend: {},
  },
  plugins: [],
}

