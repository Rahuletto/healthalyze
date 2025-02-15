/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        classy: ['var(--font-classy)'],
        unbound: ['var(--font-unbound)'],
      },
      colors: {
        'primary': '#0e0e0e',
        "card": "#000000",
        "cardborder": "#27272A",
        'red': '#FA454D',
        "dark-red": "#491416",
        "light-red": "#FFBBBC",
        "deep-red": "#2F080A",
        "background": "rgb(var(--background-end-rgb))",
        "foreground": "rgb(var(--foreground-rgb))",
        "light": "rgb(var(--light))",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
