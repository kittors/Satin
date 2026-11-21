## 契约格式（手写的 API 契约）

每个组件的手写契约放在 `spec/components/_api/<id>.mjs`（导出一个对象；写成 JS 是为了多行的代码示例好写），
`node scripts/spec/build.mjs` 把它合并进同名的 `spec/components/<id>.json`（合并后带 `"contract": 1`）。
官网的组件页、技能的参考文档（`skills/satin/references/components/<id>.md`）、契约测试、完整度检查都读合并后的 JSON——人看的和 AI 看的是同一份。

| 字段 | 内容 |
| --- | --- |
| `title` / `lead` | 页面标题；一句话说明它是什么 |
| `whenToUse` | 什么时候用（几条） |
| `whenNotToUse` | 什么时候别用：`{ text, use? }`，`use` 是应该换成的组件 id |
| `related` | 相近的组件：`{ id, diff }`，`diff` 一句话说清区别 |
| `import` | 每个框架引入的那一行：`html`、`react`、`vue`、`svelte`、`angular`、`solid`、`preact`（Next.js 看 `react`，Nuxt 看 `vue`）；`importNote` 按框架分开写 `{ react, vue, svelte, angular, solid, preact, html }`（官网只显示当前框架那一句，别把几个框架混在一段里讲） |
| `dts` | 契约测试去 `.d.ts` 里找哪些声明：`factory`（createXxx）或 `options`（选项接口名）、`functions`、`react`、`vue`、`svelte`（组件名；重组件在子路径的类型文件里，比如 `react-grid.d.ts`、`vue-grid.d.ts`、`svelte-DataGrid.d.ts`，按名字自动找）、`element`（`<sn-xxx>` 的名字） |
| `props` | 属性：`name`、`type`（TS 写法；React / 选项的类型）、`typeBy?`（某种写法的类型不一样时按写法给：`{ vue: "string" }`，键和 `names` 一样；没写的写法用 `type`）、`descBy?`（说明按写法给：`desc` 写通用的意思，各写法自己的受控方式、叫法写进 `descBy[写法]`，比如 React 写"在 onChange 里更新"、Vue 写"`v-model` 绑定"；官网按当前写法取，没写的用 `desc`）、`default`、`required`（React / Vue 组件里必填；没有组件的看 createXxx 的选项）、`desc`、`example?`；`names` 写每种写法里的叫法：`js`（createXxx 的选项 / 标记函数的参数）、`react`、`vue`（`v-model` 算 modelValue，`v-model:x` 算 x）、`svelte`（`bind:x` 算 x）、`preact`（经 preact/compat 用 React 的组件，和 `react` 一样）、`angular`、`solid`、`element`（自定义元素的属性）、`html`（手写标记里的类名、data 属性；官网上 Svelte、Angular、Solid、纯 HTML 没写自己那一项时看 `element`，再看它）、`markup`（同 `html`，旧写法）——没写的那种写法就是没有这个属性；`native: ["react"]`（或 `"vue"`、`"svelte"`）表示这个属性在那种写法里来自原生 HTML 属性、透传下去（类型里不单独声明）；`types: { react, vue }` 写各框架类型不同的地方 |
| `columnProps` | 可选：某个属性是一组对象时（数据表格、Canvas 表格的 `columns`），对象里有哪些字段，另画一张子表："列定义"。每项 `{ name, type, default, desc }`，`name` 可以合写（`"width / minWidth"`）；不和 `.d.ts` 比对（类型在 `GridColumn` 里） |
| `events` | 事件：`name`、`payload`（参数类型）、`when`（什么时候触发）；`names` 写各框架的写法（`js` 选项里的 onXxx、`react` onXxx、`vue` @xxx、`angular` (xxx)、`svelte`、`solid`、`preact`、`element`、`html`）；`native: true` 是原生 DOM 事件；`markupOnly: true` 只在手写标记的接法里有 |
| `slots` | 插槽 / 子元素：`name`、`desc`、`names`（React 的 children / 某个属性，Vue 的插槽名）；`native: ["react"]` 表示 React 里来自原生属性（比如按钮的 children） |
| `methods` | 实例上的（createXxx 返回的、React / Vue 的 ref 拿到的）：`name`、`kind`（`method` / `property`）、`signature`、`returns`、`desc`。所有组件都有的 `el`、`update`、`destroy`、`on`、`off` 不重复写 |
| `functions` | 不挂在实例上的函数：`name`、`signature`、`returns`、`from`、`desc` |
| `cssVars` | 能改的 CSS 变量：`name`、`desc`、`default`；`token: true` 是全局令牌（改了影响所有用到它的组件） |
| `classes` | 纯 HTML 写法的类名、data 属性：`name`、`desc` |
| `types` | 导出的 TS 类型名 |
| `keyboard` | `{ keys, when?, does }` |
| `a11y` | `{ roles: [...], focus: [...], notes: [...] }`；还没做到的写在 `notes` 里，开头写"还没做到" |
| `design` | `do`、`dont`（`{ text, rule? }`，`rule` 是 `spec/rules/anti-ai.json` 里的规则 id）、`copy`（文案建议）、`motion`（`{ what, easing, duration }`，`easing` 写令牌名） |
| `examples` | 由浅入深的示例：`slug`（`<组件 id>-<名字>`）、`title`、`why`（一两句为什么这样写）、`html`（只用库的公开类名、组件和函数）、`js?`（接线脚本：import 写在最前面，用 `document.querySelector` 找元素——生成示例时改成在演示的根元素里找）、`css?`、`code?`（7 种写法各一份手写的完整源码：`{ html, react, vue, svelte, angular, solid, preact }`，生成全量示例时原样用；源码放在 `code/<slug>/<写法>.<后缀>`，用 `_code.mjs` 的 `code(slug)` 读进来，见下） |

