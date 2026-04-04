/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'latino-blue': '#1e40af',
        'latino-red': '#dc2626',
        'latino-yellow': '#fbbf24',
        'latino-green': '#059669',
      }
    },
  },
  plugins: [],
}
