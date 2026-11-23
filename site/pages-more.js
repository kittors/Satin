// 新版官网（next-docs.html）多出来的几页（站点地图见 docs/site-ia.md）：框架接入、移动端与 H5 放进"开始"一组，给 AI 用、评测结果单独一组。
// 旧版文档页（docs.html）不读这个文件，原样不动。块的写法和 pages.js 一样，另外多两种：
//   ["files", [{ name, lang, code }, …]]  一组文件（标签切换），每个框架一段
//   ["img", 地址, 宽, 高, 说明]            一张图（写上宽高，载入前就占好位置）

import { START } from "./pages.js";

// ———— 框架接入：每个框架一段能直接跑的最小例子（分段控件 + 按钮 + 轻提示） ————
const ITEMS = '["网格", "列表", "时间线"]';
const FW = [
  ["React", "Vite 新建项目以后，改下面三个文件。应用最外面包一层 <code>&lt;SatinProvider&gt;</code>，页面级行为（Tooltip、浮层栈、Esc 关闭）只在这里装一次，各个页面、组件里不用再写；组件在 <code>satin-ui/react</code> 里：给 <code>value</code> 就是受控，只给 <code>defaultValue</code> 是非受控。", [
    { name: "终端", lang: "sh", code: "npm create vite@latest my-app -- --template react\ncd my-app\nnpm i satin-ui\nnpm run dev" },
    { name: "vite.config.js", lang: "js", code: 'import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\nimport satin from "satin-ui/vite"; // 把 theme-boot 内联进 <head>：第一帧之前写好深浅主题，刷新不闪\n\nexport default defineConfig({ plugins: [react(), satin()] });' },
    { name: "src/main.jsx", lang: "jsx", code: 'import { StrictMode } from "react";\nimport { createRoot } from "react-dom/client";\nimport { SatinProvider } from "satin-ui/react";\nimport "satin-ui/css/page.css"; // 令牌 + 页面级重置 + 全部组件样式\nimport App from "./App.jsx";\n\n// 页面级行为在应用最外面装一次\ncreateRoot(document.getElementById("root")).render(\n  <StrictMode>\n    <SatinProvider>\n      <App />\n    </SatinProvider>\n  </StrictMode>,\n);' },
    { name: "src/App.jsx", lang: "jsx", code: `import { useState } from "react";\nimport { Button, Segmented, toast } from "satin-ui/react";\n\nexport default function App() {\n  const [view, setView] = useState("网格");\n  return (\n    <main className="sn-page sn-stack">\n      <Segmented items={${ITEMS}} value={view} onChange={setView} />\n      <div className="sn-row">\n        <Button variant="primary" onClick={() => toast({ text: "已新建，视图：" + view })}>新建项目</Button>\n      </div>\n    </main>\n  );\n}` },
  ]],
  ["Vue", "<code>app.use(Satin)</code> 以后，模板里直接写 <code>&lt;SnButton&gt;</code>、<code>&lt;SnSegmented v-model&gt;</code>。", [
    { name: "终端", lang: "sh", code: "npm create vite@latest my-app -- --template vue\ncd my-app\nnpm i satin-ui\nnpm run dev" },
    { name: "vite.config.js", lang: "js", code: 'import { defineConfig } from "vite";\nimport vue from "@vitejs/plugin-vue";\nimport satin from "satin-ui/vite";\n\nexport default defineConfig({ plugins: [vue(), satin()] });' },
    { name: "src/main.js", lang: "js", code: 'import { createApp } from "vue";\nimport Satin from "satin-ui/vue";\nimport "satin-ui/css/page.css";\nimport App from "./App.vue";\n\ncreateApp(App).use(Satin).mount("#app");' },
    { name: "src/App.vue", lang: "vue", code: `<script setup>\nimport { ref } from "vue";\nimport { toast } from "satin-ui/vue";\nconst view = ref("网格");\n</script>\n\n<template>\n  <main class="sn-page sn-stack">\n    <SnSegmented v-model="view" :items='${ITEMS}' />\n    <div class="sn-row">\n      <SnButton variant="primary" @click="toast({ text: '已新建，视图：' + view })">新建项目</SnButton>\n    </div>\n  </main>\n</template>` },
  ]],
  ["Svelte", "有交互的组件用自定义元素 <code>&lt;sn-xxx&gt;</code>（数组、对象写成 JSON），纯样式的组件直接写 <code>sn-</code> 类名；入口里调一次 <code>setup()</code> 和 <code>defineElements()</code>。", [
    { name: "终端", lang: "sh", code: "npm create vite@latest my-app -- --template svelte\ncd my-app\nnpm i satin-ui\nnpm run dev" },
    { name: "vite.config.js", lang: "js", code: 'import { defineConfig } from "vite";\nimport { svelte } from "@sveltejs/vite-plugin-svelte";\nimport satin from "satin-ui/vite";\n\nexport default defineConfig({ plugins: [svelte(), satin()] });' },
    { name: "src/main.js", lang: "js", code: 'import { mount } from "svelte";\nimport { setup } from "satin-ui";\nimport { defineElements } from "satin-ui/elements";\nimport "satin-ui/css/page.css";\nimport App from "./App.svelte";\n\nsetup(); defineElements();\nmount(App, { target: document.getElementById("app") });' },
    { name: "src/App.svelte", lang: "html", code: `<script>\n  import { toast } from "satin-ui/components";\n  let view = $state("网格");\n</script>\n\n<main class="sn-page sn-stack">\n  <sn-segmented items='${ITEMS}' value={view} onsn-change={(e) => (view = e.detail)}></sn-segmented>\n  <div class="sn-row">\n    <button class="sn-btn sn-primary" onclick={() => toast({ text: "已新建，视图：" + view })}>新建项目</button>\n  </div>\n</main>` },
  ]],
  ["Angular", "自定义元素要在组件上加 <code>CUSTOM_ELEMENTS_SCHEMA</code>；属性用 <code>[attr.xxx]</code> 绑定，事件写 <code>(sn-change)</code>。<code>theme-boot</code> 要在第一帧之前跑，所以拷成静态文件、在 <code>index.html</code> 的 <code>&lt;head&gt;</code> 里引。", [
    { name: "终端", lang: "sh", code: "npx @angular/cli@latest new my-app --style css --ssr false\ncd my-app\nnpm i satin-ui\nnpm start" },
    { name: "angular.json（build 的 options）", lang: "json", code: '"assets": [\n  { "glob": "**/*", "input": "public" },\n  { "glob": "theme-boot.js", "input": "node_modules/satin-ui/src", "output": "/" }\n],\n"styles": ["src/styles.css"]' },
    { name: "src/index.html（<head> 里加一行）", lang: "html", code: '<script src="theme-boot.js"></script>' },
    { name: "src/styles.css", lang: "css", code: '@import "satin-ui/css/page.css";' },
    { name: "src/main.ts", lang: "ts", code: 'import { bootstrapApplication } from "@angular/platform-browser";\nimport { setup } from "satin-ui";\nimport { defineElements } from "satin-ui/elements";\nimport { appConfig } from "./app/app.config";\nimport { App } from "./app/app";\n\nsetup(); defineElements();\nbootstrapApplication(App, appConfig).catch((e) => console.error(e));' },
    { name: "src/app/app.ts", lang: "ts", code: 'import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";\nimport { toast } from "satin-ui/components";\n\n@Component({\n  selector: "app-root",\n  schemas: [CUSTOM_ELEMENTS_SCHEMA],\n  template: `\n    <main class="sn-page sn-stack">\n      <sn-segmented [attr.items]="items" [attr.value]="view" (sn-change)="onView($event)"></sn-segmented>\n      <div class="sn-row">\n        <button class="sn-btn sn-primary" (click)="create()">新建项目</button>\n      </div>\n    </main>`,\n})\nexport class App {\n  items = JSON.stringify(["网格", "列表", "时间线"]);\n  view = "网格";\n  onView(e: Event) { this.view = (e as CustomEvent<string>).detail; }\n  create() { toast({ text: "已新建，视图：" + this.view }); }\n}' },
  ]],
  ["Solid", "按 Solid 2 写（<code>@solidjs/web</code>、<code>@solidjs/vite-plugin</code>）。和 Svelte 一样用自定义元素，事件在 <code>ref</code> 里用 <code>addEventListener</code> 接。", [
    { name: "终端", lang: "sh", code: "mkdir my-app && cd my-app && npm init -y\nnpm i solid-js @solidjs/web satin-ui\nnpm i -D vite @solidjs/vite-plugin\nnpx vite" },
    { name: "vite.config.js", lang: "js", code: 'import { defineConfig } from "vite";\nimport solid from "@solidjs/vite-plugin";\nimport satin from "satin-ui/vite";\n\nexport default defineConfig({ plugins: [solid(), satin()] });' },
    { name: "index.html", lang: "html", code: '<!doctype html>\n<html lang="zh-CN">\n<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Satin</title></head>\n<body><div id="app"></div><script type="module" src="/src/main.jsx"></script></body>\n</html>' },
    { name: "src/main.jsx", lang: "jsx", code: 'import { render } from "@solidjs/web";\nimport { setup } from "satin-ui";\nimport { defineElements } from "satin-ui/elements";\nimport "satin-ui/css/page.css";\nimport App from "./App.jsx";\n\nsetup(); defineElements();\nrender(App, document.getElementById("app"));' },
    { name: "src/App.jsx", lang: "jsx", code: `import { createSignal } from "solid-js";\nimport { toast } from "satin-ui/components";\n\nexport default function App() {\n  const [view, setView] = createSignal("网格");\n  return (\n    <main class="sn-page sn-stack">\n      <sn-segmented items='${ITEMS}' value={view()} ref={(el) => el.addEventListener("sn-change", (e) => setView(e.detail))} />\n      <div class="sn-row">\n        <button class="sn-btn sn-primary" onClick={() => toast({ text: "已新建，视图：" + view() })}>新建项目</button>\n      </div>\n    </main>\n  );\n}` },
  ]],
  ["Preact", "用自定义元素；事件写成 <code>onsn-change</code>。", [
    { name: "终端", lang: "sh", code: "npm create vite@latest my-app -- --template preact\ncd my-app\nnpm i satin-ui\nnpm run dev" },
    { name: "vite.config.js", lang: "js", code: 'import { defineConfig } from "vite";\nimport preact from "@preact/preset-vite";\nimport satin from "satin-ui/vite";\n\nexport default defineConfig({ plugins: [preact(), satin()] });' },
    { name: "src/main.jsx", lang: "jsx", code: 'import { render } from "preact";\nimport { setup } from "satin-ui";\nimport { defineElements } from "satin-ui/elements";\nimport "satin-ui/css/page.css";\nimport { App } from "./app.jsx";\n\nsetup(); defineElements();\nrender(<App />, document.getElementById("app"));' },
    { name: "src/app.jsx", lang: "jsx", code: `import { useState } from "preact/hooks";\nimport { toast } from "satin-ui/components";\n\nexport function App() {\n  const [view, setView] = useState("网格");\n  return (\n    <main class="sn-page sn-stack">\n      <sn-segmented items='${ITEMS}' value={view} onsn-change={(e) => setView(e.detail)} />\n      <div class="sn-row">\n        <button class="sn-btn sn-primary" onClick={() => toast({ text: "已新建，视图：" + view })}>新建项目</button>\n      </div>\n    </main>\n  );\n}` },
  ]],
  ["纯 HTML", "不用打包工具：<code>theme-boot</code> 放在 <code>&lt;head&gt;</code> 最前面，样式、脚本按 <code>node_modules</code> 里的路径引（路径按你放文件的位置改），用任何静态服务器打开。", [
    { name: "index.html", lang: "html", code: `<!doctype html>\n<html lang="zh-CN">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<script src="/node_modules/satin-ui/src/theme-boot.js"></script>\n<link rel="stylesheet" href="/node_modules/satin-ui/css/page.css">\n<title>Satin</title>\n</head>\n<body>\n<main class="sn-page sn-stack">\n  <sn-segmented items='${ITEMS}' value="网格"></sn-segmented>\n  <div class="sn-row">\n    <button class="sn-btn sn-primary" id="create">新建项目</button>\n  </div>\n</main>\n<script type="module">\n  import { setup } from "/node_modules/satin-ui/src/index.js";\n  import { toast } from "/node_modules/satin-ui/src/components.js";\n  import { defineElements } from "/node_modules/satin-ui/elements/index.js";\n  setup(); defineElements();\n  let view = "网格";\n  document.querySelector("sn-segmented").addEventListener("sn-change", (e) => (view = e.detail));\n  document.getElementById("create").addEventListener("click", () => toast({ text: "已新建，视图：" + view }));\n</script>\n</body>\n</html>` },
  ]],
  ["Next.js", "App Router。<code>satin-ui/react</code> 的组件已经标了 <code>\"use client\"</code>，服务端组件里也能直接用（服务端输出完整标记，水合以后接上交互）；用到 <code>useState</code> 的文件自己要标 <code>\"use client\"</code>。", [
    { name: "终端", lang: "sh", code: "npx create-next-app@latest my-app   # 选 JavaScript、App Router；Tailwind 选 No\ncd my-app\nnpm i satin-ui\nnpm run dev" },
    { name: "app/layout.js", lang: "jsx", code: 'import themeBoot from "satin-ui/theme-boot-script";\nimport "satin-ui/css/page.css";\n\n// theme-boot 在第一帧之前改 <html> 上的属性（深浅主题、圆角），所以 <html> 要加 suppressHydrationWarning\nexport default function RootLayout({ children }) {\n  return (\n    <html lang="zh-CN" suppressHydrationWarning>\n      <head><script dangerouslySetInnerHTML={{ __html: themeBoot }} /></head>\n      <body>{children}</body>\n    </html>\n  );\n}' },
    { name: "app/page.js", lang: "jsx", code: `"use client";\nimport { useState } from "react";\nimport { Button, Segmented, toast } from "satin-ui/react";\n\nexport default function Page() {\n  const [view, setView] = useState("网格");\n  return (\n    <main className="sn-page sn-stack">\n      <Segmented items={${ITEMS}} value={view} onChange={setView} />\n      <div className="sn-row">\n        <Button variant="primary" onClick={() => toast({ text: "已新建，视图：" + view })}>新建项目</Button>\n      </div>\n    </main>\n  );\n}` },
  ]],
  ["Nuxt", "样式写进 <code>css</code>，<code>theme-boot</code> 内联进 <code>&lt;head&gt;</code>，组件在插件里注册；服务端也能渲染，交互在水合以后接上。", [
    { name: "终端", lang: "sh", code: "npm create nuxt@latest my-app\ncd my-app\nnpm i satin-ui\nnpm run dev" },
    { name: "nuxt.config.ts", lang: "ts", code: 'import themeBoot from "satin-ui/theme-boot-script";\n\nexport default defineNuxtConfig({\n  css: ["satin-ui/css/page.css"],\n  app: { head: { script: [{ innerHTML: themeBoot, tagPosition: "head" }] } },\n});' },
    { name: "app/plugins/satin.ts", lang: "ts", code: 'import Satin from "satin-ui/vue";\n\nexport default defineNuxtPlugin((nuxtApp) => { nuxtApp.vueApp.use(Satin); });' },
    { name: "app/app.vue", lang: "vue", code: `<script setup>\nimport { ref } from "vue";\nimport { toast } from "satin-ui/vue";\nconst view = ref("网格");\n</script>\n\n<template>\n  <main class="sn-page sn-stack">\n    <SnSegmented v-model="view" :items='${ITEMS}' />\n    <div class="sn-row">\n      <SnButton variant="primary" @click="toast({ text: '已新建，视图：' + view })">新建项目</SnButton>\n    </div>\n  </main>\n</template>` },
  ]],
];
// 检查片段能不能直接跑的脚本（scripts/site/snippets.mjs）也读这一份
export const FRAMEWORK_SNIPPETS = FW.map(([name, note, files]) => ({ name, note, files }));
const FW_ID = { React: "react", Vue: "vue", Svelte: "svelte", Angular: "angular", Solid: "solid", Preact: "preact", "纯 HTML": "html", "Next.js": "next", Nuxt: "nuxt" };
export const FW_SETUP = Object.fromEntries(FW.map(([name, note, files]) => [FW_ID[name], { name, note, files }]));
// 跟着框架变的一段：每个框架（和环境）一组块
const perFw = (make) => Object.fromEntries(Object.entries(FW_SETUP).map(([id, x]) => [id, make(id, x)]));

