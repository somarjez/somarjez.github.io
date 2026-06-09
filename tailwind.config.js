/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0B12',
        panel: '#14141F',
        line: '#262635',
        primary: '#6D5EF8',
        'primary-dark': '#5B4FE0',
        accent: '#A78BFA',
        secondary: '#ff6b6b',
        // legacy aliases (neutral near-ink) so existing classNames match the Refined Midnight palette
        dark: '#0B0B12',
        darker: '#08080E',
        darkest: '#050509',
      },
      fontFamily: {
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
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
