import themeBoot from "satin-ui/theme-boot-script";

// 样式走 css；theme-boot 内联进 <head>（第一帧之前写好深浅主题、圆角，刷新不闪）；组件在 app/plugins/satin.ts 里注册
export default defineNuxtConfig({
  compatibilityDate: "2026-11-01",
  devtools: { enabled: false },
  telemetry: false,
  css: ["satin-ui/css/page.css"],
  app: {
    head: {
      title: "新建项目",
      htmlAttrs: { lang: "zh-CN" },
      meta: [{ name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" }],
      script: [{ innerHTML: themeBoot, tagPosition: "head" }],
    },
  },
});