export const START_MORE = [
  {
    id: "frameworks", title: "框架接入", en: "Frameworks",
    lead: "同一套组件，九种写法。下面每一段都是一个能直接跑的最小项目：一个分段控件、一个按钮，点按钮弹一条轻提示。",
    body: [
      ["h2", "先选写法"],
      ["table", ["写法", "用什么", "适合"], [
        ["React、Next.js", "<code>satin-ui/react</code> 里的组件", "要受控 / 非受控、要服务端渲染"],
        ["Vue、Nuxt", "<code>satin-ui/vue</code>：<code>app.use(Satin)</code> 以后写 <code>&lt;SnXxx&gt;</code>", "模板里写 <code>v-model</code>"],
        ["Svelte、Angular、Solid、Preact、纯 HTML", "自定义元素 <code>&lt;sn-xxx&gt;</code> + 纯样式的类名", "任何能写 HTML 的地方"],
        ["任何写法", "<code>createXxx(元素, 选项)</code>：返回实例，有 <code>update</code>、<code>destroy</code>", "数据表格、流程图、对话这类重组件，或者想自己管生命周期"],
      ]],
      ["p", "几种写法画出来一模一样：React、Vue 组件和自定义元素都是在同一个 <code>createXxx</code> 外面包一层。纯样式的组件（按钮、输入框、标签……）在哪种框架里都直接写 <code>sn-</code> 类名。<b>右上角选好框架以后，整个网站的代码都换成这个框架的写法</b>（组件页、配方、快速上手、CLI）。"],
      ["h2", "接入步骤"],
      ["fw", perFw((id, x) => [["p", `<b>${x.name}</b>：${x.note}`], ["files", x.files]])],
      ["p", "换一个框架看：" + Object.entries(FW_ID).map(([n, id]) => `<button class="sn-btn sn-tertiary sn-sm" data-set-fw="${id}">${n}</button>`).join(" ")],
      ["h2", "重组件"],
      ["p", "数据表格、Canvas 表格、流程图、对话、Markdown 在各自的子路径里（<code>satin-ui/grid</code>、<code>satin-ui/flow</code>……），用 <code>createXxx</code> 挂到一个空容器上。React、Vue 里直接用组件（数据表格是 <code>satin-ui/react/grid</code>、<code>satin-ui/vue/grid</code> 的 <code>DataGrid</code>，Canvas 表格是 <code>canvas-grid</code> 的 <code>CanvasGrid</code>），属性、事件和 <code>createXxx</code> 的选项一一对应；还没有专门组件的，用 <code>wrapSatin(createXxx)</code> 包一层。组件页上每个演示的代码都是当前框架的写法，取自仓库里构建、截图比对过的全量示例。"],
      ["code", "jsx", 'import { DataGrid } from "satin-ui/react/grid";\n\n// 列：key 取行里的哪个字段；type 选内置的显示（status 带色点、int 右对齐）\nconst columns = [\n  { key: "name", title: "名称", sortable: true },\n  { key: "status", title: "状态", type: "status", options: ["待开始", "进行中", "已完成"] },\n  { key: "shots", title: "镜头", type: "int", sortable: true },\n];\n\nexport default function Projects({ rows }) {\n  // 数据在服务端时换成 dataSource={{ total, load({ start, end, sort, filter }) }}，按块加载\n  return <DataGrid columns={columns} data={rows} rowKey="id" onSortChange={(sort) => console.log(sort)} />;\n}'],
      ["h2", "仓库里的完整示例"],
      ["p", "<code>examples/</code> 下每种写法一个项目：<code>index.html</code> 是同一批组件的对照页，<code>gallery.html</code>（Next.js、Nuxt 是 <code>/gallery</code>）是设计稿 61 块的全部演示，逐块截图和设计稿比对。官网组件页、配方页的代码就是这些文件。"],
    ],
  },
  {
    id: "mobile", title: "移动端与 H5", en: "Mobile & H5",
    lead: "组件在手机上照样能用。库已经处理了触屏上常见的几个坑；写页面时还要自己做几件事。",
    body: [
      ["h2", "库做了什么"],
      ["table", ["情况", "处理"], [
        ["触屏点完按钮一直是悬停色（iOS Safari 尤其明显）", "悬停样式只在有悬停的设备上生效（<code>@media (hover: hover)</code>）"],
        ["悬停才出现的操作（表格行操作、通知的关闭、附件的移除、卡片的勾选）", "触屏上一直显示"],
        ["刘海屏、底部横条", "轻提示、通知、抽屉让开安全区（<code>env(safe-area-inset-*)</code>）；<code>.sn-bottom-bar</code> 让开底部横条"],
        ["软键盘弹出时盖住贴底的操作栏", "<code>setup()</code> 按 visualViewport 算出键盘盖住的高度，写成 <code>--sn-kb</code>；<code>.sn-bottom-bar</code> 停在键盘上面"],
        ["iOS 聚焦字号小于 16px 的输入框会把整页放大", "触屏上输入框字号 16px"],
        ["iOS 长按不发 contextmenu", "右键菜单（<code>data-ctx</code>）在触屏上长按 500ms 打开，不弹系统菜单、不选中文字"],
        ["抽屉只能点关闭", "手指往右拖就能关：跟手走，拖过三成宽或甩得快就关，不然弹回"],
        ["侧栏在手机上占掉一半宽度", "<code>createSidebar(el, { collapseBelow: 720 })</code>（<code>enhance()</code> 默认就是 720）：窄于 720 自动收成图标栏"],
        ["小图标按钮点不中", "加 <code>sn-tap</code>：样子不变，能点到的范围至少 44×44"],
        ["<code>100vh</code> 在手机上包括地址栏", "骨架类用 <code>100dvh</code>"],
      ]],
      ["h2", "你要做什么"],
      ["ul", [
        "<code>&lt;meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\"&gt;</code>；不要写 <code>maximum-scale=1</code>，看不清的人要能放大。",
        "单栏布局，字段一栏，间距 20；页面左右留 16（<code>.sn-page</code> 在窄屏上自动收）。",
        "主操作放在底部的 <code>.sn-bottom-bar</code>（总价 + 一个主按钮），页面底部留出操作栏的高度。",
        "可点的东西至少 44×44：按钮用 <code>sn-lg</code>，图标按钮加 <code>sn-tap</code>，列表行整行可点；可点的元素之间至少隔 8px。",
        "选择用底部抽屉或选择器，不要跳到新页面再跳回来；不要用 <code>alert()</code>。",
        "不要只靠悬停给信息：Tooltip 里的内容在手机上要能点开看，或者直接写在界面上。",
        "横向不能滚动：表格在手机上改成一行一张的列表，或者放进 <code>.sn-tbl-sc</code> 让它自己横着滑。",
      ]],
      ["code", "html", '<!-- 手机上的下单页：单栏 + 底部操作栏 -->\n<main class="sn-page sn-narrow sn-stack sn-gap-20">\n  <header class="sn-page-hd"><h1>确认订单</h1></header>\n  <!-- 字段、商品列表…… -->\n</main>\n<div class="sn-bottom-bar">\n  <span class="sn-num">合计 ¥ 1,280</span>\n  <button class="sn-btn sn-primary sn-lg">提交订单</button>\n</div>'],
      ["h2", "怎么检查"],
      ["p", "深浅两套主题、390 宽都要截图看一遍。技能里的检查器会在 1440、768、390 三种宽度下打开页面，量点击区大小和横向溢出："],
      ["code", "sh", "node <技能目录>/scripts/check.mjs dom http://localhost:5173/"],
      ["p", "组件库自己的移动端验收在 <code>scripts/mobile/check.mjs</code>：用 Chrome 模拟 390 宽的触屏手机和 iOS Safari 内核各跑一遍，手指滑动用浏览器合成的触摸手势，量滚动和动效的帧间隔。"],
    ],
  },
];

