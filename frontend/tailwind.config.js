/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        studio: {
          950: '#0c0d10',
          900: '#14161c',
          850: '#181b22',
          800: '#20242e',
          750: '#262a37',
          700: '#2d3242',
          600: '#3f4559',
          500: '#686f82',
          400: '#9ea4b5',
          100: '#e6e9f0'
        },
        gold: {
          DEFAULT: '#d97706',
          dark: '#b45309',
          light: '#f59e0b',
        }
      }
    },
  },
  plugins: [],
}
