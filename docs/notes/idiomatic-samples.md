# 5 个组件文档样板：各框架地道写法 + 补的封装（2026-11-21）

主线验收意见："引入写的是组件，示例里却是手写类名 + 每个示例一段 useEffect / onMounted 里 setup() + enhance() 的样板"。这一轮把 button、select、dialog、picker、grid 的示例改成 7 种写法各一份手写源码，补齐了这几个样板用到、库里还没有的框架封装。按钮后来由主线接手（React / Vue 的等待态改叫 `loading`、加了 `SatinProvider`），下面"按钮"一节只记我交出去时的样子。

## 示例源码放在哪

- `spec/components/_api/code/<slug>/<写法>.<后缀>`：一个示例一个目录，`html.html`、`react.jsx`、`vue.vue`、`svelte.svelte`、`angular.ts`、`solid.jsx`、`preact.jsx`，每个都是能直接放进项目的组件文件。契约里写 `code: code("<slug>")`（`spec/components/_api/_code.mjs`），合并后进 `spec/components/<id>.json` 的 `examples[].code`，生成器原样用。
- 第一行注释说明入口已经调过 `setup()`、`defineElements()`（Vue 是 `app.use(Satin)`），示例里不写页面级样板。
- 写成文件是为了能逐个编译：29 个示例 × 7 = 203 个文件，React / Preact 用 esbuild、Solid 用 `@solidjs/compiler`、Vue 用 `@vue/compiler-sfc`、Svelte 用 `svelte/compiler`、Angular 用 TypeScript + `@angular/compiler` 的 `parseTemplate`、HTML 用 linkedom，全部能编译（脚本在会话临时目录，没进仓库；要固化可以放进 `scripts/test/`）。
- 命名约定（生成的全量示例入口按这个引）：React / Vue / Svelte / Solid / Preact 是默认导出；Angular 类名 = slug 转大驼峰 + `Component`、选择器 `demo-<slug>`。纯 HTML 片段里找元素用 id（全量示例里所有片段在同一页）。

## 各框架怎么写

| 写法 | 组件 | 页面级 | 没有组件的（菜单按钮、手写弹窗、选择器标记） |
| --- | --- | --- | --- |
| React | `satin-ui/react`：`Button`、`Select`、`DatePicker`、`Dialog`、`Icon`；`satin-ui/react/grid` 的 `DataGrid` | 入口 `setup()`（组件第一次挂载也会自己调） | `<sn-enhance>` 包标记（React 19 直接支持自定义元素），图标用 `<Icon>` |
| Vue | `satin-ui/vue`：同上 + `vEnhance` 指令；`satin-ui/vue/grid` 的 `DataGrid`；`v-model`、`v-model:open` | `app.use(Satin)`：注册 `<SnXxx>`、`v-enhance`，并装好页面级行为 | `<div v-enhance>` 包标记（不用配 `isCustomElement`） |
| Svelte 5 | `satin-ui/svelte/<名字>.svelte`：`Select`（`bind:value`）、`DatePicker`、`Dialog`（`bind:open`、片段 `footer`）、`DataGrid`、`Icon`、`Satin`（包任意 createXxx） | 入口 `setup()`、`defineElements()` | 按钮写类名；`<sn-enhance>`、`<sn-select onsn-change>` |
| Angular | 自定义元素 `<sn-select [attr.items] [attr.value] (sn-change)>`，组件加 `CUSTOM_ELEMENTS_SCHEMA` | `main.ts` 里 `setup()`、`defineElements()` | `<sn-enhance>` 包标记；`viewChild` + `afterNextRender` / `afterRenderEffect` 建数据表格 |
| Solid 2 | 自定义元素；名字带横线的事件用 ref 挂（`const on = (type, fn) => (el) => el.addEventListener(type, fn)`，Solid 2 没有 `on:`） | 入口 `setup()`、`defineElements()` | `<sn-enhance>`；`onSettled` 返回清理函数建数据表格，`createEffect(seed, apply)` 换数据 |
| Preact | 经 preact/compat 用 `satin-ui/react` 的组件（`@preact/preset-vite` 默认把 react 指到 preact/compat）；钩子从 `preact/hooks` 引；普通元素写 `class`、`for`、`onInput` | 入口 `setup()` | 同 React |
| 纯 HTML | `<sn-select>` 自定义元素 | 入口 `setup()`、`defineElements()` | `<sn-enhance>` 包标记 + 需要时的 `<script type="module">` |

## 补的封装