说明文字里的代码（标签、函数、类名、属性）用反引号包住（Markdown 行内代码），官网和技能参考都按代码显示。

示例的源码文件由 `scripts/examples/gallery.mjs` 按 `site/frameworks.js` 的 `demo(slug)` 生成到各框架的示例目录（比如 `examples/react/src/demos/button-basic.jsx`），构建、截图后官网直接读这些文件。

检查：
- `node scripts/test/contracts.mjs`：契约和 `packages/satin-ui/types/*.d.ts` 逐项比对（选项、事件、实例方法、函数签名、React / Vue 组件的属性、自定义元素的属性、导出类型），多了少了都报错；没填契约的组件列为"未填"。
- `node scripts/docs-completeness.mjs`：逐个组件查文档的七部分、各框架的示例源码文件、API 表是否齐全，缺什么列出来（`--only id,id` 只查几个）。

## 示例的 7 种写法（`code/<slug>/`）

每个示例一个目录，7 个文件：`html.html`、`react.jsx`、`vue.vue`、`svelte.svelte`、`angular.ts`、`solid.jsx`、`preact.jsx`。契约里写 `code: code("button-basic")`（`import { code } from "./_code.mjs"`）。

- 每个文件都是能直接放进项目的组件文件：React / Preact / Solid 是 `export default function Xxx() {…}`，Vue 是 SFC，Svelte 是 `.svelte`，Angular 是独立组件（类名是 slug 转大驼峰 + `Component`，比如 `ButtonBasicComponent`；选择器 `demo-<slug>`，全量示例的入口按这个引），纯 HTML 是标记 + 需要时的 `<script type="module">`（找元素用 id，全量示例里所有片段在同一页）。
- 页面级的 `setup()`、`defineElements()`（Vue 是 `app.use(Satin)`，React 可以在根部包 `<SatinProvider>`）当作应用入口已经调过，示例里不写，也不加注释（初始化只在快速上手、框架接入页讲一次）。
- 用各框架地道的写法：React、Vue、Preact（经 preact/compat）、Svelte 用组件和属性（`variant`、`v-model`、`bind:value`、`onChange`……），图标用 `<Icon>` 或组件的 `icon` 属性；Angular、Solid、纯 HTML 写自定义元素（`<sn-select>`）或包一层 `<sn-enhance>` 的标记。
- 7 份的效果要一样（同样的内容、同样的状态）：全量示例会把 7 份分别构建、截图逐像素比。

## 纯样式组件的示例：从一份标记写出 7 种写法

只有标记、没有脚本的示例（卡片、空状态、标签、加载占位……）不用一份份手写：
`node scripts/spec/static-variants.mjs <slug> <标记文件>` 按各框架的惯用法写出 7 个文件（React 的 `className`、style 对象、`<Icon name>`；Vue / Svelte 的 `<Icon>`；
Angular、Solid、纯 HTML 保留 `data-i` 外面包 `<sn-enhance>`），写完再按需要手改。组件有 React / Vue 封装（`Button`、`Chip`、`Segmented`……）或者要受控、要交互的示例，React、Vue 那两份要手写成用组件的写法。

## 写完以后

1. `node scripts/spec/build.mjs --components`（合并进 JSON）→ `node scripts/test/contracts.mjs`（契约 ↔ 类型）→ `node scripts/docs-completeness.mjs --only <id>`（七部分齐不齐）
2. `node scripts/examples/contracts.mjs --only <id>`（示例写进 examples/<写法>/）→ `node scripts/test/contract-ssr.mjs --only <id>`（React / Vue 写法渲染出来的标记和纯 HTML 写法一样）
3. `node scripts/skill/build.mjs`（技能参考）；构建和逐像素截图（`node scripts/examples/build.mjs`、`node scripts/examples/gallery-check.mjs`）要开浏览器、占 CPU，排进共用的浏览器锁里跑
