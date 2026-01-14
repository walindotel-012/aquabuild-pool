/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#1e40af',
          600: '#1e3a8a',
        },
        secondary: {
          500: '#0891b2',
        },
        success: {
          500: '#16a34a',
        },
        warning: {
          500: '#f59e0b',
        },
        danger: {
          500: '#dc2626',
        }
      }
    },
  },
  plugins: [],
}