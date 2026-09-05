/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        cinema: {
          950: '#0d0e12', // Base dark background
          900: '#14151c', // Card / Surface
          850: '#1a1b24', // Hover surface
          800: '#222430', // Divider / Border
          700: '#2d3040', // Highlight border
          500: '#71788a', // Muted text
          400: '#9ca3b5', // Secondary text
          100: '#f0f2f6', // Primary warm text
          accent: '#d97706', // Warm amber accent
        },
        studio: {
          950: '#0d0e12',
          900: '#14151c',
          850: '#1a1b24',
          800: '#222430',
          750: '#292d3b',
          700: '#323647',
          600: '#484e63',
          500: '#71788a',
          400: '#9ca3b5',
          100: '#f0f2f6'
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
