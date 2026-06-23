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
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
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





