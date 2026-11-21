# AI 评测

看 Satin 技能能不能让低档模型做出像成熟产品的页面：同一批需求，有 / 没有技能各做一遍，比构建、报错、检查器、截图。

## 怎么做的

| 项 | 设置 |
|---|---|
| 需求 | `tasks.json`：后台列表、设置页、登录注册、仪表盘、AI 对话、落地页、移动端下单、表单向导，各一句话（只说要什么，不说怎么做） |
| 写法 | 每个需求在 React（Vite）、Vue（Vite）、纯 HTML 里各做一遍 |
| 模型 | 本机 codex 目录里最低的两档：`clirelay/gpt-6-luna`、`clirelay/gpt-6.1-terra`；推理强度统一 medium |
| 两组 | 提示词一字不差。"有技能"：目录里放 `.agents/skills/satin/`（SKILL.md、参考、检查器）、AGENTS.md 里加 Satin 那段、装好 satin-ui 本地包；"没有技能"：只有项目说明 |
| 隔离 | 每份在 `/tmp/satin-eval/<批次>/<模型>/<组>/<写法>/<需求>/` 单独做；codex 用 workspace-write 沙箱（只能写这个目录、不联网）；依赖事先装好；本机的全局技能（ui、playwright……）用 `-c skills.config` 临时停用，不改 `~/.codex/config.toml` |
| 跑法 | `node scripts/eval/run.mjs --batch b1 --model clirelay/gpt-6-luna`（3 份并行、25 分钟超时） |

## 怎么打分

| 项 | 怎么量 |
|---|---|
| 跑完 | 没超时 |
| 构建 / 打开 | React、Vue `vite build` 通过；纯 HTML 有 index.html |
| 报错 | 浏览器里打开（浅 / 深 × 桌面 1440 / 手机 390）、再依次点页面上的按钮、往输入框打字、按 Tab：页面报错、控制台报错、请求失败的条数 |
| 检查器 | `skills/satin/scripts/check.mjs`：源码模式（写死的颜色、非刻度间距、渐变、彩色投影、写错的令牌和类名……）、页面模式（桌面 / 手机 × 深浅）的 error、warn 条数 |
| 看图（人工） | 每个需求一张拼图（`_sheets/`：没有 / 有技能 × 三种写法，浅色桌面 + 深色手机），按"AI 味七问"每一问各打 0–2 分（2 没有这个毛病、1 有一两处、0 明显），合计 0–14；另记一个 1–5 的总体分（5 像成熟产品），和以前的批次对比用。七问见 `spec/rules/anti-ai.json` 的 roots（自说自话、假、照搬、堆信号、语义错位、只在理想条件下成立、生硬） |

看图的分写进 `manual-scores.json`：每份 `{ "score": 1–5, "roots": { "self-talk": 0–2, "fake": 0–2, "misfit": 0–2, "noise": 0–2, "semantics": 0–2, "ideal": 0–2, "abrupt": 0–2 }, "note": "扣分的地方写清楚是哪一问" }`。2026-11-22 以前打的分只有 score 和 note。

`node scripts/eval/static-score.mjs --batch b1` 只跑不开浏览器的那一半（构建 + 源码检查）；`score.mjs` 跑全部；`report.mjs` 把结果写进 `results.md`。

## 结果

见 [results.md](results.md)。
