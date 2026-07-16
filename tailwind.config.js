/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Archivo Black', 'system-ui', 'sans-serif'],
        body: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Canonical static-system palette. Keep in sync with public/assets/site.css.
        cream: {
          50:  '#FDFCF8',
          100: '#F7F3E9', // --bg
          200: '#EFE9D9', // --bg2
          300: '#e4ddc9', // --line
        },
        green: {
          50:  '#E8F3EC',
          100: '#C9E3D3',
          600: '#13703A', // --green
          700: '#0E5429', // darker than 600 — hover states depend on this
          800: '#0A3D1E',
        },
        slate: {
          200: '#e4ddc9', // --line (borders)
          400: '#8a8577',
          500: '#6f6a5c',
          600: '#5b5749', // --muted
          700: '#3a372f',
          800: '#23211c',
          900: '#0F0F0F', // --ink
        },
        sage: {
          200: '#e4ddc9',
          400: '#7aab96',
          500: '#5a9178',
        },
        mustard: {
          400: '#F5C518',
          500: '#D9A400',
        },
        accent: {
          500: '#D97757', // --accent
        },
      },
      animation: { 'fade-in': 'fadeIn 0.6s ease-out' },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
