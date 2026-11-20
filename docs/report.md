# Satin Web 改造报告（web-v1）

> 写给回来的用户：做了什么、怎么验证的、数据、截图在哪、哪些没做到。随改造推进补全，最后一次更新见文件末尾。

## 一句话

（收尾时写）

## 做了什么

**阶段 0 · 基准**：`scripts/parity/` 效果对比工具——静态（每个区块、整页分屏、官网各页 × 深浅 × 桌面 / 平板 / 手机，截图逐像素 + DOM 与计算样式逐项）、
逐帧轨迹（每个区块的每个触发器：悬停、点击、Esc、方向键、拖动、滚轮、Tab，记动画定义、DOM 变化、逐帧位置透明度 transform、滚动、焦点）。
噪声全部从根上消掉（固定随机数和时间、外部资源本地缓存、软件栅格化、帧时钟、Worker 搬进主线程、CSS 动画按帧号推进……），没有放宽阈值。

**阶段 1 · 规范**（`spec/`）：DTCG 令牌（生成的 CSS 变量和改造前 3480 次取值一致）、设计规范 13 章、61 个组件契约、动效、24 条去 AI 味规则、8 种页面配方、手机和 H5。

**阶段 2 · 通用层**（`packages/satin-ui`）：问题 1–21 逐条改（见下表），每一步都和改造前逐像素、逐帧比。

| # | 问题 | 怎么解决的 | 怎么验证 |
|---|---|---|---|
| 1 | 导入时有副作用 | 页面级行为（Tooltip 委托、Esc 关浮层、主题……）全部挪进 `setup()`，引用计数；首帧主题脚本在服务端什么都不做 | `scripts/test/node-import.mjs`：39 个入口在 Node 里导入 0 报错、不创建 document |
| 2 | 没有销毁 | `defineComponent` + `track()`：挂载期间的监听、观察器、setInterval、Worker 自动记下，destroy 撤掉；挂载后才有的（测量节点、放进 head 的样式、演示进度）用 `onCleanup` / 组件自己的 destroy；重组件也有 | `scripts/test/lifecycle.mjs`：32 个组件 + 3 个自定义元素 × 100 次，监听、观察器、定时器、后台线程、节点回到起点 |
| 3 | 会改框架管着的 DOM | 框架封装里 Satin 只动自己渲染的那块（宿主 `display: contents`）；React、Vue 不碰组件内部节点 | 框架泄漏 / 示例测试 0 报错 |
| 4 | 只能非受控、不能更新 | 统一 `create(el, opts) → { update, destroy, on, off }`；React / Vue 受控 + 非受控、v-model | 类型测试、示例验收 |
| 5 | 结构约定是隐式的 | `spec/components/` 61 份组件契约写明标记、状态、属性；标记函数（`buttonHTML`、`chatHTML`……）生成和设计稿一样的标记 | 示例验收：纯 HTML 版每个组件和设计稿同一状态逐项比 |
| 6 | 数据表格只是演示 | 新增通用 `createTable`（列定义 + 行数据）；十万行 / 一百万行的表格有了统一写法和销毁，但字段仍是演示用的项目表（没做到，见下） | `scripts/test/table.mjs` |
| 7 | 演示代码和数据混在组件里 | 演示数据、`initX` 接线挪到 `demo/`；库里不再引 Unsplash 图片 | `scripts/test/imports.mjs` |
| 8 | 依赖缠在一起 | 拆成按需的模块，具名导出、无副作用 | `scripts/test/size.mjs`：13 项体积预算全过（只引 toast：gzip 8.8 KB） |
| 9 | API 不统一 | 一律 `createXxx`（轻组件、重组件都有），回调 `onXxx` + 实例 `on()` + DOM 事件 `sn-xxx` 三种拿到同一份数据；主题面板不用再手动传依赖 | 类型测试 |
| 10 | 文案写死中文 | 约 1000 处抽进 `locales/`（中文默认，英文 `satin-ui/locales/en`）；取词函数被局部变量挡住的 37 处已修并加检查 | `scripts/test/i18n-shadow.mjs` |
| 11 | 主题是全页单例 | `applyTheme(el, …)` 局部主题；`setMode()` 深浅；没有 data-theme 时跟系统 | 令牌比对 30 种组合 |
| 12 | 图标是一张大表 | 每个图标单独导出（`satin-ui/icons`），按需打包 | 体积测试 |
| 13 | Markdown 自己写的过滤 | 补了 64 条 XSS 向量的测试，修了 3 个洞 | `scripts/test/md-xss.mjs` |
| 14 | 类名没有前缀 | 类名、CSS 变量统一 `sn-`；漏改的写法（复合选择器、拼出来的样式、当参数传的类名）已补并加检查 | `scripts/test/prefix-leaks.mjs`、对比工具的前缀漏改探针 |
| 15 | 必须引的全局重置 | 页面级重置拆成可选的 `reset.css`（`satin-ui/css/page.css` 含、`satin-ui/css` 不含）；组件自带需要的清零 | 示例里嵌进已有页面不改别的元素 |
| 16 | 没有 @layer、14 处 !important | 全部放进 `@layer satin`；展示页专用的线框布局挪到 demo | 截图对比 |
| 17 | 没写支持哪些浏览器 | `docs/browser-support.md` | — |
| 18 | 两套官网、绝对路径 | 现行的 next-docs 改成新路径和新 API；旧官网文件标"保留待删"（见建议删除清单） | 全站巡检 `docs-audit` |
| 19 | 库里有文档站专用代码 | `__satinRest`、`?embed=` 这些挪到 demo；看图的固定顶栏改成公开的 `setLightboxBounds()` | 代码检索 |
| 20 | 04 / 09 号规范只在注释里 | `spec/`：令牌、13 章规范、组件契约、动效、去 AI 味规则、页面配方 | `scripts/tokens/check.mjs` |
| 21 | 没有 package.json、类型、测试、lint、CI | pnpm 工作区、`satin-ui` 包、d.ts、`pnpm test`（lint + Node 测试 + 类型）、`.github/workflows/ci.yml`（没推送） | `pnpm test` |

