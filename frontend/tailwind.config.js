/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#0a0d12',
          900: '#0f1318',
          850: '#12171e',
          800: '#171d26',
          700: '#232b37',
          600: '#333e4d',
          500: '#4a5568',
          400: '#6b7688',
          300: '#94a0b3',
          200: '#c3cad6',
          100: '#e6e9ef',
        },
        accent: {
          DEFAULT: '#3b82c4',
          light: '#5aa0dd',
          dark: '#2a628f',
        },
        status: {
          healthy: '#2fa86a',
          warning: '#d99a2b',
          critical: '#d1453b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 2px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
      },
    },
  },
  plugins: [],
}