// ———— 给 AI 用：安装与用法、AGENTS.md、检查器、评测结果 ————
const SNIPPET = "## 界面：用 Satin\n\n做任何页面、组件、样式之前，先读 `<skill>/SKILL.md`，按它做：\n\n- 用 `satin-ui` 的组件和 `sn-` 类名；颜色、间距、字号、圆角、阴影、动效只用 Satin 令牌（`var(--sn-…)`），不写死颜色、不用渐变、不用 emoji 当图标\n- 整页先套 `<skill>/references/recipes.md` 里对应的页面配方，再换内容；内容用真实的名字、数字、日期\n- 做完跑检查器，error 改到 0：\n  - `node <skill>/scripts/check.mjs static <源码目录>`\n  - `node <skill>/scripts/check.mjs dom <页面地址>`（深浅 × 桌面 / 平板 / 手机截图在 /tmp/satin-check/，逐张看）";
export const AI_PAGES = [
  {
    id: "ai", title: "安装与用法", en: "Skill",
    lead: "Satin 带一个技能（skill）：编码助手先读它，再照着写界面。它写清楚了组件怎么选、页面怎么搭、哪些写法是 AI 味；写完再跑检查器，把问题改到 0。",
    body: [
      ["h2", "技能里有什么"],
      ["table", ["文件", "内容"], [
        ["<code>SKILL.md</code>", "主文档：怎么装、页面配方一览、\"要做什么 → 用什么\"选择表、页面骨架类、常用令牌、硬规则、常见错误、怎么自查"],
        ["<code>references/</code>", "按需读的参考：64 个区块各一份、令牌全表、去 AI 味规则全文、图标名、9 种页面配方、手机和 H5"],
        ["<code>scripts/check.mjs</code>", "检查器：<code>static</code> 查源码，<code>dom</code> 在浏览器里量页面（见<a href=\"#/checker\">检查器</a>）"],
        ["<code>AGENTS.snippet.md</code>", "放进项目 <code>AGENTS.md</code> 或 <code>CLAUDE.md</code> 的一段话（见<a href=\"#/agents\">AGENTS.md</a>）"],
      ]],
      ["p", "技能在 Satin 仓库的 <code>skills/satin/</code>；<code>references/</code> 由 <code>node scripts/skill/build.mjs</code> 从规范和组件文档生成，和库保持一致。项目里还要装 <code>satin-ui</code>。用 <a href=\"#/cli\">CLI 创建的项目</a>已经装好了技能和 AGENTS.md。"],
      ["h2", "装进 Claude Code"],
      ["p", "整个目录拷到项目的 <code>.claude/skills/satin/</code>（只给这个项目用），或者 <code>~/.claude/skills/satin/</code>（所有项目都能用）。Claude Code 按技能的描述自己决定什么时候读。"],
      ["code", "sh", "npm i satin-ui\nmkdir -p .claude/skills\ncp -R <Satin 仓库>/skills/satin .claude/skills/satin"],
      ["h2", "装进 Codex"],
      ["p", "拷到项目的 <code>.agents/skills/satin/</code>，或者 <code>~/.codex/skills/satin/</code>。"],
      ["code", "sh", "npm i satin-ui\nmkdir -p .agents/skills\ncp -R <Satin 仓库>/skills/satin .agents/skills/satin"],
      ["h2", "怎么用"],
      ["ul", [
        "直接说要做什么页面：\"做一个项目列表页，左边侧栏，能搜索、按状态筛选、分页\"。助手会先读 <code>SKILL.md</code>，套<a href=\"#/recipes\">页面配方</a>搭骨架，再往里放组件。",
        "两种都建议再把<a href=\"#/agents\">那一段</a>放进 <code>AGENTS.md</code> 或 <code>CLAUDE.md</code>：就算助手没主动加载技能，也会先读它。",
        "做完让它跑检查器、改到 0 个 error，再看深浅两套、手机宽度的截图。",
      ]],
      ["h2", "效果"],
      ["p", "低档模型用和不用技能各做一遍同样的页面，比较检查器报的问题、截图和交互，见<a href=\"#/eval\">评测结果</a>。"],
    ],
  },
  {
    id: "agents", title: "AGENTS.md", en: "AGENTS.md",
    lead: "放进项目说明文件的一段话：编码助手每次开工都会读它，所以就算没主动加载技能，也会先去读 Satin 的规范。",
    body: [
      ["h2", "放在哪"],
      ["table", ["助手", "文件", "技能目录"], [
        ["Codex", "项目根目录的 <code>AGENTS.md</code>", "<code>.agents/skills/satin</code>"],
        ["Claude Code", "项目根目录的 <code>CLAUDE.md</code>", "<code>.claude/skills/satin</code>"],
      ]],
      ["p", "下面这段原文在技能目录的 <code>AGENTS.snippet.md</code> 里。<code>&lt;skill&gt;</code> 换成技能实际所在的目录。"],
      ["code", "md", SNIPPET],
      ["h2", "为什么要这一段"],
      ["ul", [
        "助手是否加载技能，要看它对任务的判断；说明文件每次都会读，这一段保证它先看规范再动手。",
        "三条都是能检查的要求：只用 Satin 的类名和令牌、先套页面配方、检查器改到 0。写得含糊（\"要好看\"）助手没法照做。",
        "已经有 <code>AGENTS.md</code> 的项目，把这一段加在末尾就行，不用改别的。用 CLI 的 <code>skill</code> 命令装的，会用注释标出这一段，重复运行只更新这一段。",
      ]],
    ],
  },
  {
    id: "checker", title: "检查器", en: "Checker",
    lead: "把\"像不像 AI 做的\"变成能自动检查的规则：源码里查写死的样式，浏览器里量页面。每条问题都带修法，照着改就对。",
    body: [
      ["h2", "怎么跑"],
      ["p", "检查器在技能目录的 <code>scripts/check.mjs</code>，不依赖别的包；<code>dom</code> 模式要 Playwright（<code>npm i -D playwright</code>，用本机的 Chrome）。有 error 时退出码是 1，可以直接放进 CI。"],
      ["code", "sh", "node .claude/skills/satin/scripts/check.mjs static src\nnode .claude/skills/satin/scripts/check.mjs dom http://localhost:5173/\n# --json 输出机器可读的结果；--max N 每条规则最多列 N 处；--widths 1440,768,390；--themes light,dark"],
      ["table", ["模式", "查什么"], [
        ["<code>static</code>", "扫源码（CSS、HTML、JSX、Vue、Svelte）：写死的颜色、间距、字号，渐变，彩色投影，动布局属性的动效，规范外的曲线和时长，AI 图标和 emoji，营销腔，假数据，去掉焦点框，写错的令牌和类名"],
        ["<code>dom</code>", "深浅两套 × 1440 / 768 / 390 三种宽度打开页面：渐变、彩色投影、毛玻璃、卡片套卡片、KPI 大字卡、彩色徽章、导航选中样式、装饰分隔线、遮挡、浮层被裁、按钮换行、横向溢出、对比度、触控尺寸；截图存在 <code>/tmp/satin-check/</code>"],
      ]],
      ["h2", "规则"],
      ["p", "一共 <span data-n-rules>39</span> 条，每条的原因、正反例在<a href=\"#/guide/no-ai\">去 AI 感</a>里；规则文件是 <code>spec/rules/anti-ai.json</code>（技能里带了一份快照）。"],
      ["rules"],
    ],
  },
  {
    id: "eval", title: "评测结果", en: "Evaluation",
    lead: "让低档模型做同样的 8 种页面，每种用 React、Vue、纯 HTML 各做一份；一遍不给技能，一遍给 Satin 技能，再比较结果。",
    body: [
      ["h2", "怎么测"],
      ["ul", [
        "模型：codex 的 <code>clirelay/gpt-6-luna</code>，推理强度 medium；每份单独一个目录，25 分钟超时。",
        "需求：后台列表、设置页、登录注册、仪表盘、AI 对话、落地页、移动端下单、表单向导，同一段中文需求。",
        "打分：能不能构建、打开；载入和点一遍交互有没有报错；检查器（源码 + 页面）报了多少问题；浅色、深色、手机三张截图人工看图打 1–5 分。",
      ]],
      ["h2", "第 1 轮结果"],
      ["table", ["指标", "没有技能", "有 Satin 技能"], [
        ["份数", "24", "24"],
        ["构建 / 打开成功", "100%", "100%"],
        ["检查器 · 源码 error（平均每份）", "106.5", "0.5"],
        ["检查器 · 页面 error（平均每份）", "15.3", "1.8"],
        ["检查器 error 为 0 的份数", "0%", "17%"],
        ["人工看图（1–5）", "2.6", "3.0"],
        ["平均用时（分钟）", "3.1", "3.5"],
      ]],
      ["p", "没有技能时，三种写法都是各自配一套品牌色（橙、绿、紫）、彩色图标的指标卡、英文眉题、装饰插画，没有深色，手机上多是桌面版整体缩小。有技能以后写死的样式基本没有了，深色和手机布局大多做对了；剩下的问题主要是眉题、默认蓝色下划线的链接，后面几轮的技能专门改了这些。"],
      ["img", "assets/eval/auth.jpg", 1490, 1180, "登录注册：左边两列是浅色桌面（没有技能 / 有技能），右边两列是深色手机"],
      ["img", "assets/eval/dashboard.jpg", 1490, 1180, "仪表盘：同上"],
      ["h2", "原始数据"],
      ["p", "每一份的打分、看图记录在仓库的 <code>eval/results.md</code>；做法、打分项在 <code>eval/README.md</code>。"],
    ],
  },
];

