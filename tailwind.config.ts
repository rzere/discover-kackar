import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#67C090',
          50: '#E8F6EE',
          100: '#D6EFDE',
          200: '#B2E2C1',
          300: '#8FD4A4',
          400: '#6BC787',
          500: '#67C090',
          600: '#4EA574',
          700: '#3C8056',
          800: '#2A5B39',
          900: '#18361C',
        },
        secondary: {
          DEFAULT: '#DDF4E7',
          50: '#F7FCF9',
          100: '#DDF4E7',
          200: '#BBE9CF',
          300: '#99DEB7',
          400: '#77D39F',
          500: '#55C887',
          600: '#44A06C',
          700: '#337851',
          800: '#225036',
          900: '#11281B',
        },
        teal: {
          DEFAULT: '#26667F',
          50: '#E6F0F4',
          100: '#CCE1E9',
          200: '#99C3D3',
          300: '#66A5BD',
          400: '#3387A7',
          500: '#26667F',
          600: '#1E5166',
          700: '#173C4C',
          800: '#0F2733',
          900: '#081219',
        },
        navy: {
          DEFAULT: '#124170',
          50: '#E4E9F0',
          100: '#C9D3E1',
          200: '#93A7C3',
          300: '#5D7BA5',
          400: '#274F87',
          500: '#124170',
          600: '#0E3459',
          700: '#0B2742',
          800: '#071A2B',
          900: '#040D14',
        },
      },
      fontFamily: {
        'serif': ['Instrument Serif', 'serif'],
        'sans': ['Lato', 'sans-serif'],
      },
      fontSize: {
        'hero': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
    },
  },
  plugins: [],
}

export default config