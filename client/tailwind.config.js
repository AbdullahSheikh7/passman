/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        spinner: 'spinning 2s ease-in-out infinite, rotate 2s linear infinite',
      },
      keyframes: {
        spinning: {
          '0%, 100%': { strokeDasharray: '5 90' },
          '50%': { strokeDasharray: '90 5' },
        },
        rotate: {
          '0%': { rotate: '0deg' },
          '100%': { rotate: '360deg' },
        }
      }
    },
  },
  plugins: [],
}