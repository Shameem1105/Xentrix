/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#FDF2F4',
          100: '#FBE4E8',
          600: '#8E0922',
          700: '#6D071A', // Primary Accent
          800: '#520513',
          900: '#38030C',
          950: '#240207',
        },
        gold: {
          50: '#FAF6ED',
          100: '#F5EDDB',
          200: '#F3E5AB',
          300: '#E6CA65',
          400: '#D4AF37',
          500: '#C89B3C', // Rich Gold
          600: '#A8802E',
          700: '#876622',
        },
        richblack: '#111111',
        bordergray: '#ECECEC',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        playfair: ['Playfair Display', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'blueprint-grid': "radial-gradient(circle, rgba(109, 7, 26, 0.05) 1px, transparent 1px)",
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
