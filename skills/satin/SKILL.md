---
name: satin
description: 用 Satin（npm 包 satin-ui）做 Web 界面，做出来像成熟产品、没有 AI 味。做任何页面、组件、样式之前先读：后台列表、设置页、登录注册、仪表盘、AI 对话、落地页、移动端 H5、表单向导都适用；React、Vue、Next.js、Nuxt、Svelte、Angular、纯 HTML 都能用。
---

# Satin：做出像成熟产品的界面

Satin 是一套带规范的 UI 库：令牌（颜色、间距、圆角、字号、动效）、组件样式、组件交互、深浅两套主题，加一套"去 AI 味"规则和检查器。
照这份文档做，**不要自己发明样式**：颜色、间距、字号、圆角、阴影、动效都用 Satin 给的类名和令牌。

做页面的顺序：**装好 → 选页面配方搭骨架 → 往里放组件 → 跑检查器 → 深浅两套 + 手机宽度都看一眼**。

## 1. 装好（按框架挑一段，照抄）

```bash
npm i satin-ui
```

### React（Vite）
```js
// vite.config.js —— satin() 把 theme-boot 内联进 <head>：第一帧之前写好深浅主题，刷新不闪
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import satin from "satin-ui/vite";
export default defineConfig({ plugins: [react(), satin()] });
```
```jsx
// main.jsx
import "satin-ui/css/page.css";            // 整页用：令牌 + 页面级重置 + 全部组件样式（一行）
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
createRoot(document.getElementById("root")).render(<App />);

// 组件：import { Button, Field, Input, Select, Segmented, Tabs, Pager, Dialog, toast } from "satin-ui/react";
// 页面级行为（Tooltip、浮层栈、Esc 关闭）在第一个组件挂载时自动装好，不用手动 setup()
```

### Vue 3（Vite）
```js
// vite.config.js：plugins: [vue(), satin()]（同上，import satin from "satin-ui/vite"）
// main.js
import { createApp } from "vue";
import Satin from "satin-ui/vue";
import "satin-ui/css/page.css";
import App from "./App.vue";
createApp(App).use(Satin).mount("#app");   // 模板里直接写 <SnButton>、<SnSelect v-model="x" :items="...">
```

### Next.js（App Router）
```jsx
// app/layout.jsx
import themeBoot from "satin-ui/theme-boot-script";
import "satin-ui/css/page.css";
export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeBoot }} /></head>
      <body>{children}</body>
    </html>
  );
}
// 用到 useState 的页面 / 组件文件顶上写 "use client"；satin-ui/react 本身已标好 "use client"
```

### Nuxt
```ts
// nuxt.config.ts
import themeBoot from "satin-ui/theme-boot-script";
export default defineNuxtConfig({
  css: ["satin-ui/css/page.css"],
  app: { head: { htmlAttrs: { lang: "zh-CN" }, script: [{ innerHTML: themeBoot, tagPosition: "head" }] } },
});
// plugins/satin.ts
import Satin from "satin-ui/vue";
export default defineNuxtPlugin((nuxtApp) => { nuxtApp.vueApp.use(Satin); });
```

### 纯 HTML（不用构建工具）
```html
<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<script src="node_modules/satin-ui/src/theme-boot.js"></script>
<link rel="stylesheet" href="node_modules/satin-ui/css/page.css">
<script type="importmap">{ "imports": {
  "satin-ui": "./node_modules/satin-ui/src/index.js",
  "satin-ui/elements": "./node_modules/satin-ui/elements/index.js",
  "satin-ui/theme": "./node_modules/satin-ui/src/theme.js",
  "satin-ui/chat": "./node_modules/satin-ui/src/chat.js",
  "satin-ui/markdown": "./node_modules/satin-ui/src/markdown.js"
} }</script>
</head>
<body>
  <!-- 纯样式的组件直接写标记；有交互的用自定义元素 <sn-xxx> -->
  <sn-segmented items='["网格","列表"]' value="网格"></sn-segmented>
  <script type="module">
    import { setup, enhance } from "satin-ui";
    import { defineElements } from "satin-ui/elements";
    setup(); defineElements(); enhance();   // 页面级行为；注册 <sn-xxx>；把照设计稿写的标记（下拉、复制、显示密码、折叠……）接上交互，data-i 换成图标
  </script>
</body>
</html>
```
Svelte、Solid、Preact、Angular：样式同上（入口里 `import "satin-ui/css/page.css"`），交互组件用自定义元素（Angular 在组件里加 `schemas: [CUSTOM_ELEMENTS_SCHEMA]`）。