- `src/picker.js`：`pickerHTML({ kind, placeholder, label })`，和设计稿五种选择器的标记逐字一样（图标直接是 `<svg>`，等于设计稿 enhance 以后的样子）；文字键 picker.143–162 先放在同一张取词表里（`tt = scoped({ ...I18N_DEFAULTS, ...MARKUP })`），以后挪进 `locales/zh-CN/picker.js`。`createPicker` 配上 `html`。
- React：`DatePicker`（`kind`、`placeholder`、`label`、`today`、`now`、`onChange({ text })`）；`satin-ui/react/grid` 的 `DataGrid`（`rows`、`seed`、`label`，变了换 key 重建）；`Dialog` 加 `icon`、`onSubmit`、`footerClassName`、自动 `aria-labelledby`、没有内容不放 `.sn-bd`；`wrap()` 拆到 `react/wrap.js`（子路径复用）。
- Vue：`DatePicker`（`@change`，没有 v-model）、`satin-ui/vue/grid` 的 `DataGrid`、`vEnhance`；`Dialog` 加 `icon`、`guard`、`footerClass`、`@submit`、自动 `aria-labelledby`；插件注册 `SnDatePicker`、`v-enhance` 并调 `setup()`（`app.onUnmount` 时撤掉）；`wrap()` 拆到 `vue/wrap.js`。
- Svelte：`packages/satin-ui/svelte/`（`.svelte` 源码 + README），导出表 `"./svelte/*.svelte"`，类型 `types/svelte.d.ts` + `svelte-<名字>.d.ts`；没有总索引（`node-import` 测试会去 Node 里导入索引，载不了 `.svelte`），也免得没用到的组件被载进来。
- 按钮（交给主线前）：`busy`（300ms 内结束不转圈、转圈至少留 500ms）、`done`（转圈收起后打勾）、`iconAfter`；写了 busy / done 才套 `.sn-label` 结构。主线已改名 `loading`。
- `package.json`：`./react/*`、`./vue/*`（类型 `types/react-*.d.ts`、`types/vue-*.d.ts`）、`./svelte/*.svelte`；`files` 加 `svelte`；可选的 peer `svelte >= 5.20`。

## 验证（都在 Node 里，没开浏览器、没跑框架构建）

- `pickerHTML` 和设计稿五种逐字比对一致；`createPicker` 五种在 linkedom 里挂上 → 更新 → 销毁不报错。
- React / Vue 服务端渲染：新组件输出和 `create.html` 一样；Svelte 用 esbuild + svelte 编译器打成服务端代码渲染，输出一样。
- Svelte 客户端（linkedom）：`Select` 的 `bind:value` 两个方向、`items.push` 重画菜单、条件渲染卸掉销毁实例、再挂上新实例；`Dialog` 的打开、guard（取消先问）、close()、`bind:open` 改回 false、`onclose`、`onsubmit`。
- Vue 客户端（linkedom）：`DatePicker` 挂上、`v-enhance` 接上菜单按钮（点开、选中改文字）、`Dialog` 的 guard / `@close` / `@submit` / `v-model:open`、插件注册、卸载。
- Svelte 的类型：临时目录里按导出表解析（`satin-ui/svelte/Select.svelte` → `svelte-Select.d.ts`），`ComponentProps<typeof X>` 正确、写错种类会报错。
- 契约 ↔ 类型 5/5（测试加了子路径类型文件和 Svelte 组件的比对）、`tsc -p tests/types`、完整度 5/5、ESLint、imports、i18n-shadow、prefix-leaks、node-import、ssr、factories、size 都通过。

## 还没做到 / 要主线验证

- 7 种写法的构建、截图逐像素比：没跑。可能的差别：Vue 的菜单按钮外面多一层 `<div v-enhance>`（块级，里面是 inline-block 的 `.sn-select`，理论上不变）；数据表格纯 HTML / Angular / Solid 多一层宿主 `<div>`（React / Vue / Svelte 是 `display: contents`）。
- Preact 走 preact/compat：示例项目的 `@preact/preset-vite` 默认开着 react 别名，没实际构建过。
- Solid 2：自定义元素的 `value={…}` 编译成 `setAttribute`（看过编译输出）；`createEffect(seed, apply)` 第一次运行时元素是否已经插进文档，要在浏览器里确认。
- Angular：严格模板（strictTemplates）没跑真正的 `ng build`，只做了 TS 语法和模板解析。
- 选择器只能读出显示的文字（`{ text }`），不能从外面设值，所以没有 `v-model` / `bind:value`；要做受控得在 `picker.js` 里加 set 接口。
- 自定义元素里没有 `sn-picker`、`sn-dialog`、`sn-data-grid`（`elements/` 不在这次能改的范围），Angular / Solid / 纯 HTML 只能写标记 + `<sn-enhance>` 或命令式 `createDataGrid`。
- `scripts/test/ssr.mjs`、`factories.mjs` 的清单里还没有 `DatePicker`、`DataGrid`、`createPicker`（不在这次能改的范围）；`packages/satin-ui/README.md` 没写 Svelte 和子路径。
- 技能参考（`scripts/skill/build.mjs`）现在每个示例把 7 种写法都印出来，组件参考变长了很多；给 AI 看的话可以只印 html + 当前框架。
