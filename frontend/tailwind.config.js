// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0a0f14', // Very dark background
          primary: '#00ffd5', // The bright cyan/teal
          secondary: '#111827',
        }
      },
      keyframes: {
        'bounce-in': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '70%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      animation: {
        'bounce-in': 'bounce-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      }
    }
  },
  plugins: [],
}