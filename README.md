# Satin

一套追求"像成熟产品"的 UI 规范库：动效逐帧打磨，细节克制，深浅两套主题。名字取自缎面——顺滑、有光泽、不张扬。

现在由三部分组成：

- **satin-ui**（`packages/satin-ui/`）：可以安装的包——令牌、组件样式、不依赖框架的组件、React / Vue 封装、自定义元素、类型。用法见 [packages/satin-ui/README.md](packages/satin-ui/README.md)
- **规范**（`spec/`）：令牌（W3C DTCG JSON）、设计规范 13 章、61 个组件契约、动效、去 AI 味规则、8 种页面配方
- **给 AI 的技能**（`skills/satin/`）：Claude Code、Codex 这类编码助手读的说明（组件选择表、页面配方、硬规则、常见错误）和检查器

`index.html` 是设计稿：所有组件一页，能直接点、悬停、用键盘操作；改造后的库要和它逐像素、逐帧一致。

## 运行

```bash
pnpm install
python3 serve.py 5192 .
```

- <http://127.0.0.1:5192/> 设计稿（所有组件一页）
- <http://127.0.0.1:5192/site/next.html> 官网首页、<http://127.0.0.1:5192/site/next-docs.html> 文档
- <http://127.0.0.1:5192/examples/html/> 纯 HTML 示例；其他框架的示例在 `examples/<框架>/`（`pnpm build:examples` 构建）

`serve.py` 和 `python3 -m http.server` 一样，只是每个响应都带 `no-store`，改完刷新就是最新的。

## 有什么

- 基础：颜色、字体、圆角、阴影、图标（146 个线性图标，按需引入）；深浅主题、局部主题，圆角四档
- 按钮、表单、输入框（字数、密码强度、标签、提示词输入框和附件）、表格（排序时行移到位、勾选）
- 选择器：日期、日期范围、时间、定时发布、地址
- 浮层：菜单、右键菜单与多级子菜单（安全三角区、触屏长按）、弹窗、抽屉、Tooltip、命令面板
- 反馈：Toast、通知、加载与等待；滚动区域、无限列表、聊天（发送动效、流式输出）
- 流程图（DOM 版、一万到五万个节点的画布版）、数字变化、图片、视频与音频、上传、Markdown（带 XSS 过滤）
- 数据表格 DOM 版十万行、Canvas 版一百万行（演示级，字段固定）
- 页面骨架（页面容器、页头、面板、堆叠、网格、两栏、表单、登录页、底部操作栏）
- 主题定制：主色（6 种预设 + 自定义）、成功 / 警告 / 危险三种状态色、4 种字体、4 档字号
- 多语言（中文默认、英文按需）、服务端渲染（Next.js、Nuxt）、手机和 H5（触屏、安全区、软键盘）

## 目录

| 路径 | 内容 |
| --- | --- |
| `packages/satin-ui/` | 库：`src/`（JS）、`css/`（样式，全部在 `@layer satin` 里）、`react/`、`vue/`、`elements/`、`types/`、`tokens/`、`vite/` |
| `index.html`、`demo/` | 设计稿和它自己的接线、演示数据、排版样式（不属于库） |
| `site/` | 官网（`next*.html` 是现在的；`index.html`、`docs.html` 是旧版，保留待删） |
| `examples/` | 同一批组件在 HTML、React、Vue、Svelte、Solid、Preact、Angular、Next.js、Nuxt 里的写法 |
| `spec/` | 规范：令牌、设计规范、组件契约、动效、去 AI 味规则、页面配方 |
| `skills/satin/` | 给 AI 的技能和检查器 |
| `scripts/` | 效果对比（`parity/`）、令牌生成（`tokens/`）、规范生成（`spec/`）、测试（`test/`）、示例验收（`examples/`）、移动端验收（`mobile/`）、AI 评测（`eval/`）、改造用的一次性脚本（`refactor/`） |
| `eval/` | AI 评测的需求和结果 |
| `docs/` | 进度、决策、和改造前不一致的地方、浏览器支持、报告 |

## 检查

```bash
pnpm test             # 代码检查 + Node 里的测试（导入、生成物、服务端渲染、体积预算、检查器）+ 类型测试
pnpm test:browser     # 先起 serve.py：组件挂载 → 更新 → 销毁 100 次不泄漏、Markdown XSS
pnpm check:examples   # 各框架示例截图和纯 HTML 版逐像素比
node scripts/docs-audit.mjs   # 官网全站巡检（浮层被裁 / 被挡、换页、载入、溢出、按钮换行、报错）
```

## 标准

- 动效只动 `transform`、`opacity`、`filter`。
- 改完逐帧检查：页面里每帧记录位置，帧间隔 p95 不超过 17ms，最长不超过 34ms，没有超过 50ms 的帧。
- 深浅两套主题都要看，宽窄两种尺寸都要看。
- 不要"AI 感"：不加光晕、彩色投影，不堆渐变；颜色只用来表达状态。
