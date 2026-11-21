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
| `import` | 每个框架引入的那一行：`html`、`react`、`vue`、`svelte`、`angular`、`solid`、`preact`（Next.js 看 `react`，Nuxt 看 `vue`）；`importNote` 一句补充 |
| `dts` | 契约测试去 `.d.ts` 里找哪些声明：`factory`（createXxx）或 `options`（选项接口名）、`functions`、`react`、`vue`（组件名）、`element`（`<sn-xxx>` 的名字） |
| `props` | 属性：`name`、`type`（TS 写法）、`default`、`required`（React / Vue 组件里必填；没有组件的看 createXxx 的选项）、`desc`、`example?`；`names` 写每种写法里的叫法：`js`（createXxx 的选项 / 标记函数的参数）、`react`、`vue`、`element`（自定义元素的属性）、`markup`（纯 HTML 标记里的类名、data 属性）——没写的那种写法就是没有这个属性；`native: ["react"]` 表示这个属性在 React 里来自原生 HTML 属性（类型里不单独声明）；`types: { react, vue }` 写各框架类型不同的地方 |
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
| `examples` | 由浅入深的示例：`slug`（`<组件 id>-<名字>`）、`title`、`why`（一两句为什么这样写）、`html`（只用库的公开类名、组件和函数）、`js?`（接线脚本：import 写在最前面，用 `document.querySelector` 找元素——生成示例时改成在演示的根元素里找）、`css?`、`code?`（某个框架的惯用写法和通用生成的不一样时，手写这个框架的完整源码，比如 React 的受控写法：`{ react, vue, … }`） |

说明文字里的代码（标签、函数、类名、属性）用反引号包住（Markdown 行内代码），官网和技能参考都按代码显示。

示例的源码文件由 `scripts/examples/gallery.mjs` 按 `site/frameworks.js` 的 `demo(slug)` 生成到各框架的示例目录（比如 `examples/react/src/demos/button-basic.jsx`），构建、截图后官网直接读这些文件。

检查：
- `node scripts/test/contracts.mjs`：契约和 `packages/satin-ui/types/*.d.ts` 逐项比对（选项、事件、实例方法、函数签名、React / Vue 组件的属性、自定义元素的属性、导出类型），多了少了都报错；没填契约的组件列为"未填"。
- `node scripts/docs-completeness.mjs`：逐个组件查文档的七部分、各框架的示例源码文件、API 表是否齐全，缺什么列出来（`--only id,id` 只查几个）。
