# Satin

UI 规范库：库在 `packages/satin-ui/`（JS 源码 + CSS，没有构建步骤），`index.html` 是设计稿（一页展示全部组件，接线在 `demo/`），规范在 `spec/`，给 AI 的技能在 `skills/satin/`。改造前的样子在只读备份 `../Satin-baseline-20261120`，效果对比用 `scripts/parity/`。

- 运行：`python3 serve.py 5192 .`，打开 http://127.0.0.1:5192/ 。
- 改完 JS，先在浏览器里逐个 `import()` 模块、看页面有没有报错：`node --check` 拦不住 ES 模块里的语法错误，帧率测试也发现不了页面已经整个没跑起来。
- 动效、滚动的改动要逐帧验收：在页面里用 rAF 每帧记录关键元素的位置和透明度，以这个为准；录屏只用来看画面（录屏本身会制造长帧和乱序帧）。标准：帧间隔 p95 ≤ 17ms、最长 ≤ 34ms、没有 > 50ms 的帧。
- 只动 transform / opacity / filter；深浅两套主题都要截图检查。
- 界面要像成熟产品，不要 AI 感：不加光晕、彩色投影，不堆渐变；颜色只表达状态。
- 页面里的"04 号 §x""09 号 §x"是规范文档的编号（04 令牌，09 交互与动效），规范待整理进 `docs/`。
- 改了官网文档（site/next-docs.*）、演示的浮层处理、组件以后，跑全站巡检 `node scripts/docs-audit.mjs`（每页 × 每个演示 × 每个触发器逐帧查浮层被裁 / 被挡，加换页、载入、溢出、按钮换行、报错；带 `--selftest` 自检；参数和全量跑法见文件开头）。只验报过的那一处不算验收。
- 改了看图（kit-lightbox.js）或演示铺满窗口的处理（watchFloats）以后，再跑看图边界测试 `node scripts/lb-edge.mjs`（缩略图在顶栏底下、窗口下沿外、对话框边上、输入框后面 × 各种关法，逐帧量）和对话页实录 `node scripts/lb-chat-walk.mjs`，自己看录像和拼图；不能只测演示在屏幕正中的情况。
