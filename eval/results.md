# AI 评测结果

> 低档模型（codex 的 `clirelay/gpt-6-luna`、`clirelay/gpt-6.1-terra`，推理强度 medium）做 8 种页面 × React / Vue / 纯 HTML，
> 对比"没有技能"和"有 Satin 技能"。做法、打分项见 [README.md](README.md)；每份的源码、截图、打分在 `/tmp/satin-eval/<批次>/`（不进仓库）。

## 各轮用的是什么

| 批次 | 模型 | 组 | 技能版本 | 库 | 说明 |
|---|---|---|---|---|---|
| b1 | luna | 没有 / 有 | v1 | 04:47 打的包 | 48 份 |
| b2 | luna | 有 | v2（常用令牌速查、表单错误、密码框、导入映射、不要编 sn- 类名） | 05:41 打的包 | 24 份；前 7 份的 SKILL.md 是 v2 原样，后 17 份多了一行"服务端别引 theme-boot"（和这些页面无关） |
| b3 | terra | 没有 / 有 | v2 | 06:09 打的包（含取词函数、前缀、对话输入框的修复） | 48 份 |
| b4 | luna | 有 | v3（不加英文眉题、账户放顶栏、检查器跳过隐藏目录） | 第 3 轮跑完时打的包 | 24 份 |

（下面各节由 `scripts/eval/report.mjs` 按打分结果写入，人工看图的分在 `eval/manual-scores.json`）
