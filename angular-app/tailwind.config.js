/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./src/index.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          50: 'var(--color-olive-50)',   // Sfondo #F2F3EE
          100: 'var(--color-olive-100)',
          200: 'var(--color-olive-200)',
          300: 'var(--color-olive-300)',
          400: 'var(--color-olive-400)',
          500: 'var(--color-olive-500)', // Bottoni #58C187
          900: 'var(--color-olive-900)', // Testo #2D4014
        }
      },
      backgroundImage: {
        'forest': "url('/assets/BackgroundForest.jpg')",
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('flowbite/plugin')
  ],
}