// ———— 开始：介绍（新版的说法）、用 CLI 创建项目、浏览器支持 ————
const T0 = START.find((p) => p.id === "intro");
export const INTRO = {
  ...T0,
  lead: "Satin 是给 AI 编码助手用的前端规范库：令牌、组件、交互和去 AI 味的规则都写成了代码和文档，再配一个技能和检查器。它从一个做视频的桌面创作工具里长出来：后台的表格、客户端的分镜和播放器、AI 对话，都用同一套组件和同一份规范。",
  body: [
    ["h2", "为什么做 Satin"],
    T0.body.find((b, i) => b[0] === "p" && T0.body[i - 1]?.[1] === "为什么做 Satin"),
    ["p", "编码助手写界面很快，但常常一眼就能看出是 AI 做的：渐变按钮、彩色投影、到处是 emoji 和英文眉题、没有深色、手机上整体缩小。Satin 把\"什么样算像成熟产品\"写成具体的类名、令牌和检查规则：助手照着做，写完自己检查。"],
    ["h2", "里面有什么"],
    ["ul", [
      "<b>53 个组件</b>：从按钮、输入框，到十万行的数据表格、一百万行的 Canvas 表格、上万个节点的流程图、上万条消息的 AI 对话；另有颜色、排版、间距这些基础令牌。",
      "<b>深浅两套主题</b>：每个颜色都有两套取值；主色、状态色、字体、字号随时可调，所有组件立即跟着变。",
      "<b>一份写清楚数值的规范</b>：颜色、排版、间距、圆角、动效曲线和时长、交互质感、去 AI 感、可访问性。组件页里的\"要点\"就是它的验收标准。",
      "<b>给 AI 用的技能和检查器</b>：见<a href=\"#/ai\">安装与用法</a>、<a href=\"#/checker\">检查器</a>；效果见<a href=\"#/eval\">评测结果</a>。",
      "<b>9 种页面配方</b>：后台列表、设置页、登录注册、仪表盘、AI 对话、落地页、移动端下单、表单向导、404 页面，照着搭骨架再换内容（见<a href=\"#/recipes\">配方</a>）。",
    ]],
    ["h2", "设计取向"],
    T0.body.find((b) => b[0] === "do"),
    ["h2", "能在哪里用"],
    ["ul", [
      "<b>所有主流框架</b>：React、Vue 有现成的组件；Svelte、Angular、Solid、Preact、纯 HTML 用自定义元素；Next.js、Nuxt 能服务端渲染（见<a href=\"#/frameworks\">框架接入</a>）。",
      "<b>桌面、移动端和 H5</b>：触屏、安全区、软键盘这些坑库里已经处理了（见<a href=\"#/mobile\">移动端与 H5</a>）。",
      "<b>只认 CSS 变量</b>：组件里不写死颜色和字号，改一个变量，所有组件跟着变（见<a href=\"#/theming\">主题</a>）。",
      "<b>大数据量是一等公民</b>：表格、列表、聊天、流程图都只渲染看得见的部分，滚得再快也不露白。",
    ]],
  ],
};

