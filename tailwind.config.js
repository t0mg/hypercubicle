/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./{components,game,locales,types}/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
            '0%': { opacity: '0', transform: 'scale(0.95)' },
            '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'fade-in-up': {
            '0%': { opacity: '0', transform: 'translateY(20px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'newly-drafted-animation': {
            '0%': { boxShadow: '0 0 0 0 rgba(255, 215, 0, 0)', transform: 'scale(1.0)' },
            '50%': { boxShadow: '0 0 10px 5px rgba(255, 215, 0, 0.5)', transform: 'scale(1.05)' },
            '100%': { boxShadow: '0 0 0 0 rgba(255, 215, 0, 0)', transform: 'scale(1.0)' },
        },
      },
      animation: {
          'fade-in': 'fade-in 0.3s ease-out forwards',
          'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
          'newly-drafted': 'newly-drafted-animation 1s ease-in-out',
      }
    },
  },
  plugins: [],
}
