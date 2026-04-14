/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B132B',
          slate: '#3A506B',
          light: '#F4F7F6',
          accent: '#1C2541'
        }
      }
    },
  },
  plugins: [],
}
