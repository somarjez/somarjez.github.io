/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0e14',
        panel: '#0d1117',
        'panel-2': '#11161f',
        line: '#1f2430',
        'line-bright': '#2a3040',
        primary: '#7dcfff',
        'primary-dark': '#5aa8d8',
        accent: '#bb9af7',
        secondary: '#f7768e',
        amber: '#e0af68',
        green: '#9ece6a',
        // legacy aliases → Tokyo Night near-bg shades
        dark: '#0a0e14',
        darker: '#070a0f',
        darkest: '#05070b',
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
        blink: {
          '0%,49%': { opacity: '1' },
          '50%,100%': { opacity: '0' },
        },
      },
      animation: {
        float: 'float 25s ease-in-out infinite',
        'grid-move': 'grid-move 30s linear infinite',
        blink: 'blink 1s step-end infinite',
      },
    },
  },
  plugins: [],
}