// 快速上手（新版）：两种开始方式，代码跟着全站的框架偏好变；后面的"文件一览""公开的函数"沿用原来那页
const ST = START.find((p) => p.id === "start");
export const QUICK = {
  ...ST,
  lead: "两种开始方式：一条命令建好新项目，或者在已有项目里装上。下面的代码跟着右上角选的框架变，复制就能跑。",
  body: [
    ["h2", "用 CLI 建一个新项目"],
    ["p", "样式、theme-boot、框架插件、给编码助手的技能和 AGENTS.md 都配好。还没发布到 npm，先在 Satin 仓库里用 node 跑（详见<a href=\"#/cli\">用 CLI 创建项目</a>）："],
    ["fw", perFw((id) => [["code", "sh", `node <Satin 仓库>/packages/satin-cli/bin/satin.js init --framework ${id} --dir my-app\ncd my-app\nnpm run dev`]])],
    ["h2", "在已有项目里装"],
    ["fw", perFw((id, x) => [["p", x.note], ["files", x.files]])],
    ["h2", "写组件"],
    ["p", "<b>页面级行为只在应用入口装一次</b>（Tooltip、浮层栈、Esc 关闭、自定义元素）：React 的组件第一次挂载时自动装；Vue 是 <code>app.use(Satin)</code>；Svelte、Angular、Solid、Preact 和纯 HTML 在入口调一次 <code>setup()</code> 和 <code>defineElements()</code>（上面各框架的入口文件里都写了）。组件页上的示例都默认入口已经装好，组件文件里不再重复。"],
    ["p", "React、Vue 用 <code>satin-ui/react</code>、<code>satin-ui/vue</code> 的组件（受控、<code>v-model</code>）；Svelte 用 <code>satin-ui/svelte</code> 的组件（<code>bind:value</code>）；Angular、Solid、Preact 和纯 HTML 写自定义元素 <code>&lt;sn-xxx&gt;</code>，放进页面自动挂载、移出自动销毁。纯样式的组件（按钮、输入框、标签……）在哪里都直接写 <code>sn-</code> 类名。组件页上每个示例的代码都是当前框架的写法，取自构建、截图比对过的全量示例，复制就能跑。"],
    ...ST.body.slice(ST.body.findIndex((b) => b[0] === "h2" && b[1] === "文件一览")),
  ],
};

