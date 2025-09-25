export default defineNuxtConfig({
  compatibilityDate: '2025-09-25',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  modules: [],
  pages: true,
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  nitro: {
    compatibilityDate: '2025-09-25',
    routeRules: {},
    serverAssets: [
      {
        baseName: 'tokens',
        dir: 'tokens'
      }
    ]
  }
})
