# 检查器进度（子智能体写，主线程巡检用）

- 开工：建目录 skills/satin/scripts/{lib,fixtures}；方案：不依赖 postcss/acorn（自带极简 CSS 解析和 JS 字符串提取），技能整个拷到别处也能跑；dom 模式用 Playwright + 本机 Chrome
- 写完 lib/css.mjs（极简 CSS 解析）、lib/color.mjs（颜色解析、色差、对比度）、lib/tokens.mjs（令牌取值、最近令牌/刻度/字号/曲线推荐，带快照）、lib/rules.mjs（规则清单，带快照）
- 写完 lib/static.mjs + check.mjs 的 static 模式；坏样例 11 条静态规则全报出来，好样例 0 处
- 写完 lib/dom.mjs（页面检查 13 条 + 浮层点开检查 + 深浅 × 三宽截图），开始用浏览器自测
- 坏页面的页面检查：13 条页面规则全报出来（浮层被裁、撑宽页面的元素都定位准了）
- 自测 check.test.mjs 全部通过：静态 11 条 + 页面 13 条，坏样例 22 条规则全报出，好样例静态 0 处、页面 0 处，6 张截图；耗时约 18 秒