export const CLI_PAGE = {
  id: "cli", title: "用 CLI 创建项目", en: "CLI",
  lead: "一条命令起一个配好 Satin 的项目：样式、theme-boot、框架插件、技能和 AGENTS.md 都放好，打开就能让编码助手开始做页面。",
  body: [
    ["h2", "还没发布到 npm"],
    ["p", "CLI 的包是 <code>satin-cli</code>（命令名 <code>satin</code>），还没有发布到 npm；发布要等维护者确认。现在在 Satin 仓库里直接用 node 跑（命令里的框架跟着右上角选的走）："],
    ["fw", perFw((id) => [["code", "sh", `node <Satin 仓库>/packages/satin-cli/bin/satin.js init --framework ${id} --dir my-app\ncd my-app\nnpm run dev\n# 发布以后：npx satin-ui init --framework ${id}`]])],
    ["h2", "命令"],
    ["table", ["命令", "做什么"], [
      ["<code>init</code>", "选框架（9 种）生成能直接跑的项目：样式、theme-boot、Vite / Next / Nuxt 插件配好，写入 AGENTS.md 和项目级技能，package.json 里加 <code>check</code> 脚本"],
      ["<code>add &lt;配方&gt;</code>", "按当前项目的框架，把<a href=\"#/recipes\">页面配方</a>拷进项目"],
      ["<code>check</code>", "跑去 AI 味<a href=\"#/checker\">检查器</a>，转出每条问题的修法"],
      ["<code>doctor</code>", "检查项目配置：satin-ui、样式、theme-boot、框架插件、技能和 AGENTS.md、check 脚本"],
      ["<code>skill</code>", "给已有项目装上或更新技能和 AGENTS.md"],
    ]],
    ["h2", "init 的参数"],
    ["p", "编码助手、CI 里调用时不会提问：写上 <code>--framework</code>，或者加 <code>--yes</code> 用默认的 React。"],
    ["table", ["参数", "说明", "默认"], [
      ["<code>--framework &lt;写法&gt;</code>", "<code>react</code>、<code>vue</code>、<code>next</code>、<code>nuxt</code>、<code>svelte</code>、<code>angular</code>、<code>solid</code>、<code>preact</code>、<code>html</code>", "终端里会问；加 <code>--yes</code> 用 react"],
      ["<code>--dir &lt;目录&gt;</code>", "项目目录，也可以直接写在命令后面", "<code>satin-app</code>"],
      ["<code>--pm &lt;包管理器&gt;</code>", "<code>pnpm</code>、<code>npm</code>、<code>yarn</code>、<code>bun</code>", "按运行这条命令的工具猜，猜不出用 npm"],
      ["<code>--agents &lt;列表&gt;</code>", "给哪些编码助手装技能：<code>claude</code>、<code>codex</code>，逗号分隔", "两个都装"],
      ["<code>--yes</code>、<code>-y</code>", "不问，没写的都用默认值", ""],
      ["<code>--no-install</code>", "只生成文件，不装依赖", "会装"],
      ["<code>--satin &lt;依赖写法&gt;</code>", "<code>satin-ui</code> 的依赖写法，比如 <code>^0.1.0</code>、<code>file:../Satin/packages/satin-ui</code>", "发布后用 npm 上的版本；在仓库里运行时用本地打的包"],
      ["<code>--force</code>", "目录里已经有文件也往里写（同名文件会被覆盖）", ""],
    ]],
    ["table", ["命令", "参数"], [
      ["<code>add</code>", "<code>--list</code> 看有哪些配方；<code>--dir</code> 项目目录；<code>--framework</code> 指定写法；<code>--force</code> 覆盖已有文件"],
      ["<code>check</code>", "不写路径时扫这个写法的源码目录；<code>--dom &lt;地址&gt;</code> 在浏览器里量页面（要 Playwright）；<code>--json</code>；<code>--max &lt;条数&gt;</code>"],
      ["<code>doctor</code>", "<code>--dir</code>；<code>--json</code>"],
      ["<code>skill</code>", "<code>--agents claude,codex</code>（不写时：装了哪几个就更新哪几个，一个都没有就两个都装）；<code>--dir</code>"],
    ]],
    ["p", "退出码：<code>0</code> 成功；<code>1</code> 跑了但有问题（检查有 error、依赖没装好、配方没有这种写法……）；<code>2</code> 参数不对。"],
    ["h2", "生成哪些文件"],
    ["code", "text", "package.json          satin-ui + 框架依赖；dev、build、check 脚本；\"satin\" 字段记下写法和包管理器\nREADME.md             常用命令、给编码助手的说明在哪\nAGENTS.md             Codex 读：Satin 那一段（<!-- satin:start --> … <!-- satin:end --> 包住）\nCLAUDE.md             Claude Code 读：同上\n.agents/skills/satin/ Codex 的项目级技能\n.claude/skills/satin/ Claude Code 的项目级技能\n.gitignore\npnpm-workspace.yaml   只有 --pm pnpm 时有：放行这个写法要用的安装脚本\n.satin/               只有在仓库里运行时有：本地打的 satin-ui 包"],
    ["fw", perFw((id) => [["code", "text", ({
      react: "index.html  vite.config.js  src/main.jsx  src/App.jsx", vue: "index.html  vite.config.js  src/main.js  src/App.vue", svelte: "index.html  vite.config.js  src/main.js  src/App.svelte",
      solid: "index.html  vite.config.js  src/main.js  src/App.jsx        （Solid 2：@solidjs/web、@solidjs/vite-plugin）", preact: "index.html  vite.config.js  src/main.js  src/App.jsx",
      angular: "angular.json  tsconfig.json  src/index.html  src/main.ts  src/app.ts  src/styles.css", next: "next.config.mjs  app/layout.jsx  app/page.jsx  app/new-project.jsx",
      nuxt: "nuxt.config.ts  app/app.vue  app/plugins/satin.ts", html: "index.html  main.js  serve.mjs        （不用打包工具；npm run dev 起一个本地服务）",
    })[id] + "\n\n起步页：页头、一个输入框、一个分段控件、一个主按钮，深浅两套主题都对。"]])],
    ["h2", "页面配方"],
    ["code", "sh", "satin add --list\nsatin add settings"],
    ["p", "9 种页面配方：后台列表、设置页、登录注册、仪表盘、AI 对话、落地页、移动端下单、表单向导、404 页面。纯 HTML 项目拷成根目录下的一张页面（比如 <code>settings.html</code>）；Vite 类的写法拷进 <code>src/recipes/&lt;配方&gt;/</code>，Next.js、Nuxt 拷进 <code>app/recipes/&lt;配方&gt;/</code>（Next.js 还会建好路由）。"],
    ["h2", "常见问题"],
    ["ul", [
      "<b>能在已有项目里用吗？</b>能。在项目根目录运行 <code>satin skill</code> 装技能和说明，<code>satin doctor</code> 看还差什么，照着修法改。",
      "<b><code>AGENTS.md</code>、<code>CLAUDE.md</code> 里我自己写的内容会被改吗？</b>不会。Satin 那一段用起止注释包住，重新运行只换这一段。",
      "<b>怎么更新技能？</b>运行 <code>satin skill</code>；<code>satin doctor</code> 会告诉你项目里的技能是不是最新的。",
      "<b><code>package.json</code> 里本来就有 <code>check</code> 脚本？</b>不动它，Satin 的检查加成 <code>check:satin</code>。",
      "<b>页面检查（<code>check --dom</code>）提示要 Playwright？</b>在项目里装 <code>npm i -D playwright</code>（用本机的 Chrome）；只查代码用默认的 static 模式，不需要。",
      "<b>Next.js 开发时 <code>AGENTS.md</code> 里多了一段 Next.js 的说明？</b>那是 Next.js 自己加的，和 Satin 那一段互不影响；不想要就在 <code>next.config.mjs</code> 里写 <code>agentRules: false</code>。",
    ]],
  ],
};

