/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          950: '#1a100a',
          900: '#2c1d11',
          800: '#3c2a21',
          700: '#533e31',
          600: '#6f4e37',
          500: '#8b5e34',
          400: '#a47148',
          300: '#c59b73',
          200: '#d4a373',
          100: '#e8d8c8',
          50: '#f7f3ec'
        },
        cream: {
          50: '#fffdfa',
          100: '#fdfbf7',
          200: '#f7f3ec',
          300: '#efe9e0',
          400: '#e2d9cd'
        }
      }
    },
  },
  plugins: [],
}
