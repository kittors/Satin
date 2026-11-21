// 9 种写法：起步模板在 starters/<id>/（从仓库 examples/ 整理出来，去掉了截图对比、泄漏测试用的东西）。
// 版本：和仓库 examples 当前装着、验收过的版本同一大版本（^）；Angular 的 TypeScript 跟 Angular 要求的走（~）。
// variant：页面配方用哪种写法（Next 用 React 的、Nuxt 用 Vue 的）；src：检查器默认扫哪些（相对项目根目录）
const VITE = { dev: "vite", build: "vite build", preview: "vite preview" };
const ANGULAR = "^22.3.0";

export const FRAMEWORKS = {
  react: {
    title: "React（Vite）", variant: "react", src: ["src", "index.html"], module: true, scripts: VITE,
    deps: { react: "^19.3.1", "react-dom": "^19.3.1" }, dev: { vite: "^8.3.8", "@vitejs/plugin-react": "^6.3.0" },
    builds: { esbuild: true },
  },
  vue: {
    title: "Vue（Vite）", variant: "vue", src: ["src", "index.html"], module: true, scripts: VITE,
    deps: { vue: "^3.5.45" }, dev: { vite: "^8.3.8", "@vitejs/plugin-vue": "^6.0.11" },
    builds: { esbuild: true },
  },
  next: {
    title: "Next.js（App Router，服务端渲染）", variant: "react", src: ["app"], module: true,
    scripts: { dev: "next dev", build: "next build", start: "next start" },
    deps: { next: "^16.4.6", react: "^19.3.1", "react-dom": "^19.3.1" }, dev: {},
    builds: { sharp: false },
  },
  nuxt: {
    title: "Nuxt（服务端渲染）", variant: "vue", src: ["app"], module: true,
    scripts: { dev: "nuxt dev", build: "nuxt build", preview: "nuxt preview", start: "node .output/server/index.mjs" },
    deps: { nuxt: "^4.6.4", vue: "^3.5.45" }, dev: {},
    builds: { esbuild: true, "@parcel/watcher": true },
  },
  svelte: {
    title: "Svelte（Vite）", variant: "svelte", src: ["src", "index.html"], module: true, scripts: VITE,
    deps: {}, dev: { vite: "^8.3.8", svelte: "^5.58.0", "@sveltejs/vite-plugin-svelte": "^7.3.1" },
    builds: { esbuild: true },
  },
  angular: {
    title: "Angular", variant: "angular", src: ["src"], module: false,
    scripts: { dev: "ng serve", start: "ng serve", build: "ng build" },
    deps: { "@angular/core": ANGULAR, "@angular/common": ANGULAR, "@angular/compiler": ANGULAR, "@angular/platform-browser": ANGULAR, rxjs: "^7.8.2", tslib: "^2.9.1" },
    dev: { "@angular/cli": ANGULAR, "@angular/build": ANGULAR, "@angular/compiler-cli": ANGULAR, typescript: "~6.0.3" },
    builds: { esbuild: true, lmdb: true, "msgpackr-extract": true },
  },
  solid: {
    title: "Solid（Vite，Solid 2）", variant: "solid", src: ["src", "index.html"], module: true, scripts: VITE,
    deps: { "solid-js": "^2.0.3", "@solidjs/web": "^2.0.3" }, dev: { vite: "^8.3.8", "@solidjs/vite-plugin": "^3.0.1" },
    builds: { esbuild: true },
  },
  preact: {
    title: "Preact（Vite）", variant: "preact", src: ["src", "index.html"], module: true, scripts: VITE,
    deps: { preact: "^11.2.0" }, dev: { vite: "^8.3.8", "@preact/preset-vite": "^2.10.6" },
    builds: { esbuild: true },
  },
  html: {
    title: "纯 HTML（不用打包工具）", variant: "html", src: ["."], module: true,
    scripts: { dev: "node serve.mjs", start: "node serve.mjs" },
    deps: {}, dev: {}, builds: null,
  },
};
export const IDS = Object.keys(FRAMEWORKS);

// 已有项目是哪种写法：先看 satin init 在 package.json 里记下的，再看依赖；都没有但有 index.html 就当纯 HTML
export function detectFramework(pkg, hasIndexHtml) {
  if (FRAMEWORKS[pkg?.satin?.framework]) return pkg.satin.framework; // satin init 记下的
  const all = { ...(pkg?.dependencies || {}), ...(pkg?.devDependencies || {}) };
  if (all.next) return "next";
  if (all.nuxt) return "nuxt";
  if (all["@angular/core"]) return "angular";
  if (all.svelte) return "svelte";
  if (all["solid-js"]) return "solid";
  if (all.preact) return "preact";
  if (all.vue) return "vue";
  if (all.react) return "react";
  return hasIndexHtml ? "html" : null;
}
