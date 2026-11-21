# satin-ui

给 AI 和人用的 Web UI 规范库：令牌（颜色、间距、圆角、字号、动效）、组件样式、不依赖框架的组件、React / Vue 封装、自定义元素、深浅两套主题，加一套"去 AI 味"规则和检查器。目标是做出来的界面像成熟产品：克制、动效逐帧到位、彩色只表达状态。

- 不依赖框架：组件是 `createXxx(el, options)`，React、Vue、Svelte、Angular、Solid、Preact、纯 HTML 都能用
- 服务端渲染安全：导入没有副作用；每个组件有 `createXxx.html(options)` 生成和浏览器第一帧一样的标记
- 按需打包：具名导出、没有副作用，只引一个组件体积就只有那一个
- 中文默认，英文按需引入（`satin-ui/locales/en`）；深浅主题、主色、字号可换，可以只给页面的一块换主题

## 安装

```bash
npm i satin-ui
```

## 用法

```js
// 样式：整页都用 Satin 时一行
import "satin-ui/css/page.css";
// 嵌进已有页面（不改页面其他元素）：import "satin-ui/css"; 外面包 <div class="sn-root">
```

**React**

```jsx
import { Button, Field, Input, Select, Segmented, Table, Dialog, toast } from "satin-ui/react";

<Segmented items={["网格", "列表"]} value={view} onChange={setView} />
<Button variant="primary" onClick={() => toast({ text: "已保存", icon: "check" })}>保存</Button>
```

**Vue**

```js
import Satin from "satin-ui/vue";
createApp(App).use(Satin).mount("#app"); // <SnSegmented v-model="view" :items="['网格', '列表']" />
```

**纯 HTML / 其他框架**

```html
<sn-select items='["16:9 横屏","9:16 竖屏"]' value="16:9 横屏"></sn-select>
<button class="sn-btn sn-primary">保存</button>
<script type="module">
  import { setup, enhance } from "satin-ui";
  import { defineElements } from "satin-ui/elements";
  setup(); defineElements(); enhance();
</script>
```

**重组件**（对话、Markdown、流程图、十万行 / 一百万行数据表格、主题面板）各自单独引入，写法和轻组件一样：

```js
import { createChat } from "satin-ui/chat";
const chat = createChat(document.querySelector("#chat"), { title: "分镜助手", async *respond(question) { yield "第三集可以拆成三段："; yield "车站外、候车厅、站台。"; } }); // respond：把 question 发给模型，回来一段 yield 一段
chat.destroy(); // 卸载时：停掉生成中的回答、撤掉监听、清空容器
// React：const Chat = wrapSatin(createChat, { events: [] })（satin-ui/react），然后 <Chat title="…" respond={…} />
```

**第一帧之前写好深浅主题**（刷新不闪）：Vite 用 `satin-ui/vite` 插件；Next.js、Nuxt 把 `satin-ui/theme-boot-script` 内联进 `<head>`；纯 HTML `<script src="…/satin-ui/src/theme-boot.js">`。

## 入口

| 路径 | 内容 |
|---|---|
| `satin-ui` | `setup()`、`enhance()`、全部轻组件（`createSegmented`、`createSelect`、`createTable`……）、标记函数（`buttonHTML`……）、浮层和反馈（`openDialog`、`toast`……）、多语言、图标 |
| `satin-ui/react`、`satin-ui/vue` | React 18+ / Vue 3.3+ 封装（受控 / 非受控、v-model、服务端渲染） |
| `satin-ui/elements` | 不带 Shadow DOM 的自定义元素 `<sn-segmented>`、`<sn-select>`…… |
| `satin-ui/theme`、`satin-ui/theme-panel` | 深浅模式 `setMode()`、主色 / 状态色 / 字体 / 字号 `set()`、局部主题 `applyTheme(el, …)`、定制面板 |
| `satin-ui/markdown`、`/chat`、`/flow`、`/grid`、`/canvas-grid`、`/lightbox`、`/media` | 重组件，各自单独引入：`createMarkdown`、`createChat`、`createFlow`、`createDataGrid`、`createCanvasGrid`（`satin-ui/theme-panel` 里是 `createThemePanel`）；原来的 `mountXxx` 也还能用 |
| `satin-ui/css`、`satin-ui/css/page.css`、`satin-ui/css/*.css` | 样式合集（不含 / 含页面级重置）、单个文件 |
| `satin-ui/tokens/*` | W3C 设计令牌（DTCG JSON） |
| `satin-ui/locales/en` | 英文 |

## 给 AI 用

仓库里的 `skills/satin/` 是给 Claude Code、Codex 这类编码助手用的技能：组件选择表、页面配方、去 AI 味规则、检查器（`node skills/satin/scripts/check.mjs static src/`、`… dom http://localhost:5173/`）。把 `skills/satin/AGENTS.snippet.md` 那段放进项目的 AGENTS.md / CLAUDE.md。

## 浏览器

Chrome / Edge 117+、Safari 17.5+、Firefox 129+（用到 `@layer`、`color-mix()`、容器查询、`:has()`、Popover）。

## 许可

MIT