export const BROWSERS = {
  id: "browsers", title: "浏览器支持", en: "Browsers",
  lead: "支持最近两个版本的 Chrome、Edge、Safari、Firefox。用到的较新特性里，有几项是必需的，其余的在不支持的浏览器里会退回到简单的做法。",
  body: [
    ["h2", "最低版本"],
    ["table", ["浏览器", "最低版本", "卡在哪个特性"], [
      ["Chrome / Edge", "114", "Popover（文字提示放在顶层）"],
      ["Safari（macOS、iOS）", "17", "Popover"],
      ["Firefox", "125", "Popover"],
    ]],
    ["h2", "必需的特性"],
    ["table", ["特性", "用在哪"], [
      ["<code>color-mix()</code>", "悬停、按下、选中的底色，主色上的字，半透明的线"],
      ["<code>:has()</code>", "按钮组的首尾圆角、表格的列宽和空状态、看图的载入和失败提示、可横滑的分段控件和标签页"],
      ["容器查询 <code>@container</code>", "页面骨架（带侧栏的两栏、设置页的左右两列）在窄容器里换成一栏，步骤条在窄处只留当前一步的文字"],
      ["Popover（<code>showPopover</code>）", "文字提示放进顶层，弹窗打开时也盖在上面"],
      ["<code>dvh</code>", "骨架类的整屏高度（手机上不算地址栏）"],
    ]],
    ["h2", "不支持时退回的特性"],
    ["table", ["特性", "支持时", "不支持时"], [
      ["View Transitions", "换深浅主题、文档换页时整页交叉淡化", "直接切换"],
      ["滚动驱动动画 <code>animation-timeline</code>", "滚动区域的滚动条和边缘渐隐在合成线程上跟着滚", "改用脚本跟着滚动事件更新"],
      ["<code>@starting-style</code>", "文字提示第一次出现也有过渡", "第一次直接出现"],
      ["<code>interpolate-size</code>", "Markdown 里 <code>&lt;details&gt;</code> 展开有高度过渡", "直接展开"],
      ["<code>text-autospace</code>", "中文和英文、数字之间自动留一点空", "不留"],
    ]],
    ["h2", "服务端渲染"],
    ["p", "导入本身没有副作用，Node 里 <code>import</code> 不报错；组件的标记函数（<code>buttonHTML</code>、<code>createXxx.html</code>）在服务端也能调。只有浏览器里才有的行为（<code>setup()</code>、监听、测量）要在客户端调；<code>theme-boot</code> 在服务端什么都不做，要内联进 <code>&lt;head&gt;</code>（见<a href=\"#/start\">快速上手</a>）。"],
  ],
};