**阶段 3 · 框架层**：React、Vue 封装（受控 / 非受控、v-model、服务端渲染）、自定义元素、类型；9 个框架的示例（HTML、React、Vue、Svelte、Solid、Preact、Angular、Next.js、Nuxt）。

**阶段 4 · 移动端**：悬停只给有悬停的设备、触屏上悬停才出现的操作一直显示、安全区、软键盘、长按右键菜单、抽屉滑动关闭、侧栏窄屏收起、iOS 输入框放大、点击区。

**阶段 5 · 技能**（`skills/satin/`）：SKILL.md、自动生成的参考文档、检查器、AGENTS.md 片段。

**阶段 6 · 评测**：低档模型（codex 的 luna、terra）有 / 没有技能做 8 种页面 × 3 种写法，`eval/results.md`。

**阶段 7 · 回归**：（收尾时写）

## 怎么验证的

| 验证 | 工具 | 标准 |
|---|---|---|
| 和改造前逐像素一致 | `scripts/parity/shots.mjs` + `compare.mjs`：嵌入区块 61 个、整页分屏、官网各页 × 深浅 × 桌面 1440 / 平板 768 / 手机 390 | 截图逐像素（pixelmatch 阈值 0）、DOM 和计算样式逐项（类名、变量名去掉 sn- 前缀再比） |
| 和改造前逐帧一致 | `scripts/parity/trace.mjs` + `trace-compare.mjs`：每个区块的每个触发器 | 动画定义完全一样、DOM 变化一一对上、逐帧位置透明度 transform（≤0.5px / 0.01，允许前后差 1 帧） |
| 工具本身没有噪声 | 基线对基线各跑两遍 | 0 差异（不放宽阈值） |
| 令牌 | `scripts/tokens/check.mjs` | 30 种组合 3480 次取值和改造前一致 |
| 导入无副作用、Node / SSR 能用 | `scripts/test/node-import.mjs`、`ssr.mjs` | 38 个入口 0 报错；React、Vue 服务端渲染出完整标记 |
| 不泄漏 | `scripts/test/lifecycle.mjs`（10 个组件 × 100 次挂载 → 更新 → 销毁）、`framework-leaks.mjs`（React StrictMode / Vue × 切路由 + 条件渲染） | 活着的监听、观察器、定时器回到起点，脱离文档的节点不涨 |
| 体积 | `scripts/test/size.mjs` | 单组件打包体积在预算内 |
| 安全 | `scripts/test/md-xss.mjs` | 64 个 XSS 向量全部拦住 |
| 框架示例 | `scripts/examples/check.mjs` | 8 个框架的截图和纯 HTML 版逐像素一致；0 报错；Next / Nuxt 服务端直出完整、不跑 JS 的第一帧 = 水合以后；纯 HTML 版的组件和设计稿同一状态的组件逐项一致 |
| 手机 | `scripts/mobile/check.mjs` | 配方页 Chromium 手机模拟 + WebKit 没有报错和横向溢出；触屏交互（点、长按、拖、滑）结果对、CPU 降速 4 倍时帧间隔 p95 ≤ 17ms、最长 ≤ 34ms |
| 官网 | `scripts/docs-audit.mjs`（含 `--selftest`）、`lb-edge.mjs`、`lb-chat-walk.mjs` | 浮层不被裁、不被挡，换页、载入、溢出、按钮换行、报错 0 |
| 技能 | `skills/satin/scripts/check.test.mjs`、`eval/` | 检查器自测全过；低档模型有技能时的结果见"数据" |
| 代码 | `pnpm lint`、`pnpm test:types` | 0 处 |