**嵌进已有页面**（别的设计系统里只放一块 Satin）：改引 `satin-ui/css`（不带页面级重置），外面包一层 `<div class="sn-root">`。

## 2. 先选页面配方，搭骨架

完整骨架代码在 `references/recipes.md`，先照着搭，再改内容。骨架类（`sn-page`、`sn-panel`、`sn-stack`……）见第 4 节。

| 页面 | 骨架 |
|---|---|
| 后台列表（项目、订单、用户） | 侧栏 `.sn-app` + 主区 `.sn-page`：页头（标题 + 一句说明 + 右侧主按钮）→ 工具条（搜索框 + 筛选芯片/分段 + 右侧次要按钮）→ 表格 `.sn-tbl-wrap` → 分页 `Pager` |
| 设置页 | `.sn-page.sn-narrow`：页头 → 若干 `.sn-setting`（左：标题 + 说明，右：字段）→ 底部保存按钮；或设置列表 `.sn-set-list` |
| 登录 / 注册 | `.sn-auth > .sn-panel`：标题 + 一句说明 → 字段 → 主按钮（撑满）→ 次要链接；不要插画、不要渐变背景 |
| 仪表盘 | 页头 → 一排 3～4 个 `.sn-stat`（放在一个 `.sn-panel` 里，不是每个一张卡）→ 两栏 `.sn-with-aside`：主图表/表格 + 右侧最近动态列表 |
| AI 对话 | `satin-ui/chat` 的 `mountChat`，或：消息列表 + 底部 `createComposer` 提示词输入框 |
| 落地页 | 顶栏（文字 logo + 3～4 个链接 + 一个主按钮）→ 首屏：一句话标题（说清做什么）+ 一句副标题 + 一主一次两个按钮 + 一张真实产品截图 → 3 个功能点（图标 + 标题 + 两行字，不用卡片墙）→ 页脚 |
| 移动端 H5（下单、表单） | 单栏，字段间距 20；底部 `.sn-bottom-bar` 贴底放总价 + 主按钮（避开 iPhone 底部横条）；点得到的东西至少 44×44 |
| 表单向导（多步） | 顶部 `stepsHTML` / `<Steps>` 步骤条 → 当前步的字段（`.sn-form`）→ 底部"上一步"（ghost，左）+"下一步"（primary，右） |

## 3. 要做什么 → 用什么

React 写 `<Xxx>`（`satin-ui/react`），Vue 写 `<SnXxx>`（`app.use(Satin)` 后），其他框架和纯 HTML 写标记或 `<sn-xxx>`。
"标记"那一列就是纯 HTML 的写法，React / Vue 里照写 class 也行。每个组件的全部写法、选项、状态见 `references/components/<id>.md`。

