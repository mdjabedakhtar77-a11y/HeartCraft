/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heart: {
          dark: '#0f0717',
          purple: '#1a0b2e',
          card: '#241242',
          cardLight: '#311956',
          lavender: '#c084fc',
          softLavender: '#e9d5ff',
          pink: '#ec4899',
          rose: '#f43f5e',
          gold: '#fbbf24',
          cream: '#faf8f5',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
        handwriting: ['Caveat', 'cursive']
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(236, 72, 153, 0.4)',
        glowLavender: '0 0 25px -5px rgba(192, 132, 252, 0.4)',
        card: '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'shine': 'shine 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shine: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        }
      }
    },
  },
  plugins: [],
}
