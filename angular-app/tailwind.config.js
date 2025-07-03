/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
    "./src/index.{html,ts}"
  ],
  theme: {
    extend: { backgroundImage: {
        'forest': "url('/assets/BackgroundForest.jpg')",},
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
  ],
}