| 要做的 | React / Vue | 标记 / 自定义元素 | 备注 |
|---|---|---|---|
| 按钮 | `<Button variant="primary">` | `<button class="sn-btn sn-primary">保存</button>` | 变体由强到弱：primary、secondary、tertiary、ghost、danger、danger-soft；尺寸 `sn-sm` / `sn-lg`；**一个区域只放一个 primary** |
| 图标按钮 | `<Button variant="ghost" icon="settings" tip="设置" />` | `<button class="sn-btn sn-ghost sn-ibtn" data-tip="设置" data-i="settings"></button>` | 只有图标时必须有 `data-tip` 或 `aria-label` |
| 带图标的按钮 | `<Button icon="download">导出</Button>` | `data-i="download:before"` + `injectIcons()` | 图标名见 `references/icons.md`（146 个），不要用 emoji |
| 等待 / 成功 | `<Button busy>`；`busy(btn, promise)`、`succeed(btn)` | | 300ms 内完成不转圈 |
| 输入框 + 标签 + 说明 + 错误 | `<Field label help error><Input /></Field>` | `fieldHTML({ label, control: inputHTML(), help, error })` | 错误写在字段下面，不弹窗；`validateForm(form, 规则)` 一次校验 |
| 多行输入 | `<Textarea>` | `<textarea class="sn-input">` | |
| 搜索框 | | `<span class="sn-ib sn-has-pre"><span class="sn-pre" data-i="search"></span><input class="sn-input" placeholder="搜索项目"></span>` | |
| 下拉选择 | `<Select items value onChange>` | `<sn-select items='["A","B"]' value="A">` | 选项 ≤ 5 个而且要一眼看全：用分段控件 |
| 分段控件（视图切换） | `<Segmented items value onChange>` | `<sn-segmented>` | 2～5 个互斥选项 |
| 复选 / 开关 | `<Checkbox label>`、`<Switch label>` | `checkHTML()`、`switchHTML()` | 开关只用于"立即生效"的设置 |
| 单选 | | 标记见 `references/components/choice.md` | |
| 滑杆 / 数字步进 | `<Slider>`、`<Stepper unit="秒">` | `<sn-slider>`、`<sn-stepper>` | |
| 标签输入 | `<TagInput tags>` | `<sn-tag-input>` | |
| 日期 / 时间 | | `createPicker`，标记见 `picker.md` | |
| 验证码 | `<Otp length={6}>` | `<sn-otp>` | |
| 标签页 | `<Tabs tabs value>` | `<sn-tabs>` | |
| 分页 | `<Pager total page onChange>` | `<sn-pager>` | |
| 步骤条 | `<Steps steps current>` | `stepsHTML({ steps, current })` | |
| 折叠面板 | `<Collapse items open>` | `<sn-collapse>` | |
| 表格 | `<Table columns rows selectable onSelect onSort>`（Vue `<SnTable v-model="选中的键">`） | `createTable(el, { columns, rows })`，或照抄下面的 `.sn-tbl` 标记 | 排序时行平滑移到新位置；数字列 `align: "right"`；斑马纹 `striped`、紧凑 `compact`、限高 `maxHeight` |
| 十万行数据表格 | | `satin-ui/grid` 的 `mountDataGrid` | 只在数据真的很多时用 |
| 状态标签 | | `<span class="sn-tag sn-ok"><i></i>已完成</span>` | `sn-run` 进行中、`sn-ok` 完成、`sn-warn` 待处理、`sn-bad` 失败、不加是草稿 |
| 数量徽标 / 头像 | | `<span class="sn-badge">3</span>`、`<span class="sn-av sn-sm" style="--sn-h:210">林</span>` | 头像底色用 `--sn-h` 色相，不写颜色 |
| 设置列表 | | `.sn-set-list > .sn-set-row` | 见 `list.md` |
| 键值对 | | `<dl class="sn-kv"><dt>负责人</dt><dd>林夏</dd></dl>` | |
| 空状态 | | `.sn-empty-state`（图标 + 一句话 + 一个按钮） | 说清楚为什么空、下一步做什么 |
| 加载 | `<Spinner>`；`loadWithSkeleton()` | 骨架见 `loading.md` | 快的请求不闪骨架 |
| 进度 | `<Progress value={0.6}>`、`ring` | `progressHTML()` | |
| 轻提示 | `toast({ text, tone, icon })` | | 操作结果用它；不要 `alert()` |
| 通知 | `notify({ title, text })` | | |
| 横幅 | | `.sn-banner-wrap > .sn-banner.sn-warn` | 整页级的状态（额度、断网） |
| 文字提示 | `<Tooltip text>` | `data-tip="说明"` | |
| 弹窗 | `<Dialog open onClose title footer>` | `<dialog class="sn-dlg">` + `wireDialog` / `openDialog` | 只在必须停下来时用；主按钮在最右 |
| 抽屉 | `<Drawer open onClose title footer>` | `openDrawer()` | 编辑一条记录 |
| 菜单 / 右键菜单 | | `openMenu()`，标记见 `select.md`、`ctxmenu.md` | |
| 命令面板 | | `createCommandPalette()` | |
| 侧栏导航 | | `.sn-app > aside.sn-side + main.sn-app-main`，`createSidebar()` | 选中项 `a.sn-on` |
| 提示词输入框 / 附件 | | `createComposer()` | |
| 对话 | | `satin-ui/chat` 的 `mountChat` | |
| Markdown | | `satin-ui/markdown` 的 `renderMarkdown` | 自带 XSS 过滤 |
| 上传 | | `createUpload()` | |
| 视频 / 音频 | | `satin-ui/media` | |
| 看大图 | | `satin-ui/lightbox` 的 `openLightbox` | |
| 文字层级 | `<Text level="title2" tone="secondary">` | `class="sn-t-title2 sn-c-secondary"` | 层级：display、title1～3、body、body-strong、callout、caption、micro、code |

