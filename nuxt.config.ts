// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  devServer: {
    host: 'localhost', // default: localhost
    port: 2345,
  },
  css: ['@/assets/scss/style.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/_var.scss" as *;',
        },
      },
    },
  },
  app: {
    head: {
      title: '台灣歷年總統 都幾?',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'description', content: '台灣歷年總統 都幾?' },
        { name: 'format-detection', content: '台灣歷年總統票數統計' },
        { property: 'og:title', content: '台灣歷年總統 都幾?' },
        { property: 'og:description', content: '台灣歷年總統票數統計' },
        { property: 'og:image', content: '/web.jpg' },
      ],
      link: [
        {
          rel: 'Shortcut Icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
      ],
    },
  },
});
