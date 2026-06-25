/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f5f4',
          100: '#dce8e6',
          500: '#2C534C',
          600: '#1B3B36',
          700: '#152d29',
        },
        indigo: {
          50: '#f0f5f4',
          100: '#dce8e6',
          200: '#bdd2ce',
          300: '#94b3ae',
          400: '#648f88',
          500: '#2C534C', // teal.light
          600: '#1B3B36', // teal.DEFAULT
          700: '#152d29',
          800: '#10221f',
          900: '#0b1614',
          950: '#050a09',
        },
        teal: {
          DEFAULT: '#1B3B36',
          light: '#2C534C',
        },
        parchment: {
          DEFAULT: '#FBF4E8',
          dim: '#F2E9D8',
        },
        amber: {
          DEFAULT: '#E8A33D',
          dark: '#B97A1F',
          50: '#fefbf6',
          100: '#fdf4df',
          200: '#fae3be',
          300: '#f7cd91',
          400: '#f3b05f',
          500: '#E8A33D',
          600: '#B97A1F',
          700: '#8c5912',
          800: '#613c0b',
          900: '#412707',
          950: '#261502',
        },
        yellow: {
          50: '#fefbf6',
          100: '#fdf4df',
          200: '#fae3be',
          300: '#f7cd91',
          400: '#f3b05f',
          500: '#E8A33D',
          600: '#B97A1F',
          700: '#8c5912',
          800: '#613c0b',
          900: '#412707',
          950: '#261502',
        },
        coral: {
          DEFAULT: '#E2674A',
        },
        sage: {
          DEFAULT: '#6B8F71',
        },
        ink: {
          DEFAULT: '#20231F',
          soft: '#52564F',
        }
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}





