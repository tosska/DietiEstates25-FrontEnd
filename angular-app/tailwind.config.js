/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
    "./src/index.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: { backgroundImage: {
        'forest': "url('/assets/BackgroundForest.jpg')",},
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('flowbite/plugin')
  ],
}

