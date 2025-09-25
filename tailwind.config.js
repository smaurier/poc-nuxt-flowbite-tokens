module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './app.vue',
    './node_modules/flowbite/**/*.{js,vue,ts}'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        bg: 'var(--color-bg)',
        text: 'var(--color-text)'
      },
      borderRadius: {
        md: 'var(--radius-md)'
      },
      spacing: {
        2: 'var(--space-2)',
        4: 'var(--space-4)'
      },
      fontFamily: {
        sans: ['var(--font-sans)']
      }
    }
  },
  plugins: [require('flowbite/plugin')]
}
