/** @type {import('tailwindcss').Config} */
const color = (name) => `rgb(var(--color-${name}) / <alpha-value>)`

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: color('ink'),
        panel: color('panel'),
        'panel-2': color('panel-2'),
        line: color('line'),
        'line-bright': color('line-bright'),
        foreground: color('foreground'),
        muted: color('muted'),
        subtle: color('subtle'),
        primary: color('primary'),
        'primary-dark': color('primary-dark'),
        accent: color('accent'),
        secondary: color('secondary'),
        amber: color('amber'),
        green: color('green'),
        dark: color('ink'),
        darker: color('panel-2'),
        darkest: color('line'),
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
