/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {50: "#faf6ef",100: "#f3ede4",200: "#e5dbce",300: "#d0c2b2",400: "#948575",500: "#776b5e",600: "#61574c",700: "#493f35",800: "#302922",900: "#211c17",950: "#15120f"},
        brand: {
          50: '#fff5eb',
          100: '#ffead5',
          200: '#ffd0aa',
          300: '#ffb078',
          400: '#f98b46',
          500: '#f4650b',
          600: '#c84b00',
          700: '#ad3e08',
          800: '#8a3510',
          900: '#702f12',
          950: '#39190c',
        },
      },
      borderRadius: {xl: "8px", "2xl": "12px", "3xl": "16px"},
      boxShadow: {sm: "0 1px 2px rgb(45 33 20 / .03)", md: "0 4px 12px rgb(45 33 20 / .05)", lg: "0 8px 24px rgb(45 33 20 / .06)", xl: "0 16px 40px rgb(45 33 20 / .07)"},
      fontSize: {xs: ["0.8125rem", "1.35rem"]},
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