// ———— 定制：主题、深色模式、令牌、多语言、图标 ————
const TH = START.find((p) => p.id === "theming"), cut = TH.body.findIndex((b) => b[0] === "h2" && b[1] === "深色模式"), cut2 = TH.body.findIndex((b) => b[0] === "h2" && b[1] === "自己加一种主色");
export const CUSTOM_PAGES = [
  { ...TH, title: "主题", body: [...TH.body.slice(0, cut), ...TH.body.slice(cut2)] },
  {
    id: "dark", title: "深色模式", en: "Dark mode",
    lead: "每个颜色变量都有浅色、深色两套取值，组件里不写死颜色，换主题时所有组件一起变；也可以只让页面里的某一块用深色。",
    body: [
      ...TH.body.slice(cut, cut2),
      ["h2", "刷新不闪"],
      ["p", "<code>theme-boot</code> 要在第一帧之前同步执行：它按存过的选择（没存过就跟着系统）写好 <code>data-theme</code>，刷新时不会先闪一下浅色。不同框架的放法见<a href=\"#/start\">快速上手</a>和<a href=\"#/frameworks\">框架接入</a>。"],
      ["h2", "检查"],
      ["p", "深浅两套都要截图看：检查器的 <code>dom</code> 模式会在深浅两套下各截一遍（规则 <code>both-themes</code>）。"],
    ],
  },
  {
    id: "tokens", title: "令牌", en: "Tokens",
    lead: "组件只认这些 CSS 变量。下面的表从令牌文件（<code>satin-ui/tokens/*.tokens.json</code>，W3C 设计令牌格式）直接生成，浅色、深色两列是实际取值。",
    body: [
      ["p", "每一类的用法和规矩在规范里：<a href=\"#/guide/color\">颜色</a>、<a href=\"#/guide/type\">排版</a>、<a href=\"#/guide/spacing\">间距</a>、<a href=\"#/guide/shape\">圆角与线</a>、<a href=\"#/guide/elevation\">阴影与层级</a>、<a href=\"#/guide/motion\">动效</a>。改值的办法见<a href=\"#/theming\">主题</a>。"],
      ["tokens"],
    ],
  },
  {
    id: "i18n", title: "多语言", en: "i18n",
    lead: "组件里所有给人看的文字都走同一张语言表。默认简体中文，另带英文；可以整套换、只改几条，或者加一套新的语言。",
    body: [
      ["h2", "换成英文"],
      ["p", "英文包按需引入，不用的不打包。最好在应用启动、创建组件之前设好：已经渲染出来的组件不会自己重画。"],
      ["code", "js", 'import { addLocale, setLocale } from "satin-ui";\nimport en from "satin-ui/locales/en";\n\naddLocale("en", en);\nsetLocale("en");'],
      ["h2", "只改几条"],
      ["p", "给一张消息表，在当前语言上覆盖；没给的用默认。键名按组件分文件列在包里的 <code>src/locales/zh-CN/</code>。"],
      ["code", "js", 'import { setLocale } from "satin-ui";\n\nsetLocale({ "pager.0": "上一页", "pager.1": "下一页" });'],
      ["h2", "加一套语言"],
      ["code", "js", 'import { addLocale, setLocale, getLocale } from "satin-ui";\nimport ja from "./locales/ja.js"; // 照着 satin-ui/locales/en 的键写一份\n\naddLocale("ja", ja);\nsetLocale("ja");\ngetLocale(); // "ja"'],
      ["p", "缺的键回到中文；参数用 <code>{p0}</code>、<code>{p1}</code> 占位。数字、日期按当前语言格式化（<code>toLocaleString</code>、<code>Intl.DateTimeFormat</code>）。"],
    ],
  },
  {
    id: "icon-usage", title: "图标", en: "Icons",
    lead: "148 个 Solar Icons（480 Design，CC BY 4.0），24px 网格、1.5px 线宽、圆润轮廓；默认 line-duotone 双色调层次，可通过 --sn-ic-duo 变量免重绘切为纯线性。",
    body: [
      ["h2", "在标记里写"],
      ["p", "<code>data-i=\"名字\"</code> 是占位，<code>enhance()</code> 或 <code>injectIcons()</code> 把它换成 SVG。冒号后面写位置：<code>before</code> 放在文字前面，<code>after</code> 放在后面。"],
      ["code", "html", '<button class="sn-btn sn-primary" data-i="plus:before">新建项目</button>\n<button class="sn-btn sn-ghost sn-ibtn" data-i="settings" aria-label="设置"></button>\n<a class="sn-btn sn-tertiary" href="/docs" data-i="arrow-right:after">阅读文档</a>'],
      ["h2", "在代码里拿"],
      ["code", "js", 'import { icon } from "satin-ui/icons";\nel.innerHTML = icon("search", 16); // <svg class="sn-ic" …>\n\n// 只引用到的几个，打包时没用到的会摇掉\nimport { plus, search } from "satin-ui/icons";'],
      ["p", "React 里用 <code>&lt;Icon name=\"search\" /&gt;</code>（<code>satin-ui/react</code>），Vue 里用 <code>&lt;SnIcon name=\"search\" /&gt;</code>。按钮组件的 <code>icon</code> 参数也是图标名。"],
      ["h2", "加自己的图标"],
      ["p", "图标表 <code>ICONS</code> 是图标名到 SVG 内部路径的映射，往里加一项就能在 <code>data-i</code>、<code>icon()</code> 里用。路径照 Solar Icons 的规矩画：24×24、1.5px 线宽、圆润折角，次要笔画加 <code>class=\"sn-ic-d\"</code> 即可响应 <code>--sn-ic-duo</code> 双色调变量。"],
      ["code", "js", 'import { ICONS } from "satin-ui/icons";\n\nICONS.menu = \'<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>\';'],
      ["p", "全部图标和怎么选，见规范里的<a href=\"#/guide/icons\">图标</a>。"],
    ],
  },
];

// ———— 其他：更新日志、路线图 ————
export const OTHER_PAGES = [
  {
    id: "changelog", title: "更新日志", en: "Changelog",
    lead: "还没有发布过版本。下面是第一个版本（0.1.0）准备带上的东西。",
    body: [
      ["h2", "0.1.0（未发布）"],
      ["ul", [
        "组件库从设计稿里拆成 npm 包 <code>satin-ui</code>：纯 CSS 和 ES 模块，没有构建步骤；导入没有副作用，Node 和服务端渲染里能 <code>import</code>。",
        "所有组件统一成 <code>createXxx(元素, 选项)</code>，返回 <code>update</code>、<code>destroy</code>；React、Vue 组件和自定义元素都包在它外面。",
        "类名统一加 <code>sn-</code> 前缀，令牌统一成 <code>--sn-</code>，嵌进已有页面不和别的样式打架。",
        "TypeScript 类型；多语言（中文、英文）；Vite 插件和 theme-boot 的内联脚本（Next.js、Nuxt 用）。",
        "给 AI 用的技能和检查器（26 条规则），以及 8 种页面配方。",
        "9 种写法的示例项目，截图和纯 HTML 版逐像素对比。",
      ]],
    ],
  },
  {
    id: "roadmap", title: "路线图", en: "Roadmap",
    lead: "先把 Web 端做完整，再做原生。下面按先后排。",
    body: [
      ["h2", "现在：Web 端"],
      ["ul", [
        "所有主流框架、桌面、移动端和 H5 的效果和设计稿一致：逐像素、逐帧对比。",
        "CLI：一条命令起项目、加配方、跑检查（见<a href=\"#/cli\">用 CLI 创建项目</a>）。",
        "评测：每改一版技能，用低档模型再做一轮页面，结果写进<a href=\"#/eval\">评测结果</a>。",
      ]],
      ["h2", "之后：原生"],
      ["ul", [
        "另起项目做原生端，同一份令牌和规范：先 MyGo，再 NSGo。",
      ]],
      ["h2", "发布"],
      ["p", "npm 包和 CLI 还没发布；发布时间等维护者确认。"],
    ],
  },
];

// ———— 配方：9 种页面（spec/recipes/*.md），每页实时预览 + 代码 ————
export const RECIPES = [
  ["admin-table", "01-admin-table.md", "后台列表"], ["settings", "02-settings.md", "设置页"], ["auth", "03-auth.md", "登录注册"], ["dashboard", "04-dashboard.md", "仪表盘"],
  ["chat", "05-chat.md", "AI 对话"], ["landing", "06-landing.md", "落地页"], ["mobile-order", "07-mobile-order.md", "移动端下单"], ["wizard", "08-wizard.md", "表单向导"],
  ["not-found", "09-not-found.md", "404 页面"],
].map(([id, file, title]) => ({ id, file, title, mobile: id === "mobile-order", shell: ["chat", "wizard", "admin-table", "auth", "not-found"].includes(id) }));
// mobile：手机页面，预览默认放进设备框（device.js）；shell：app 式配方（整页就是一个应用、自己占满一屏，页面本身不该滚），预览框固定高度——别的是内容页，预览框和内容一样高