### 表格（最常用）
```js
// 有交互（排序、勾选）：createTable / React <Table> / Vue <SnTable>
createTable(document.getElementById("projects"), {
  columns: [
    { key: "name", title: "项目", sortable: true },
    { key: "owner", title: "负责人" },
    { key: "status", title: "状态", html: (v) => `<span class="sn-tag ${v.tone}"><i></i>${v.text}</span>` },
    { key: "shots", title: "镜头", align: "right", sortable: true },
  ],
  rows, rowKey: "id", selectable: true, onSelect: (keys) => {}, empty: "还没有项目",
});
```
只展示、不排序时直接写标记：
```html
<div class="sn-tbl-wrap"><div class="sn-tbl-sc"><table class="sn-tbl" aria-label="项目列表">
  <thead><tr><th>项目</th><th>负责人</th><th>状态</th><th class="sn-r">镜头</th></tr></thead>
  <tbody>
    <tr><td><b>雨夜车站</b></td><td>林夏</td><td><span class="sn-tag sn-ok"><i></i>已完成</span></td><td class="sn-r sn-num">48</td></tr>
  </tbody>
</table></div></div>
```
行操作放最后一列，用 ghost 小按钮或"更多"图标按钮；空表格在 `tbody` 里放一行 `.sn-empty-state`。

## 4. 页面骨架类（不用自己写布局 CSS）

| 类 | 作用 |
|---|---|
| `.sn-page`（`.sn-narrow` 760 宽 / `.sn-wide` 1440 宽） | 页面容器：居中、限宽 1200、四周留白，手机上留白收小 |
| `.sn-page-hd` | 页头：左边 `<div><h1>标题</h1><p>一句说明</p></div>`，右边 `<div class="sn-acts">按钮</div>` |
| `.sn-section`（`.sn-section-hd`） | 页面里的大块，之间留 40；块标题 `<h2>` |
| `.sn-panel`（`.sn-panel-hd`、`.sn-panel-ft`、`.sn-flush`） | 面板 / 卡片：白底 + 细线 + 大圆角，**没有阴影** |
| `.sn-stack` / `.sn-row` | 纵向堆叠 / 横排（自动换行）；间距换档：`.sn-gap-4/8/12/16/20/24/32/48` |
| `.sn-cols`（`style="--sn-min:280px"`） | 自适应网格：每格至少这么宽，放得下几列就几列 |
| `.sn-with-aside`（`style="--sn-aside:360px"`） | 主内容 + 右侧栏，窄时右栏落到下面 |
| `.sn-form`、`.sn-form-row`、`.sn-form-ft` | 表单一栏、两个字段并排、底部按钮（主按钮在最右） |
| `.sn-setting` | 设置页的一组：左标题说明、右字段 |
| `.sn-auth` | 登录注册：整屏居中放一个 `.sn-panel` |
| `.sn-stat` | 指标：`<span>标签</span><b>1,284</b><small class="sn-up">+12%</small>` |
| `.sn-bottom-bar` | 手机底部操作栏，贴底，避开底部横条 |

还不够时自己写 CSS，但**只用令牌**：`var(--sn-sp-16)`（间距 0/2/4/6/8/10/12/14/16/20/24/28/32/40/48/64/80）、`var(--sn-label2)`（文字）、
`var(--sn-raised)`（底色）、`var(--sn-line)`（线）、`var(--sn-r-lg)`（圆角）。令牌全表见 `references/tokens.md`。

## 5. 硬规则（检查器会查，违反就是 AI 味）

