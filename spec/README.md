# Satin 规范

平台无关的那一层：Web（packages/satin-ui）照它实现，以后的原生（MyGo、NSGo）也照它。数值以 `tokens/` 为准。

| 目录 / 文件 | 内容 | 怎么来的 |
|---|---|---|
| [tokens/](tokens/) | 设计令牌（W3C DTCG JSON）：基础、浅 / 深主题、紧凑 / 宽松密度、按钮圆角四档；`manifest.json` 说明每份对应哪个选择器 | 从改造前的样式表里抽出来；`scripts/tokens/build.mjs` 生成 `packages/satin-ui/css/tokens.css`，`check.mjs` 和改造前逐个比 |
| [guides/](guides/) | 设计规范 13 章：原则、颜色、排版、间距、布局、形状、层级、动效、图标、文案、无障碍、手感、去 AI 味 | `scripts/spec/build.mjs` 从官网文档的数据（site/pages.js）生成 |
| [components/](components/) | 61 个组件的契约：说明、验收要点、写法表（类名 / 选项 / 函数）、用法代码、状态、交互、无障碍、手机上 | 同上（site/examples.js、usage.js + 设计稿） |
| [motion/](motion/) | 曲线 8 条、时长 6 档、全部过渡和动画的清单 | 同上（扫样式表和源码） |
| [rules/anti-ai.json](rules/anti-ai.json) | 去 AI 味规则 22 条：为什么、正例、反例、检查器怎么判、怎么改 | 手写；检查器（skills/satin/scripts）带一份快照 |
| [recipes/](recipes/) | 8 种页面配方：后台列表、设置、登录注册、仪表盘、对话、落地页、移动端下单、表单向导 | 手写；`tests/recipes/` 是它们的可运行版本（scripts/skill/recipes-render.mjs 生成） |
| [mobile.md](mobile.md) | 手机和 H5：库已经处理的、写页面时要做的 | 手写 |

改了 site 的文档数据要重新跑 `node scripts/spec/build.mjs`；改了这里的规则、配方、令牌要重新跑 `node scripts/skill/build.mjs`（技能的参考文档）和 `node scripts/test/sync.mjs --write`（包里的令牌、检查器快照）。
