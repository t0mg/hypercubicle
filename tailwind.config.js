/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./main-game.html",
    "./{components,game,locales,types}/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-bg': '#1a1a2e',
        'brand-surface': '#16213e',
        'brand-primary': '#0f3460',
        'brand-secondary': '#e94560',
        'brand-text': '#dcdcdc',
        'brand-text-muted': '#a0a0a0',
        'brand-interest': '#f59e0b',
        'rarity-common': '#474545ff',
        'rarity-uncommon': '#9e8100ff',
        'rarity-rare': '#8d1dceff',
      },
      fontFamily: {
        sans: 'inherit',
      },
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
        'shake' : {
          '10%, 90%': {
              transform: 'translate3d(-1px, 0, 0)'
          },
          '20%, 80%': {
              transform: 'translate3d(2px, 0, 0)'
          },
          '30%, 50%, 70%': {
              transform: 'translate3d(-4px, 0, 0)'
          },
          '40%, 60%': {
              transform: 'translate3d(4px, 0, 0)'
          }
        },
        'attack': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(20px)' },
        },
        'defeat': {
          '0%': { filter: 'brightness(1) saturate(1)', opacity: '1' },
          '50%': { filter: 'brightness(1.5) saturate(1.5) hue-rotate(0deg)', opacity: '0.5' },
          '100%': { filter: 'brightness(2) saturate(2) hue-rotate(0deg)', opacity: '0' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'newly-drafted': 'newly-drafted-animation 1s ease-in-out',
        'shake': 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'attack': 'attack 0.5s ease-in-out once',
        'defeat': 'defeat 1s ease-in-out forwards',
      }
    },
  },
  plugins: [],
}
