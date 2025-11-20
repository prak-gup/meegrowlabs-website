/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['DM Sans', 'system-ui', 'sans-serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        sage: {
          50: '#f7f9f8',
          100: '#e8f0ed',
          200: '#c7ddd5',
          300: '#a0c4b5',
          400: '#7aab96',
          500: '#5a9178',
        },
        cream: {
          50: '#fdfcfb',
          100: '#f9f7f4',
          200: '#f2ede7',
          300: '#e8dfd5',
        },
        mustard: {
          400: '#e6c67a',
          500: '#d4af5e',
        },
        slate: {
          800: '#2d3748',
          900: '#1a202c',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
      },
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
