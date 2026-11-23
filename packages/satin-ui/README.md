# satin-ui

现代 Web UI 组件与规范库：统一设计令牌、克制高质感组件样式、框架无关核心、React / Vue / Svelte / Web Components 一等公民封装、深浅双主题与可自定义规范体系。

- **零强制运行时依赖、极致 Tree-Shaking**：具名导出，纯 ESM，完整 TypeScript 类型声明。
- **全框架开箱即用**：React 18+（含 Next.js App Router）、Vue 3.3+（含 Nuxt）、Svelte 5、Angular、Solid、Preact、原生 HTML 均有一致体验。
- **企业级重组件按需子路径**：十万行 DOM 数据表格、一百万行 Canvas 表格、AI 流式对话（含思考、工具调用、侧边刻度轨）、流程图、Canvas 图表与 3D 柱阵、Markdown 渲染器。
- **完整主题与定制能力**：声明式 `<SatinProvider>` / `<ThemeScope>` / `useTheme()`，支持深浅模式、主色、状态色、圆角、线条质感、字号与动效节奏动态定制。
- **SSR 安全 + 零样式污染**：导入无副作用，全部样式位于 `@layer satin`。

## 安装

```bash
pnpm add satin-ui
# 或 npm i satin-ui
```

## 快速上手

### 1. 引入样式

```js
// 整页使用 Satin（包含轻量化 reset 与全部组件样式）
import "satin-ui/css/page.css";

// 嵌入已有项目（不含全局 reset，不干扰现有页面）
// import "satin-ui/css";

// 单文件压缩版（适合 CDN 或静态页直引）
// import "satin-ui/css/page.min.css";
```

### 2. React / Next.js

```jsx
import "satin-ui/css/page.css";
import { SatinProvider, Button, Segmented, Loader, Progress, toast, useTheme } from "satin-ui/react";
import { AreaChart } from "satin-ui/react/charts";
import { Chat } from "satin-ui/react/chat";
import { DataGrid } from "satin-ui/react/grid";

export default function App() {
  return (
    <SatinProvider mode="auto" theme={{ accent: "ink", radius: "pill" }}>
      <Segmented items={["概览", "分镜", "设置"]} defaultValue="概览" />
      <Button variant="primary" onClick={() => toast({ text: "已保存" })}>保存修改</Button>
      <Loader variant="matrix" size="md" />
      <Progress value={0.68} segments={8} />
    </SatinProvider>
  );
}
```

### 3. Vue 3 / Nuxt

```js
import { createApp } from "vue";
import "satin-ui/css/page.css";
import Satin from "satin-ui/vue";
import App from "./App.vue";

createApp(App)
  .use(Satin, { mode: "auto", theme: { accent: "ink", radius: "pill" } })
  .mount("#app");
```

模板中直接使用 `<SnButton>`、`<SnSegmented v-model="view" />`、`<SnLoader variant="matrix" />`、`<SnProgress :value="0.68" :segments="8" />`、`<SnThemeScope mode="dark">`；图表、对话与大数据表格按需引入：

```js
import { AreaChart, BarChart, DonutChart, Chart3D } from "satin-ui/vue/charts";
import { Chat } from "satin-ui/vue/chat";
import { DataGrid } from "satin-ui/vue/grid";
```

### 4. 纯 HTML / Svelte / Angular / Solid

```html
<sn-segmented items='["概览","分镜"]' value="概览"></sn-segmented>
<sn-loader variant="matrix" size="lg"></sn-loader>
<button class="sn-btn sn-primary">保存修改</button>
<script type="module">
  import { setup, enhance } from "satin-ui";
  import { defineElements } from "satin-ui/elements";
  setup(); defineElements(); enhance();
</script>
```

### 5. 首帧防闪深浅主题

- **Vite**：在 `vite.config.js` 中加入 `import satin from "satin-ui/vite"; plugins: [satin()]`。
- **Next.js / Nuxt**：导入 `import themeBoot from "satin-ui/theme-boot-script"` 并内联进 `<head>`。
- **纯 HTML**：在 `<head>` 顶部引入 `<script src="…/satin-ui/src/theme-boot.js"></script>`。

## 导出子路径一览

| 路径 | 内容 |
|---|---|
| `satin-ui` | `setup()`、`enhance()`、全部轻组件工厂（`createSegmented`、`createTable`、`createLoader`…）、标记函数、浮层与反馈、图标与多语言 |
| `satin-ui/react`、`satin-ui/vue` | React 18+ / Vue 3.3+ 全套基础与交互组件、`SatinProvider` / `ThemeScope` / `useTheme`、`Loader`、`Progress`、`toast`、`notify` |
| `satin-ui/react/charts`、`satin-ui/vue/charts` | `AreaChart`、`BarChart`、`DonutChart`、`Chart3D`、`Sparkline`、`Icon3D` |
| `satin-ui/react/chat`、`satin-ui/vue/chat` | `Chat`（流式输出、思考折叠、工具调用、侧边刻度轨）、`ThreadRail` |
| `satin-ui/react/grid`、`satin-ui/react/canvas-grid` | 十万行 DOM 数据表格与百万行 Canvas 表格（Vue 版同理：`satin-ui/vue/grid`、`/canvas-grid`） |
| `satin-ui/react/flow`、`satin-ui/react/markdown` | 流程图与 Markdown 渲染器（Vue 版同理：`satin-ui/vue/flow`、`/markdown`） |
| `satin-ui/elements`、`satin-ui/svelte/*.svelte` | 无 Shadow DOM 自定义元素与 Svelte 5 组件 |
| `satin-ui/theme`、`satin-ui/theme-panel` | 主题引擎 `setMode()`、`set()`、`applyTheme()` 与可视化定制面板 |
| `satin-ui/css`、`satin-ui/css/page.css`、`satin-ui/css/min`、`satin-ui/css/page.min.css` | 源码样式与单文件压缩样式 |
| `satin-ui/tokens/*`、`satin-ui/locales/en` | W3C DTCG 设计令牌 JSON 与英文语言包 |

## 脚手架与 AI 编码技能

使用配套脚手架 `satin-cli` 可一条命令生成含 `satin-ui`、AI 技能与去 AI 味检查器的工程：

```bash
pnpm dlx satin-cli create my-app
```

## 浏览器支持

Chrome / Edge 117+、Safari 17.5+、Firefox 129+。

## License

MIT
