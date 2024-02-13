import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      colors: {
        'blue-baby': '#22B1C5'
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'spin-half': 'spinHalf 1s ease infinite'
      },
      keyframes: {
        spinHalf: {
          '0%': { transform: 'rotate(0deg)'},
          '100%': {transform: 'rotate(180deg)'}
        }
      }
    },
  },
  plugins: [],
}
export default config
