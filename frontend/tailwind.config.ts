import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'walle-dark': '#0f0818',
        'walle-darker': '#1a0b2e',
        'walle-purple': '#3d2668',
        'walle-purple-light': '#5b3f8f',
        'walle-purple-card': 'rgba(93, 63, 143, 0.3)',
        'walle-accent': '#8b5cf6',
      },
      borderRadius: {
        'walle': '16px',
        'walle-lg': '24px',
      },
    },
  },
  plugins: [],
}
export default config
