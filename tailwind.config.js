/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#eef1f8',
          100: '#d5dced',
          600: '#1a2f6e',
          700: '#0D1B48',
          800: '#091430',
          900: '#060d20',
        },
        hcyan:   '#00AEEF',
        hyellow: '#FFD100',
        hgreen:  '#00A651',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
