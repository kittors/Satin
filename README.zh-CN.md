<div align="center">

# Satin

**面向人类开发者与 AI 编码助手的高质感 Web UI 组件库与设计规范体系**

[English](./README.md) · [简体中文](./README.zh-CN.md)

[![npm version (satin-ui)](https://img.shields.io/npm/v/satin-ui?label=satin-ui&color=111111)](https://www.npmjs.com/package/satin-ui)
[![npm version (satin-cli)](https://img.shields.io/npm/v/satin-cli?label=satin-cli&color=111111)](https://www.npmjs.com/package/satin-cli)
[![CI](https://github.com/kittors/Satin/actions/workflows/ci.yml/badge.svg)](https://github.com/kittors/Satin/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)](./packages/satin-ui/types/index.d.ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-18794e.svg)](./LICENSE)

</div>

---

名字取自缎面（*satin*）——顺滑、有光泽、克制不张扬。Satin 将零运行时依赖、框架无关的组件核心，与 **React**、**Vue**、**Svelte**、**Web Components** 一等公民封装、W3C DTCG 设计令牌、逐帧打磨的物理动效、完整的 **中 / 英双语国际化**，以及 **AI 编码技能 + 去 AI 味自动检查器** 融为一体。

## 核心特性

- **零强制运行时依赖、极致 Tree-Shaking**：纯 ESM 具名导出，标注 `sideEffects`，CI 内强制守护 15 项 gzip 体积预算。
- **全框架原生级开发体验**：提供 **React 18+**（支持 Next.js App Router）、**Vue 3.3+**（支持 Nuxt）、**Svelte 5**、无 Shadow DOM **Web Components**、**Angular**、**Solid**、**Preact** 与纯 HTML 的一致写法。
- **声明式主题与实时定制**：React 提供 `<SatinProvider>` / `<ThemeScope>` / `useTheme()`，Vue 提供 `app.use(Satin, options)` / `<SnThemeScope>` / `useTheme()`；内置带自定义 Satin HSV 取色器、WCAG AA 自动对比度适配、深浅模式、四档圆角、线条质感与过渡节奏的可视化主题面板。
- **完整中 / 英双语国际化（`zh-CN` & `en`）**：覆盖 20 个组件模块 550+ 条词条、CI 强制校验 100% 键对齐，英文包按需加载不拖累体积，支持 `setLocale("en", en)` 一步切换与响应式 `useLocale()`。
- **企业级重组件独立子路径按需加载**：
  - `DataGrid`（十万行虚拟滚动 DOM 数据表格）与 `CanvasGrid`（百万行高帧率 Canvas 表格）
  - `Chat` 与 `ThreadRail`（AI 流式输出、可折叠思考过程、工具调用卡片、提示词输入框、侧边对话刻度轨）
  - `AreaChart`、`BarChart`、`DonutChart`、`Chart3D`、`Sparkline`、`Icon3D`（零依赖高分屏 Canvas 图表，自动跟随 CSS 令牌重绘）
  - `Flow`（DOM + 五万节点 Canvas 流程图）与 `Markdown`（内置 XSS 过滤与代码复制）
- **零样式污染与 SSR 安全**：全部样式包裹在 `@layer satin` 内；所有模块导入无副作用，Node / SSR 环境安全；内置首帧防闪主题引导脚本与 Vite 插件。
- **AI 原生规范与去 AI 味检查器（`satin-cli`）**：内置 W3C DTCG 令牌、13 章设计规范、62 份组件契约、页面配方、`AGENTS.md` / `CLAUDE.md` 技能与静态 + 浏览器 DOM 双模去 AI 味审计器。

---

## 安装

在已有项目中直接安装组件库：

```bash
pnpm add satin-ui
# 或
npm install satin-ui
```

或使用 `satin-cli` 一条命令创建带 `satin-ui`、防闪主题、页面配方与 AI 技能的完整工程（支持 9 种框架）：

```bash
pnpm dlx satin-cli init my-app
# 或
npx satin-cli init my-app
```

---

## 快速上手

### 1. 引入样式

```ts
// 整页使用 Satin（包含轻量化 reset 与全部组件样式，均位于 @layer satin）
import "satin-ui/css/page.css";

// 嵌入已有设计系统（不含全局 reset，不干扰现有样式）
// import "satin-ui/css";

// 单文件压缩版（约 57 KB gzip，适合静态页或 CDN 直引）
// import "satin-ui/css/page.min.css";
```

### 2. React / Next.js

```tsx
import "satin-ui/css/page.css";
import en from "satin-ui/locales/en";
import {
  SatinProvider,
  ThemeScope,
  Button,
  Segmented,
  Loader,
  Progress,
  toast,
  useTheme,
  useLocale,
} from "satin-ui/react";
import { AreaChart } from "satin-ui/react/charts";

export default function App() {
  return (
    <SatinProvider
      mode="auto"
      locale="zh-CN"
      theme={{ accent: "ink", radius: "pill" }}
    >
      <Segmented items={["概览", "分镜", "设置"]} defaultValue="概览" />
      <Button variant="primary" onClick={() => toast({ text: "已保存" })}>
        保存修改
      </Button>
      <Loader variant="matrix" size="md" />
      <Progress value={0.68} segments={8} tone="ok" />

      <ThemeScope mode="dark" accent="blue" radius="8">
        <AreaChart
          labels={["周一", "周二", "周三", "周四"]}
          series={[{ name: "吞吐量", values: [120, 184, 162, 238] }]}
          height={220}
        />
      </ThemeScope>
    </SatinProvider>
  );
}
```

### 3. Vue 3 / Nuxt

```ts
import { createApp } from "vue";
import "satin-ui/css/page.css";
import Satin from "satin-ui/vue";
import App from "./App.vue";

createApp(App)
  .use(Satin, {
    mode: "auto",
    locale: "zh-CN",
    theme: { accent: "ink", radius: "pill" },
  })
  .mount("#app");
```

注册后即可在模板中直接使用 `<SnButton>`、`<SnSegmented v-model="view" />`、`<SnLoader variant="matrix" />`、`<SnProgress :value="0.68" :segments="8" />`、`<SnThemeScope mode="dark">`，重组件按需从子路径引入：

```ts
import { AreaChart, BarChart, DonutChart, Chart3D } from "satin-ui/vue/charts";
import { Chat, ThreadRail } from "satin-ui/vue/chat";
import { DataGrid } from "satin-ui/vue/grid";
```

### 4. 纯 HTML / Web Components / Svelte / Solid / Angular

```html
<sn-segmented items='["概览","分镜"]' value="概览"></sn-segmented>
<sn-loader variant="matrix" size="lg"></sn-loader>
<button class="sn-btn sn-primary">保存修改</button>

<script type="module">
  import { setup, enhance } from "satin-ui";
  import { defineElements } from "satin-ui/elements";

  setup();
  defineElements();
  enhance();
</script>
```

### 5. 首帧零闪烁深浅主题

- **Vite**：在 `vite.config.ts` 加入 `import satin from "satin-ui/vite"` 与 `plugins: [satin()]`。
- **Next.js / Nuxt**：导入 `import themeBoot from "satin-ui/theme-boot-script"` 并内联至 `<head>`。
- **纯 HTML**：在 `<head>` 顶部样式表之前引入 `<script src="…/satin-ui/src/theme-boot.js"></script>`。

---

## 多语言（简体中文与英文）

组件库默认简体中文（`zh-CN`），内置按需加载的完整英文语言包（`en`），覆盖全部 20 个模块。

```ts
import { setLocale, addLocale } from "satin-ui";
import en from "satin-ui/locales/en";

// 一步注册并切换为英文
setLocale("en", en);

// 切回简体中文
setLocale("zh-CN");

// 覆写单条文案或注册更多语言（如 ja / fr / de）
addLocale("ja", myJapanesePack);
setLocale("ja");
```

React / Vue 可直接在 `<SatinProvider locale="en" messages={en}>` 或 `app.use(Satin, { locale: "en", messages: en })` 声明配置，并通过 `useLocale()` 响应式读写当前语言。

---

## 导出子路径一览（`satin-ui`）

| 路径 | 内容 |
| --- | --- |
| `satin-ui` | `setup()`、`enhance()`、轻组件工厂（`createSegmented`、`createTable`、`createLoader`、`createPicker`…）、标记函数、浮层、反馈、图标与多语言 |
| `satin-ui/react`、`satin-ui/vue` | React 18+ / Vue 3.3+ 全套封装、`SatinProvider` / `ThemeScope` / `useTheme` / `useLocale`、`Loader`、`Progress`、`Dialog`、`Drawer`、`toast`、`notify` |
| `satin-ui/react/charts`、`satin-ui/vue/charts` | `AreaChart`、`BarChart`、`DonutChart`、`Chart3D`、`Sparkline`、`Icon3D` |
| `satin-ui/react/chat`、`satin-ui/vue/chat` | `Chat`（流式输出、思考折叠、工具调用、提示词输入）、`ThreadRail` |
| `satin-ui/react/grid`、`satin-ui/vue/grid` | `DataGrid`（十万行 DOM 虚拟数据表格） |
| `satin-ui/react/canvas-grid`、`satin-ui/vue/canvas-grid` | `CanvasGrid`（百万行 Canvas 数据表格） |
| `satin-ui/react/flow`、`satin-ui/vue/flow` | `Flow`（DOM + 五万节点 Canvas 流程图） |
| `satin-ui/react/markdown`、`satin-ui/vue/markdown` | `Markdown`（带 XSS 过滤与代码复制） |
| `satin-ui/elements`、`satin-ui/svelte/*.svelte` | 无 Shadow DOM 自定义元素与 Svelte 5 组件 |
| `satin-ui/theme`、`satin-ui/theme-panel` | 主题引擎（`setMode`、`set`、`applyTheme`）与带自定义 HSV 取色器的主题定制面板 |
| `satin-ui/css`、`satin-ui/css/page.css` | 模块化 `@layer satin` 源码样式 |
| `satin-ui/css/min`、`satin-ui/css/page.min.css` | 单文件压缩样式包 |
| `satin-ui/tokens/*`、`satin-ui/locales/en` | W3C DTCG 设计令牌 JSON 与中英双语包 |
| `satin-ui/vite`、`satin-ui/theme-boot-script` | Vite 防闪插件与 SSR 内联脚本 |

---

## 仓库目录结构

| 路径 | 说明 |
| --- | --- |
| [`packages/satin-ui/`](./packages/satin-ui/) | 可发布 UI 组件库（`src/`、`css/`、`dist/`、`react/`、`vue/`、`svelte/`、`elements/`、`types/`、`tokens/`、`vite/`） |
| [`packages/satin-cli/`](./packages/satin-cli/) | 可发布脚手架与检查工具（`satin init` / `add` / `check` / `doctor` / `skill`） |
| [`spec/`](./spec/) | W3C DTCG 令牌、13 章设计规范、62 份组件契约、动效清单、去 AI 味规则、8 种页面配方 |
| [`skills/satin/`](./skills/satin/) | 给 AI 编码助手的技能包与静态 / DOM 去 AI 味检查器 |
| [`site/`](./site/) | 官网与交互文档（`site/next.html`、`site/next-docs.html`） |
| [`index.html`](./index.html)、[`demo/`](./demo/) | 单页全组件设计参考与逐帧验收页 |
| [`examples/`](./examples/) | 9 种框架同款示例（HTML、React、Vue、Svelte、Solid、Preact、Angular、Next.js、Nuxt） |
| [`scripts/`](./scripts/) | 令牌 / 规范 / 压缩 CSS 构建、契约与多语言校验、体积预算、Playwright 浏览器与逐像素对比测试 |

---

## 本地运行与验收

```bash
pnpm install
pnpm serve                  # 在 http://127.0.0.1:5192 启动无缓存开发静态服务
```

- 设计参考页：`http://127.0.0.1:5192/`
- 官网首页与文档：`http://127.0.0.1:5192/site/next.html`、`http://127.0.0.1:5192/site/next-docs.html`
- 纯 HTML 示例：`http://127.0.0.1:5192/examples/html/`

运行全套检查：

```bash
pnpm test                   # ESLint + 导入 + 多语言完整性 + SSR + 体积预算 + 契约 + TypeScript
pnpm test:cli               # CLI 脚手架、配方拷贝、doctor 与检查器测试
pnpm test:browser           # 需先启动 pnpm serve：100 次挂载销毁防泄漏、XSS、React/Vue 封装与受控测试
pnpm build:css              # 重新构建单文件压缩样式
pnpm build:examples         # 构建各框架示例工程
```

---

## 浏览器支持

Chrome / Edge 117+、Safari 17.5+、Firefox 129+。

## 品质准则

- **纯合成线程动效**：所有动画仅操作 `transform`、`opacity`、`filter`（帧间隔 p95 ≤ 17ms）。
- **深浅与宽窄双验**：全部组件在浅色 / 深色与桌面 / 移动端下均保持完整一致体验。
- **严格去 AI 味**：不堆砌发光边框、彩虹渐变与无意义装饰，色彩严格服务于层级与状态表达。

## 贡献与安全

- 提交 PR 前请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)。
- 安全问题报告请参考 [SECURITY.md](./SECURITY.md)。
- 版本变更历史见 [CHANGELOG.md](./CHANGELOG.md)。

## 开源协议

[MIT](./LICENSE) © Satin Contributors
