// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  app: {
    head: {
      title: "Frontend Mentor - Connect Four game solution",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    }
  },
  css: [
    '~/assets/css/main.css',
    '~/assets/css/global.css',
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
