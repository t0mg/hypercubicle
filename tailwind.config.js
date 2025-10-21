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
        'fade-in-left': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
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
        'shake-slow': {
          '10%, 90%': {
              transform: 'translate3d(-1px, 0, 0)'
          },
          '20%, 80%': {
              transform: 'translate3d(2px, 0, 0)'
          },
          '30%, 50%, 70%': {
              transform: 'translate3d(-2px, 0, 0)'
          },
          '40%, 60%': {
              transform: 'translate3d(2px, 0, 0)'
          }
        },
        'attack-left': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-30%)' },
        },
        'attack-right': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(30%)' },
        },
        'miss-left': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translate(10px, -15px)' },
        },
        'miss-right': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translate(-10px, -15px)' },
        },
        'heal': {
          '0%, 100%': { transform: 'translateY(0)' },
          '10%': { transform: 'translateY(5px)' },
          '70%, 85%': { transform: 'translateY(-15px)' },
        },
        'defeat': {
          '0%': { filter: 'invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(1) contrast(1)', opacity: '1' },
          '50%': { filter: 'invert(15%) sepia(96%) saturate(7406%) hue-rotate(2deg) brightness(103%) contrast(114%)', opacity: '.9' },
          '100%': { filter: 'invert(15%) sepia(96%) saturate(7406%) hue-rotate(2deg) brightness(103%) contrast(114%)', opacity: '0' },
        },
        'boss-defeat': {
          '0%': { filter: 'invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(1) contrast(1)', opacity: '1' },
          '50%': { filter: 'invert(15%) sepia(96%) saturate(7406%) hue-rotate(2deg) brightness(103%) contrast(114%)', opacity: '.9' },
          '100%': { filter: 'invert(15%) sepia(96%) saturate(7406%) hue-rotate(2deg) brightness(103%) contrast(114%)', opacity: '0' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
        'newly-drafted': 'fade-in-up 0.5s ease-out forwards',
        'shake': 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'attack-right': 'attack-right 0.5s ease-out',
        'attack-left': 'attack-left 0.5s ease-out',
        'miss-right': 'miss-right 0.3s ease-out',
        'miss-left': 'miss-left 0.3s ease-out',
        'heal': 'heal 0.8s ease-in-out',
        'spawn': 'fade-in-left 0.5s ease-out forwards',
        'defeat': 'defeat 1s ease-in-out forwards',
        'boss-defeat': 'boss-defeat 2.5s ease-in-out forwards, shake-slow 2s ease-in-out forwards',
      }
    },
  },
  plugins: [],
}