1. **颜色只用令牌**：不写 `#hex`、`rgb()`、`blue`；文字 `--sn-label/2/3`，底色 `--sn-canvas/raised/sunken`，线 `--sn-line`，状态 `--sn-danger/success/warning`，强调 `--sn-accent`。
2. **不用渐变**：背景、文字、按钮、边框都不用 `linear-gradient` / `radial-gradient`；不加光晕。
3. **不加彩色投影**；卡片不加阴影（阴影只给菜单、弹窗这类浮层），悬停不上浮。
4. **彩色只表达状态**：成功、警告、失败、进行中；不拿颜色做装饰，一页里彩色越少越好。
5. **间距只取刻度**（4 的倍数为主：4/8/12/16/20/24/32/40/48/64），字号只取排版层级，字重只用 400/500/600。
6. **不用 emoji 当图标**，不用 ✨🚀 这类"AI 图标"；图标统一用 Satin 的线性图标。
7. **文案说人话**：按钮写动作（"删除项目"不写"确定"）；不写"赋能""极致""一站式""释放潜能"这类营销腔；不用"欢迎回来！👋"。
8. **不堆卡片**：卡片里不再套卡片；仪表盘不做一墙 KPI 卡片（3～4 个指标放一排就够）。
9. **用真实内容**：像样的名字、数字、日期（"雨夜车站""¥1,280.00""3 分钟前"），不写"Lorem ipsum""示例文本""用户1"。
10. **动效只动 transform / opacity**，曲线用 `var(--sn-ease-out)` 这类令牌；不要每个元素都飞入。
11. **导航选中态要明显**（`a.sn-on`），当前页一眼能看出。
12. **浮层不被裁、不被挡**，按钮文字不换行，元素不重叠，没有横向滚动条。
13. **键盘能用**：可点的东西都能 Tab 到，有焦点框（`:focus-visible`）。
14. **深浅两套主题都要好看**：不写死颜色就自动适配。切深浅：`import { setMode } from "satin-ui/theme"; setMode("dark")`（`"auto"` 跟系统，`"light"` 浅色）；换主色、字体、字号：`set({ accent: "blue" })`。
15. **手机上点得到**：可点区域至少 44×44（按钮 `sn-lg`，图标按钮加 `sn-tap`），字段一栏，底部操作用 `.sn-bottom-bar` 贴底；侧栏布局 `createSidebar(el, { collapseBelow: 720 })`。详见 `references/mobile.md`。

## 6. 常见错误

- 忘了引样式（`satin-ui/css/page.css`）或 theme-boot（Vite 用 `satin()` 插件）→ 页面没样式、深色刷新闪白。
- 只写了 `class="btn primary"` → Satin 的类名都带 `sn-` 前缀：`sn-btn sn-primary`。
- 纯 HTML 页面没调 `setup()` / `defineElements()` / `injectIcons()` → Tooltip 不出、`<sn-select>` 不渲染、`data-i` 不显示图标。
- 在 React / Vue 里用 `document.querySelector` 改组件内部的 DOM → 用组件的 props；要实例就 `ref`。
- 自己写一套按钮、输入框、弹窗样式 → 直接用 Satin 的；要不一样的尺寸用 `sn-sm` / `sn-lg`，别改颜色。
- 嵌进已有页面却引了 `page.css` → 会重置整页样式；改引 `satin-ui/css` 并包 `.sn-root`。
- 弹窗里再弹窗、点背景关弹窗丢内容 → Satin 的弹窗点背景不关，关闭前在底栏问一句。
- 用 `alert()` / `confirm()` → 用 `toast()`、气泡确认（`popconfirm.md`）或弹窗。

## 7. 做完自查

```bash
node <本技能目录>/scripts/check.mjs static src/                # 查代码：写死的颜色、渐变、非刻度间距、emoji 图标、营销腔……
node <本技能目录>/scripts/check.mjs dom http://localhost:5173/  # 查页面：浮层被裁、重叠、横向滚动、按钮换行、深浅 × 三种宽度截图
```
有 error 就改到 0；再看 `/tmp/satin-check/` 里深浅 × 桌面/平板/手机 6 张截图，确认没有错位。

## 参考（按需读）
- `references/recipes.md`：8 种页面的完整骨架代码
- `references/components.md`：全部组件一览；`references/components/<id>.md`：每个组件的写法、选项、状态、验收要点
- `references/tokens.md`：颜色、间距、圆角、阴影、字号、动效令牌
- `references/rules.md`：去 AI 味规则全文（为什么、正例、反例、怎么改）
- `references/icons.md`：图标名
- `references/mobile.md`：手机和 H5 要注意的地方（库已经处理的、你要做的）
