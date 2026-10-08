/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0d14',
          sidebar: '#0e121b',
          card: '#131824',
          'card-hover': '#182030',
          editor: '#080a0f',
          border: '#1e2638',
          'border-light': '#2a354d',
        },
        brand: {
          blue: '#3b82f6',
          'blue-dark': '#1d4ed8',
          cyan: '#06b6d4',
          green: '#10b981',
          emerald: '#34d399',
          amber: '#f59e0b',
          rose: '#f43f5e',
          purple: '#8b5cf6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.4)',
        'glow-green': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
        'glow-rose': '0 0 25px -5px rgba(244, 63, 94, 0.4)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
