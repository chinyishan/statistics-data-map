// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  devServer: {
    host: "0.0.0.0", // default: localhost
    port: 2222,
  },
  css: ["@/assets/scss/style.scss"],
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
      title: "統計數據地圖",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [
        { name: "description", content: "統計數據地圖" },
        { name: "format-detection", content: "台灣人口分佈" },
        { property: "og:title", content: "統計數據地圖" },
        { property: "og:description", content: "台灣人口分佈" },
      ],
    },
  },
});
