# 进度（web-v1）

> 主会话巡检用。每完成一步或至少每 15 分钟更新一次。最后更新：2026-11-21 05:35（北京时间）。

## 现在在做
- 后台浏览器（串行）：阶段 0 基线收尾——官网按缩小后的范围重拍（决策 29，主会话确认）：所有官网页面拍浅色桌面、深色手机；
  另外 4 种组合只拍代表页（首页、快速上手、颜色、布局与响应式、按钮、侧栏，加上最重的 5 个演示：数据表格、画布表格、对话、Markdown、流式布局）。
  两遍都按这个范围，05:29 开拍，拍完自比，再自动接队列 1–4（队列 4 里改造后官网也改成同一范围）
  - 已完成：嵌入区块两遍（截图 366/366 一致、DOM 363/366：Markdown 区块里视口外的懒加载图加载时刻不同，滚动条长度跟着变，画面一致）；
    整页两遍（浅色桌面 50/52、深色桌面 50/52：压测状态行是实时量的帧绘制耗时、流程图连线 20 个像素的抗锯齿、视频"已缓冲"进度条，都是实时量）
- 后台：第 1 轮 AI 评测（luna，48 份）42/48 完成，0 份失败。源码检查 error 平均：没有技能 ≈ 100，有技能 ≈ 0.4。
  跑完自动改成技能 v2，接着跑第 2 轮（luna 有技能）、第 3 轮（terra 两组）
- git：已分段提交 4 段 WIP（对比工具 79aa717、规范 e7aa601、前缀改写和搬目录 408f485、示例 / 测试 / 技能 / 评测 / 文档 见最新提交），没有 push

## 各阶段状态
| 阶段 | 状态 |
|---|---|
| 0 基准 | 工具完成；静态基线对基线 61/61 一致（浅色桌面）；逐帧轨迹基线对基线 46/61 → 找到原因（CSS 动画按真实时间、JS 按帧时钟），已改工具，待重跑；全矩阵进行中；录屏未做 |
| 1 规范 | 令牌、13 章设计规范、61 个组件契约（v0）、动效、22 条去 AI 味规则完成；组件契约要按新 API 重新生成；页面配方未写 |
| 2 通用层 | 问题 1–5、7–17、20 已改；6（数据表格真 API）、18（官网路径、旧站标注）、19（库里的官网代码复查）、21（lint、CI）未完；最近几步（聊天/流程图/输入框演示数据外移、多语言、图标、局部主题、XSS 修复、默认圆角）的效果对比待浏览器空出来后跑 |
| 3 框架层 | React、Vue 封装 + 自定义元素 + 类型完成；9 个示例全部构建通过（Next.js 16 / Turbopack 的解析问题已修）；截图对比、泄漏测试待浏览器空出来 |
| 4 移动端 | 代码已改（见下）；验收脚本 scripts/mobile/check.mjs 写好，WebKit 已装，待浏览器空出来 |
| 5 skill | SKILL.md、8 份页面配方、参考文档自动生成（组件 61 份、令牌、规则、图标）、AGENTS.md 片段完成；检查器静态自测通过，页面模式待跑 |
| 6 评测 | 需求 8 个、跑分脚本（run / score / report）写好；试跑中 |
| 7 报告 | 未开始 |

### 阶段 0：对比工具（scripts/parity/）
- `inpage.js` 页面探针：固定随机数、日期；元素按"标签 + 同标签序号"的路径对应（不看类名）；DOM/计算样式快照；逐帧记录器；前缀漏改探针；
  组件子树快照（示例和设计稿对比用）
- `shots.mjs` 静态（嵌入区块 / 整页 / 官网 × 深浅 × 三宽）、`compare.mjs` 逐像素（阈值 0）+ DOM 逐项、`trace.mjs` + `trace-compare.mjs` 逐帧轨迹
- 消掉的噪声来源（没有靠放宽阈值）：外部资源本地缓存（Range → 206）；周期 ≥1 秒的定时器在静态截图时停住；无盒子元素、滚动驱动属性不比样式；
  软件栅格化 + 确定性开关 + 截图前强制重画；基线自带的 Markdown iframe 高度竞态截图前补报一次；
  逐帧轨迹用帧时钟（performance.now / rAF / 定时器按帧取整、Worker 搬进主线程、输入按帧发、按帧数等到安静）
