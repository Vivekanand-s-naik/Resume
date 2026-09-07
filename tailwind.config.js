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
          DEFAULT: '#0C0C0C',
          50: '#1A1A1A',
          100: '#161616',
          200: '#121212',
          300: '#0C0C0C',
          400: '#080808',
        },
        light: {
          DEFAULT: '#D7E2EA',
          dim: '#8E9AA4',
          muted: '#5A646E',
          pure: '#FFFFFF',
        },
        accent: {
          purple: '#7621B0',
          magenta: '#B600A8',
          orange: '#BE4C00',
          deep: '#18011F',
          cyan: '#00F0FF',
          lime: '#39FF14'
        }
      },
      fontFamily: {
        sans: ['Kanit', 'sans-serif'],
      },
      letterSpacing: {
        architectural: '0.2em',
        widest: '0.15em',
        ultra: '0.3em',
      },
      borderRadius: {
        'card-sm': '32px',
        'card-md': '48px',
        'card-lg': '60px',
      }
    },
  },
  plugins: [],
}
