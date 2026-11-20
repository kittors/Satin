import { fileURLToPath } from "node:url";
import themeBoot from "satin-ui/theme-boot-script";

// Nuxt（服务端渲染）：样式走 css，theme-boot 内联进 <head>（第一帧之前写好深浅主题、圆角），组件在 plugins/satin.ts 里注册
export default defineNuxtConfig({
  compatibilityDate: "2026-11-01",
  devtools: { enabled: false },
  telemetry: false,
  css: ["satin-ui/css/page.css", fileURLToPath(new URL("../shared/sink.css", import.meta.url))],
  app: { head: { title: "Satin · Nuxt", htmlAttrs: { lang: "zh-CN" }, script: [{ innerHTML: themeBoot, tagPosition: "head" }] } },
});
