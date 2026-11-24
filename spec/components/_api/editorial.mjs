// 图文编排与内容张力的 API 契约（手写）。格式见 spec/components/_api/README.md
import { code } from "./_code.mjs";

export default {
  title: "图文编排与内容张力",
  lead: "出版级专题与深度阅读编排样式集（.sn-ed-*）：通过纯大字阶题头、互动电影调色拉帘、实景采样色点胶囊、无竖条留白衬线拉引金句、就近锚定深色光学靶心浮卡与横向接触印相胶片条构建内容节奏，并全面复用 Satin 真实组件（Segmented、Audio、Player、Dialog、NumberFlow、ScrollArea、Lightbox、copied 与 optimistic）。",
  whenToUse: [
    "摄影手记、导演阐述、深度案例研究、产品更新专刊等需要节奏变化与图文张力的专题页。",
    "需要把前后调色对比、画面构图剖析、现场实景采样色板与真实音频/样片试听组织在同一条阅读流里。",
  ],
  whenNotToUse: [
    { text: "纯 Markdown 技术文档、接口说明与代码教程：用 Markdown 文档。", use: "md" },
    { text: "同质化项目列表与素材库平铺浏览：用卡片网格。", use: "card" },
    { text: "独立单图或连续相册放大查看：直接用图片与看图。", use: "image" },
  ],
  related: [
    { id: "md", diff: "Markdown 适合技术文档与流式长文；图文编排面向杂志专题与影像素描，强调画幅比例与互动剖析。" },
    { id: "media", diff: "图文编排中的样片弹窗与实景环境音直接复用 media 的 createPlayer 与 createAudio。" },
    { id: "image", diff: "图文编排的显式放大按钮与接触印相胶片条统一调用 openLightbox 进入连续大图预览。" },
    { id: "scrollarea", diff: "接触印相横向胶片条复用 createScrollArea 实现边缘渐隐与滚轮转横向浏览。" },
  ],
  import: {
    html: 'import { createSegmented, createAudio, createPlayer, createNumberFlow, createScrollArea, openDialog, openLightbox, copied, optimistic, toast } from "satin-ui";',
    react: 'import { Segmented, AudioPlayer, Player, Dialog, NumberFlow, Icon } from "satin-ui/react";\nimport { openLightbox, copied, optimistic, toast } from "satin-ui";',
    vue: 'import { Segmented, AudioPlayer, Player, Dialog, NumberFlow, Icon } from "satin-ui/vue";\nimport { openLightbox, copied, optimistic, toast } from "satin-ui";',
    svelte: 'import { createSegmented, createAudio, createPlayer, openLightbox, copied, toast } from "satin-ui";',
    angular: 'import { createSegmented, createAudio, createPlayer, openLightbox, copied, toast } from "satin-ui";',
    solid: 'import { createSegmented, createAudio, createPlayer, openLightbox, copied, toast } from "satin-ui";',
    preact: 'import { Segmented, AudioPlayer, Player, Dialog, NumberFlow, Icon } from "satin-ui/react"; // 经 preact/compat\nimport { openLightbox, copied, optimistic, toast } from "satin-ui";',
  },
  importNote: {
    react: "引入 `satin-ui/css/content.css` 即可使用全部 `.sn-ed-*` 出版编排样式；内部交互直接组合 `<Segmented>`、`<AudioPlayer>`、`<Player>`、`<Dialog>`、`<NumberFlow>` 与 `openLightbox` / `copied` / `toast`。",
    preact: "经 preact/compat 复用 `satin-ui/react` 组件，配合 `content.css` 的 `.sn-ed-*` 编排样式。",
    vue: "引入 `satin-ui/css/content.css` 使用 `.sn-ed-*` 结构；分段切换、音视频、弹窗与数字滚变直接使用 `satin-ui/vue` 组件。",
    svelte: "引入 `satin-ui/css/content.css`，版式外层包 `<sn-enhance>` 自动注入图标，媒体与滚动区在 `$effect` 中调用 `createSegmented`、`createAudio`、`createScrollArea`。",
    angular: "引入 `satin-ui/css/content.css`，版式使用 `.sn-ed-*` 类名，图标包 `<sn-enhance>` 或内联 SVG，音视频与滚动区域在 `afterNextRender` 中挂载。",
    solid: "引入 `satin-ui/css/content.css`，状态用 `createSignal` 驱动 `--sn-pos` 与靶心索引，放大预览与复制直接调 `openLightbox` / `copied` / `toast`。",
    html: "引入 `content.css`（及所用到的 `data.css`、`form.css`、`overlay.css`、`feedback.css`、`scroll.css`、`number.css`），外层包 `<sn-enhance>` 自动注入图标，交互按需接上 Satin 公开函数。",
  },
  dts: {},
  props: [],
  events: [],
  slots: [],
  methods: [],
  functions: [],
  cssVars: [
    { name: "--sn-pos", desc: "调色对比拉帘的当前分割百分比（0%～100%，驱动左侧裁切、分割线与抓手位置）", default: "52%" },
    { name: "--sn-c", desc: "实景采样色点胶囊 `.sn-ed-swatch` 内色点的填充色", default: "—（由行内样式按色值传入）" },
    { name: "--sn-x / --sn-y", desc: "光学靶心热点 `.sn-ed-pin` 在画框内的百分比坐标", default: "50% / 50%" },
    { name: "--sn-px / --sn-py", desc: "就近锚定光学浮卡 `.sn-ed-pop` 跟随激活靶心的百分比锚点坐标", default: "30% / 54%" },
    { name: "--sn-r-xl", desc: "主视觉调色舞台与剖析画框的大圆角", default: "16px", token: true },
    { name: "--sn-motion-scale", desc: "全站动效缩放系数（控制拉帘滑行、浮卡位移、靶心聚焦与图标变形时长）", default: "1", token: true },
  ],
  classes: [
    { name: ".sn-ed / .sn-ed-head / .sn-ed-title / .sn-ed-deck", desc: "出版专题外容器、题头区、大字阶平衡换行标题与副题" },
    { name: ".sn-ed-byline / .sn-ed-author / .sn-ed-acts", desc: "署名信息与真实动作栏（如样片播放弹窗与收藏计数）" },
    { name: ".sn-ed-compare / .sn-ed-handle / .sn-ed-tag", desc: "锁定 16:9 与视口上限的互动调色拉帘、物理抓手与深色光学角标" },
    { name: ".sn-ed-palette-strip / .sn-ed-swatch", desc: "极简实景采样色点微胶囊条（内嵌 .sn-swap 支持复制变形）" },
    { name: ".sn-ed-article / .sn-ed-prose / .sn-ed-quote / .sn-ed-aside", desc: "出版双栏正文、零粗竖条留白衬线拉引金句与 16:10 侧栏参考剧照" },
    { name: ".sn-ed-canvas / .sn-ed-pin / .sn-ed-pop / .sn-ed-pin-tabs", desc: "光学靶心剖析画框、靶心锚点、就近锚定深色浮卡与双向索引胶囊条" },
    { name: ".sn-ed-reel / .sn-ed-shot", desc: "统一 16:10 比例的横向接触印相胶片条（配合 createScrollArea 滚览）" },
  ],
  types: [],
  keyboard: [
    { keys: "← / →", when: "焦点在调色拉帘抓手或构图标注索引条上", does: "微调调色拉帘分割位置（按住 Shift 步进 15%），或在剖析画框的靶心标注间循环切换。" },
    { keys: "Home / End", when: "焦点在调色拉帘抓手上", does: "一键拉至最左（完整定调）或最右（完整原片）。" },
    { keys: "Enter / 空格", when: "焦点在靶心、色点胶囊或显式放大按钮上", does: "激活对应光学靶心、复制色值或呼出全屏看图。" },
  ],
  a11y: {
    roles: [
      "调色拉帘抓手使用 `role=\"slider\"` 搭配 `aria-valuemin` / `aria-valuemax` / `aria-valuenow` 与中文 `aria-label`。",
      "光学靶心使用 `<button aria-pressed>`，下方联动索引条使用 `role=\"tablist\"` + `role=\"tab\"` + `aria-selected`，锚定浮卡标记 `role=\"region\" aria-live=\"polite\"`。",
      "全屏看图收敛至独立的显式 `<button aria-label=\"全屏查看…\">`，避免整图绑定点击与内部交互冲突。",
    ],
    focus: [
      "拉帘抓手、光学靶心与深色浮卡上的操作按钮均提供清晰高对比白色焦点环（`outline: 2px solid #fff`）。",
      "色点胶囊与索引胶囊在画布表面使用 `--sn-focus` 焦点环，且键盘操作全部可达。",
    ],
    notes: [
      "减少动态效果（`prefers-reduced-motion` 或 `--sn-motion-scale: 0`）下，拉帘跳转、浮卡切换与图片缩放平滑降级为即时到位。",
    ],
  },
  design: {
    do: [
      "用字阶对比、衬线/无衬线字族对比与宽裕留白建张力；关键指标数字自然融入正文叙述，不用独立指标卡片墙打断阅读。",
      "所有编排插图锁定 `aspect-ratio`（16:9 或 16:10）与 `max-height` 上限，在桌面、文档栏与手机端都保持舒展节奏。",
      "交互能力优先直接复用 Satin 真实组件（`createAudio` 真波形、`createPlayer` + `openDialog` 样片、`createSegmented`、`createNumberFlow` + `optimistic`、`copied()`、`createScrollArea` 与 `openLightbox`）。",
      "深色摄影图上的标注浮卡一律使用就近锚定深色光学玻璃，切换时配合平滑位移与内容交叉淡入，并把全屏放大收敛到显式独立按钮。",
    ],
    dont: [
      { text: "在页面或演示里放置没绑事件的装饰性假按钮、用一排圆角灰条拼成假音频波形。", rule: "no-fake-controls" },
      { text: "放着 Satin 现成组件不复用，在业务页面里临时手写简陋的音频条、弹窗或开关山寨版。", rule: "reuse-library-components" },
      { text: "给带有热点标注或调色拉帘的整张大图绑定点击全屏弹窗，导致点击偏移就误触炸开 Lightbox。", rule: "no-hit-conflict" },
      { text: "插入无比例约束或无高度封顶的巨型竖图，折成单栏后一图撑爆整屏。", rule: "media-aspect-discipline" },
      { text: "用带小圆点的眉题胶囊、左侧 2px 粗竖条引用块或四列大字 KPI 指标墙充当出版排版。", rule: "no-left-bar-quote" },
      { text: "在暗色摄影底边横铺一整条发灰半透明大砖块，或在切换注释、复制色值时生硬硬切文案与绿字。", rule: "micro-motion-causality" },
    ],
    copy: [
      "图片说明写成具体场景与光学参数，如「图 01 · 站前广场雨后倒影 · 35mm · f/1.8 · 5200K」。",
      "按钮与提示直写动作和对象，如「看第三集样片」「点击靶心切换标注」，避免空泛口号。",
    ],
    motion: [
      { what: "调色拉帘预设视角滑行与物理抓手缩放", easing: "ease.out.strong", duration: "340ms / 160ms" },
      { what: "光学靶心锚定浮卡空间位移与内容交叉淡入", easing: "ease.out.strong", duration: "260ms / 140ms" },
      { what: "实景色点胶囊点击复制到对勾平滑变形", easing: "ease.out", duration: "200ms" },
      { what: "随文参考图与接触印相悬停微幅推近", easing: "ease.out", duration: "420ms" },
    ],
  },
  examples: [
    {
      slug: "editorial-basic",
      title: "出版级题头、无竖条金句与实景色点胶囊",
      why: "纯字阶标题（零小圆点眉题）、短发丝线留白衬线金句（零左侧粗竖条）与实景主光色点微胶囊（复用 copied() 图标变形 + toast，零生硬绿字）。",
      html: `<sn-enhance><div class="sn-ed" id="editorial-basic"><header class="sn-ed-head"><div class="sn-ed-title" role="heading" aria-level="3">把冷雨夜的光影层次，压进三分钟的留白里</div><p class="sn-ed-deck">在几乎没有对白的夜戏里，色彩温差、机位高度与环境声就是叙事本身。</p></header><figure class="sn-ed-quote"><blockquote>“不要把画面填满，留出三分之一给雨雾和暗部，观众自己的想象会把情绪补完。”</blockquote><cite>导演分镜批注 · 第三集定稿评审</cite></figure><div class="sn-ed-palette-strip"><span class="sn-ed-palette-lbl">本场实景主光采样</span><div class="sn-ed-swatches"><button type="button" class="sn-ed-swatch" data-hex="#1C2733" style="--sn-c:#1C2733" data-tip="积水暗部阴影基调 · 点击复制"><i></i><b>雨夜深蓝</b><code>#1C2733</code><span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span></button><button type="button" class="sn-ed-swatch" data-hex="#4A6274" style="--sn-c:#4A6274" data-tip="雨幕漫反射中间调 · 点击复制"><i></i><b>钠灯冷灰</b><code>#4A6274</code><span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span></button><button type="button" class="sn-ed-swatch" data-hex="#C8935B" style="--sn-c:#C8935B" data-tip="候车厅室内暖光高光 · 点击复制"><i></i><b>钨丝暖琥珀</b><code>#C8935B</code><span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span></button><button type="button" class="sn-ed-swatch" data-hex="#7D2932" style="--sn-c:#7D2932" data-tip="列车制动灯点缀色 · 点击复制"><i></i><b>尾灯暗红</b><code>#7D2932</code><span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span></button></div></div></div></sn-enhance>`,
      code: code("editorial-basic"),
    },
    {
      slug: "editorial-compare",
      title: "互动电影调色拉帘（Log 原片 ↔ 5200K 定调）",
      why: "锁定 16:9 画幅与视口高度上限，支持指针 60fps 拖拽、键盘 ← / → 微调与预设视角滑行，绝不放任巨型竖图撑爆阅读流。",
      html: `<sn-enhance><section class="sn-ed-stage" id="editorial-compare" aria-label="电影调色前后对比"><div class="sn-ed-stage-bar"><span class="sn-ed-stage-meta"><b>图 01 · 站前广场雨后倒影</b><span>35mm · f/1.8 · 5200K</span></span><div class="sn-ed-stage-ctrl"><button type="button" class="sn-btn sn-ghost sn-sm" data-preset="96">Log 原片</button><button type="button" class="sn-btn sn-ghost sn-sm" data-preset="52">居中对比</button><button type="button" class="sn-btn sn-ghost sn-sm" data-preset="4">5200K 定调</button></div></div><div class="sn-ed-compare" style="--sn-pos:52%"><div class="sn-ed-compare-layer sn-ed-compare-after"><img src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1200&h=675&q=84" alt="雨夜车站广场 5200K 电影冷调定调帧" decoding="async"></div><div class="sn-ed-compare-layer sn-ed-compare-before"><img src="https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1200&h=675&q=84" alt="雨夜车站广场 Log 灰片原帧" decoding="async"></div><span class="sn-ed-divider" aria-hidden="true"></span><button type="button" class="sn-ed-handle" role="slider" aria-label="拖动对比 Log 原片与 5200K 定调画面" aria-valuemin="0" aria-valuemax="100" aria-valuenow="52"><span data-i="chevron-left"></span><span data-i="chevron-right"></span></button><span class="sn-ed-tag sn-ed-tag-l">Log 原片</span><span class="sn-ed-tag sn-ed-tag-r">5200K 定调</span></div></section></sn-enhance>`,
      code: code("editorial-compare"),
    },
    {
      slug: "editorial-hotspot",
      title: "光学靶心剖析与就近锚定深色浮卡",
      why: "抛弃压在暗图底边的发灰大砖块与整图误触弹窗：点击靶心或底部索引平滑移动锚定浮卡，点空白收起，右上角独立按钮显式呼出全屏看图。",
      html: `<sn-enhance><section class="sn-ed-inspect" id="editorial-hotspot" aria-label="雨夜构图与布光剖析"><div class="sn-ed-canvas"><img src="https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1200&h=675&q=84" alt="夜色街道与雨幕高光剖析帧" decoding="async"><button type="button" class="sn-ed-canvas-zoom" data-i="maximize-2" data-tip="全屏查看剖析帧" aria-label="全屏查看剖析帧"></button><button type="button" class="sn-ed-pin sn-on" style="--sn-x:24%;--sn-y:74%" aria-label="标注 01：5200K 冷雨积水反射" aria-pressed="true"></button><button type="button" class="sn-ed-pin" style="--sn-x:54%;--sn-y:36%" aria-label="标注 02：纵深电车视线引导" aria-pressed="false"></button><button type="button" class="sn-ed-pin" style="--sn-x:78%;--sn-y:48%" aria-label="标注 03：右侧暗部三分留白" aria-pressed="false"></button><div class="sn-ed-pop" style="--sn-px:24%;--sn-py:74%" data-align="left" role="region" aria-live="polite"><div class="sn-ed-pop-hd"><span class="sn-ed-pop-idx">01 / 03</span><button type="button" class="sn-ed-pop-next">下一处<span data-i="arrow-right"></span></button></div><div class="sn-ed-pop-body"><b>5200K 冷雨积水反射</b><p>浅积水承接钠灯冷白反光并压低高光饱和度，与远景 3400K 暖灯拉开冷暖纵深。</p></div></div></div><div class="sn-ed-pin-bar"><div class="sn-ed-pin-tabs" role="tablist" aria-label="构图标注点"><button type="button" class="sn-ed-pin-tab sn-on" role="tab" aria-selected="true"><i>01</i>冷雨反射</button><button type="button" class="sn-ed-pin-tab" role="tab" aria-selected="false"><i>02</i>视线引导</button><button type="button" class="sn-ed-pin-tab" role="tab" aria-selected="false"><i>03</i>三分留白</button></div><span class="sn-ed-pin-hint">点击靶心切换，点空白收起</span></div></section></sn-enhance>`,
      code: code("editorial-hotspot"),
    },
  ],
};