- 2026-11-21 新发现：两遍基线轨迹 15 个区块不一致。CSS 过渡 / WAAPI 按真实时间播、JS 按帧时钟，开始时刻在帧里的位置每次不同，
  Toast 退场到一半被定时器移除时记下的最后状态不同（还有表格行、选择器弹出、拖动排序等同类）。
  改法：帧时钟每帧开头给文档时间线上在播的动画设 currentTime（按帧号推进，页面自己暂停/跳转/反向的照常），待重跑验证。
  图片、视频加载完成的时刻取决于网络和解码，这类（Markdown 图片淡入、视频播放器）另行判断

### 阶段 1：规范（spec/）
- `spec/tokens/`：DTCG 令牌 + manifest；`scripts/tokens/check.mjs` 30 种组合 3480 次取值和改造前一致
  （唯一有意的改动：不设 data-radius 时按钮圆角 = 胶囊，见 differences #6）
- `spec/guides/` 13 章、`spec/components/` 61 个契约（v0）、`spec/motion/`、`spec/rules/anti-ai.json`（22 条）

### 阶段 2：通用层（packages/satin-ui）
已做：sn- 前缀；库 / 展示页拆分；样式进 `@layer satin`、组件自带清零、页面级重置可选；导入无副作用（`setup()` 装页面级行为）；
统一生命周期 `create → update / destroy / on / off`（100 次挂载销毁 10 个组件 0 泄漏）；演示数据移出组件（聊天、流程图、输入框、媒体）；
多语言（中文默认、英文按需）；图标按需（具名导出）；局部主题；Markdown XSS（64 个向量全拦住，修了 3 个洞）；
Node 导入 35 个入口 0 报错；React/Vue 服务端渲染；类型测试；单组件体积预算（13 项全过）
2026-11-21 新增：
- 线框布局（layout.css）、万级节点压测的样式是展示页专用，挪到 `demo/layout.css`、`demo/stress.css`（类名、顺序不变）
- `satin-ui/css`（全部组件样式，一行引入，不含页面级重置）、`satin-ui/css/page.css`（整页用：含重置）；原来导出表里指向不存在文件的 `./css`、`./tokens.json` 修好
- 包里带一份令牌 JSON（`satin-ui/tokens/*`），`scripts/test/sync.mjs` 查生成物和源头一致
- `satin-ui/theme-boot-script`（theme-boot 的字符串版，服务端渲染内联用）、`satin-ui/vite`（Vite 插件：把 theme-boot 内联进 head）
- `satin-ui/react` 标 `"use client"`（Next.js 服务端组件里可直接用）
- 库的开发依赖挪到仓库根目录；类型测试改用 `tests/types/tsconfig.json`（按包的导出表解析，不再用 paths——根目录 tsconfig 的 paths 会被 Next.js/Turbopack 读去，把运行时导入解析成 .d.ts）

### 阶段 3：框架示例（examples/）
同一批组件（`examples/shared/sink.js`：标题、5 种按钮 + 图标按钮、输入框、复选、开关、分段、滑杆、下拉、标签页、进度条/环、步骤条、折叠面板、步进器、标签）：
| 示例 | 写法 | 构建 |
|---|---|---|
| html | 标记函数 + 自定义元素 | 不用构建 |
| react | `satin-ui/react`，StrictMode | ✓ |
| vue | `app.use(Satin)`，v-model | ✓ |
| svelte (5) | 自定义元素 + 标记函数 | ✓ |
| solid (2.0) | 自定义元素 + 标记函数（Solid 2 的官方插件 `@solidjs/vite-plugin`） | ✓ |
| preact (11) | 自定义元素 + 标记函数 | ✓ |
| angular (22) | 独立组件 + CUSTOM_ELEMENTS_SCHEMA，零 zone | ✓ |
| next (16, Turbopack) | App Router，每次请求服务端渲染 | ✓ |
| nuxt (4) | 服务端渲染 | ✓ |
验收脚本：`scripts/examples/build.mjs`（串行构建）、`scripts/examples/check.mjs`（截图逐像素和纯 HTML 版比 × 深浅 × 桌面/手机；0 报错；
Next/Nuxt 服务端直出有完整标记、不跑 JS 的第一帧 = 水合后；纯 HTML 版每个组件和设计稿同一状态的组件逐项比）——待浏览器空出来跑

