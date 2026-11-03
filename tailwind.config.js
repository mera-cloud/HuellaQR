/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        sage: {
          50: '#F4F7F3',
          100: '#E6EDE4',
          200: '#CFDBCC',
          300: '#B9C9B5',
          400: '#A8B9A5',
          500: '#8BA288',
          600: '#6E8569',
          700: '#56694F',
        },
        forest: {
          50: '#EEF2EF',
          100: '#D5DFD8',
          200: '#A9BDB0',
          300: '#7D9A8A',
          400: '#56766A',
          500: '#41594E',
          600: '#344A40',
          700: '#2A3B33',
          800: '#202D27',
          900: '#16201B',
        },
        cream: {
          50: '#FAFAF6',
          100: '#F5EBDD',
          200: '#EDDDC9',
        },
        clay: {
          50: '#FBF3EF',
          100: '#F4E2D9',
          200: '#E9C6B6',
          300: '#DDA995',
          400: '#C98D76',
          500: '#B0705A',
          600: '#8F5644',
          700: '#72432F',
        },
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.25s ease-out',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(52, 74, 64, 0.06), 0 8px 24px rgba(52, 74, 64, 0.08)',
        lift: '0 2px 4px rgba(52, 74, 64, 0.08), 0 16px 40px rgba(52, 74, 64, 0.14)',
      },
    },
  },
  plugins: [],
};