## 数据

### AI 评测（源码检查，统一用 v3 检查器重算；每组 24 份 = 8 种页面 × React / Vue / 纯 HTML）

| 批次 | 没有技能：error 平均 / 0 error 的份数 | 有 Satin 技能：error 平均 / 0 error 的份数 | 有技能：warn 平均 |
|---|---|---|---|
| b1 · luna · 技能 v1 | 106.5 / 0 | 0.21 / 21 | 3.46 |
| b2 · luna · 技能 v2 | — | 0.00 / 24 | 2.83 |
| b3 · terra · 技能 v2 | 106.5 / 0 | 0.00 / 24 | 1.46 |
| b4 · luna · 技能 v3 | — | 0.00 / 24 | 1.12（字重 21 处、裸链接 6 处；v2 时是 49、18） |

没有技能时每份平均写死 65～70 处颜色、30 多处非刻度间距，还有彩色投影、渐变、营销腔；有技能时 error 清零，剩下的 warn 主要是字重 700 和裸链接（v3、v4 针对这两条）。
截图人工打分、构建 / 报错 / 页面检查见 `eval/results.md`。

（其余收尾时写）

## 截图和录像在哪

（收尾时写）

## 没做到的（如实）

- **官网截图没拍全矩阵**（决策 29）：所有官网页面只拍了浅色桌面、深色手机两种组合；另外 4 种组合（深色桌面、浅色平板、深色平板、浅色手机）只拍了代表页（首页、快速上手、颜色、布局与响应式、按钮、侧栏，加上最重的 5 个演示：数据表格、画布表格、对话、Markdown、流式布局）。原因：全矩阵两边合计约 6 小时浏览器时间，而组件本身已被嵌入区块和整页的全矩阵覆盖，官网各页共用同一套模板。非代表页在那 4 种组合下的问题只能靠嵌入区块、整页对比和全站巡检间接发现。

- **图标只做到了"用户自己引的按需"**（问题 12 部分解决）：`satin-ui/icons` 每个图标单独导出，页面自己用的图标按需打包；
  但组件内部（按钮、菜单、浮层……）的图标还是按名字查表，只要调了 `setup()` 就会带上整张图标表（压缩前 23.5 KB，gzip 后约 8 KB）。
  比如只用一个 React 分段控件，打包后 gzip 19.7 KB，其中一大半是这张表和页面级行为。要彻底按需，得把组件标记里的 `data-i="名字"` 全部改成引用图标对象，改动面太大，这次没做。
- **十万行 / 一百万行的数据表格**还是演示级：有了统一写法和销毁，但列和数据来自演示用的项目表；接自己的数据要实现 `table-source.js` 的接口。通用表格请用 `createTable`。
- **没有真机**：移动端是 Chromium 手机模拟 + WebKit 引擎模拟，没在真的 iPhone / 安卓上跑过。
- **CI 只写了文件**：`.github/workflows/ci.yml` 按要求没推送，没在远端跑过。

（其余收尾时补）

## 建议删除的文件

改造中没删任何文件；下面这些已经不用了，确认后可以删：

| 文件 | 为什么 |
|---|---|
| `site/index.html`、`site/docs.html`、`site/docs.js`、`site/home.js`（及只被它们用的样式） | 旧版官网，已由 `site/next*.html` 取代；文件开头已标"保留待删" |
| `scripts/refactor/` | 改造用的一次性脚本（加前缀、拆文件、抽多语言、悬停规则改写……），以后不会再跑；留着便于追查改造过程 |
