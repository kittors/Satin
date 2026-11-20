# Satin 技能（给编码助手用）

让 Claude Code、Codex 这类编码助手用 Satin 做界面：做出来像成熟产品，没有 AI 味。不会写代码的人用低档模型也能做出像样的页面。

## 里面有什么

| 文件 | 内容 |
|---|---|
| `SKILL.md` | 主文档：怎么装、页面配方一览、"要做什么 → 用什么"选择表、页面骨架类、常用令牌、硬规则、常见错误、怎么自查 |
| `references/` | 按需读的参考（`node scripts/skill/build.mjs` 从 spec 和设计稿自动生成）：61 个组件各一份、令牌全表、去 AI 味规则全文、图标名、8 种页面配方、手机和 H5 |
| `scripts/check.mjs` | 检查器：`static <源码目录>` 查代码（写死的颜色、渐变、非刻度间距、写错的令牌和类名、emoji 图标、营销腔……），`dom <页面地址>` 在浏览器里量（浮层被裁、重叠、横向溢出、按钮换行、点击区、深浅 × 三种宽度截图）；不依赖别的包（dom 模式要 Playwright） |
| `AGENTS.snippet.md` | 放进项目 AGENTS.md / CLAUDE.md 的一段话 |

## 装到哪

- **Claude Code**：整个目录拷到项目的 `.claude/skills/satin/`（只给这个项目用）或 `~/.claude/skills/satin/`（所有项目）
- **Codex**：拷到项目的 `.agents/skills/satin/`，或者 `~/.codex/skills/satin/`
- 两种都建议再把 `AGENTS.snippet.md` 那段放进项目的 `AGENTS.md`（Codex）/ `CLAUDE.md`（Claude Code），把 `<skill>` 换成上面的目录：这样就算助手没主动加载技能，也会照着做

项目里还要装 `satin-ui`（`npm i satin-ui`）。检查器的 dom 模式要 Playwright：`npm i -D playwright`（用本机 Chrome）。

## 效果

`eval/results.md`：8 种页面 × React / Vue / 纯 HTML，低档模型有 / 没有这个技能各做一遍的对比（构建、报错、检查器、截图人工打分）。
