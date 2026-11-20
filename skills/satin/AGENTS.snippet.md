<!-- 把这一段放进项目的 AGENTS.md（Codex）或 CLAUDE.md（Claude Code）。<skill> 换成 Satin 技能所在的目录，比如 .agents/skills/satin -->
## 界面：用 Satin

做任何页面、组件、样式之前，先读 `<skill>/SKILL.md`，按它做：

- 用 `satin-ui` 的组件和 `sn-` 类名；颜色、间距、字号、圆角、阴影、动效只用 Satin 令牌（`var(--sn-…)`），不写死颜色、不用渐变、不用 emoji 当图标
- 整页先套 `<skill>/references/recipes.md` 里对应的页面配方，再换内容；内容用真实的名字、数字、日期
- 做完跑检查器，error 改到 0：
  - `node <skill>/scripts/check.mjs static <源码目录>`
  - `node <skill>/scripts/check.mjs dom <页面地址>`（深浅 × 桌面 / 平板 / 手机截图在 /tmp/satin-check/，逐张看）
