/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00d9ff',
        'primary-dark': '#00b8d4',
        accent: '#4ecdc4',
        secondary: '#ff6b6b',
        dark: '#0a0e27',
        darker: '#070b1f',
        darkest: '#04081a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translate(0,0) rotate(0deg)' },
          '50%': { transform: 'translate(-30px,30px) rotate(180deg)' },
        },
        'grid-move': {
          '0%': { transform: 'translate(0,0)' },
          '100%': { transform: 'translate(60px,60px)' },
        },
      },
      animation: {
        float: 'float 25s ease-in-out infinite',
        'grid-move': 'grid-move 30s linear infinite',
      },
    },
  },
  plugins: [],
}
