# Satin

一套追求"像成熟产品"的 UI 组件库：动效逐帧打磨，细节克制，深浅两套主题。名字取自缎面——顺滑、有光泽、不张扬。

> 现在是设计稿阶段：所有组件都在 `index.html` 一页里，能直接点、悬停、用键盘操作。还没有打包成可以安装的包。

## 运行

不用装依赖，纯 HTML、CSS 和 ES 模块：

```bash
python3 serve.py 5192 .
```

然后打开：

- <http://127.0.0.1:5192/> 组件展示页（设计稿，所有组件一页）
- <http://127.0.0.1:5192/site/> 官网首页
- <http://127.0.0.1:5192/site/docs.html> 文档：快速上手、主题定制、UI/UX 规范，每个组件的演示、标记和验收要点

`serve.py` 和 `python3 -m http.server` 一样，只是每个响应都带 `no-store`，改完刷新就是最新的。

## 有什么

- 基础：颜色、字体、圆角、阴影、图标；深浅主题，圆角四档
- 按钮、表单、输入框（字数、密码强度、标签、提示词输入框和附件）
- 选择器：日期、日期范围（两个月并排）、时间、定时发布、地址
- 浮层：菜单、右键菜单与多级子菜单（安全三角区）、弹窗、抽屉、Tooltip、命令面板
- 反馈：Toast、通知、加载与等待
- 滚动区域：可配置滚动条、边缘渐隐、滚到头停住或回弹
- 无限列表、聊天（发送动效、流式输出）
- 流程图：DOM 版（几十到几百个节点）；画布版，一万到五万个节点的神经网络压测，可拖动、逐层激活
- 数字变化（NumberFlow）、图片、视频与音频、上传
- 表格：简单表格（树、合并、拖行、拖列、改宽）；数据表格 DOM 版十万行、Canvas 版一百万行
- 主题定制：主色（6 种预设 + 自定义）、成功 / 警告 / 危险三种状态色、4 种字体、4 档字号，随时改、所有组件立即跟着变

## 用

```html
<head>
  <script src="/satin/theme-boot.js"></script>   <!-- 第一帧之前写好主题，刷新不闪 -->
  <link rel="stylesheet" href="/satin/kit.css">  <!-- 令牌，必需 -->
  <link rel="stylesheet" href="/satin/buttons.css">
</head>
<button class="btn primary">保存修改</button>
```

```js
import { injectIcons, initSeg } from "/satin/kit-core.js";   // 图标占位、分段控件、文字提示
import { initSlider, busy, succeed } from "/satin/kit-form.js";
import { toast } from "/satin/kit-feedback.js";
import { mountCmdk } from "/satin/kit-overlay.js";             // 命令面板
import * as theme from "/satin/kit-theme.js";                  // theme.set({ accent: "blue", scale: "l" })
```

完整的说明在文档里（<http://127.0.0.1:5192/site/docs.html#/start>）。

## 标准

- 动效只动 `transform`、`opacity`、`filter`。
- 改完逐帧检查：页面里每帧记录位置，帧间隔 p95 不超过 17ms，最长不超过 34ms，没有超过 50ms 的帧。
- 深浅两套主题都要看，宽窄两种尺寸都要看。
- 不要"AI 感"：不加光晕、彩色投影，不堆渐变；颜色只用来表达状态。

## 目录

| 文件 | 内容 |
| --- | --- |
| `index.html` | 组件展示页，同时是设计稿 |
| `kit.css`、`kit.js` | 令牌、页面框架、主题切换，以及各模块的入口 |
| `kit-*.js`、`*.css` | 各组件：`kit-scroll` 滚动区域，`kit-chat` 聊天，`kit-flow` 流程图，`kit-flow-stress` 万级节点画布，`kit-picker` 选择器，`kit-number` 数字变化…… |
| `flow-layout.js`、`flow-layout-worker.js` | 分层自动布局和空间索引（在 Web Worker 里跑） |
| `icons.js` | 图标（线性，24px 网格） |
| `kit-core.js` | 公共运行时：图标占位、分段控件、文字提示 |
| `kit-theme.js`、`kit-theme-panel.js`、`theme-boot.js` | 主题定制：变量、现成的面板、第一帧之前写主题 |
| `site/` | 官网：首页、文档（组件页直接读展示页） |
| `review/` | 审阅截图 |
| `serve.py` | 本地预览服务器 |
