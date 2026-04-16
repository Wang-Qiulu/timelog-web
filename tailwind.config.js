/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#111827',
        secondary: '#6B7280',
        background: '#FFFFFF',
        surface: '#F9FAFB',
        border: '#E5E7EB',
      },
    },
  },
  plugins: [],
}