### 2026-11-21 04:00 以后
- 子智能体（fork，Opus 5.5）把官网文档的代码、参数表、开始页全部改成 satin-ui 的新 API 和 sn- 类名（111 段代码的导入在包里都能解析），旧官网文件标了"保留待删"，spec 重新生成
- 它报回的库问题都修了：组件实例的 value / tags / page 读数被拷成快照（按属性描述符转接）、提示词输入框 onSend 的 Promise 被丢（事件转发返回回调结果）、
  折叠面板 onToggle 给的是元素不是序号、日期选择器听错了事件名（pick）、主题的状态色变量少了 sn- 前缀；补了标签输入 add/clear、数字滚动 get/setStyle，
  公开了 bindForms、bindBanners、closeBanner、autoGrow、longCount、主题面板（satin-ui/theme-panel）
- 新增：`enhance(root)`（一行接上照设计稿写的标记）、`createTable`（真数据表格：排序时行移到位、勾选、空状态、加载中；React `<Table>`、Vue `<SnTable>`）、
  `composerHTML` / `chatHTML`（提示词输入框、对话框能渲染进空容器）、`setMode()`（深浅切换）、`setLightboxBounds()`（替换官网专用的全局变量）、页面骨架样式 shell.css
- 修：字段的错误区少了内层 span（错误文字不是红色、setFieldError 写不进去）、`.sn-app` 两个用途撞名（改 `.sn-root`）、侧栏布局主区不能滚动、Markdown 预览 iframe 高度竞态、
  默认圆角（没设 data-radius 时按钮 8px、输入框按非胶囊）
- 移动端：127 条悬停规则挪进 @media (hover: hover)（触屏上点完不再留着悬停色，鼠标设备不变）、悬停才出现的操作在触屏上一直显示、轻提示 / 通知 / 抽屉让开刘海和底部横条、
  软键盘弹出时贴底的操作栏让开（--sn-kb）、右键菜单支持长按、侧栏 collapseBelow 窄屏自动收起、触屏上输入框 16px（iOS 不放大）、sn-tap 扩大点击区
- 服务端渲染的第一帧（不跑 JS 时）：分段控件、标签页的选中样子、滑杆的填充和圆钮位置直接写进 html()（data-ssr，脚本接上时去掉），
  createXxx.html() 直接调用时带上默认值（原来少给选项会报错，React / Vue 封装、服务端渲染都受影响）
- 输入框：密码（显示 / 隐藏、大写提示、强度条）、邮箱、搜索、计数也能渲染进空容器；字段的错误区手写时也能看见
- 检查器：新规则"只用存在的令牌""sn- 类名只用 Satin 有的"（评测里模型会猜令牌名、编类名）
- 工程：ESLint（只查真错误，0 处）、CI 工作流（只写了文件，没推送）、根目录 test / lint / build:examples 等命令、Playwright 装进仓库开发依赖

## 遇到的问题
- 基线自带 Markdown iframe 高度竞态（待在库里修）
- Next.js 16（Turbopack）里 `satin-ui/react` 全部是 undefined：根目录 tsconfig 的 paths 指向 .d.ts，Turbopack 拿去解析运行时导入（已修，见上）
- Solid 2.0：`solid-js/web` 拆成 `@solidjs/web`，`attr:` 前缀取消（属性是默认），旧的 vite-plugin-solid 不支持 2.0

## 下一步
基线全矩阵跑完 → 重跑基线轨迹两遍（验证 CSS 动画按帧时钟）→ 改造后静态 + 轨迹全量对比 → 示例验收 → 提交阶段 0–2 → 数据表格 API、lint/CI → 阶段 4–7
