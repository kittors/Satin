# Markdown 文档 · Markdown

> 组件 id：`md`　分组：数据展示

AI 的回复、说明文档都用它渲染：标题、列表和任务、引用和提示块、表格、代码（高亮、行号、复制、自动换行、超高折叠）、图片（定高、定宽、定比例、加载占位、失败提示、点开放大）、公式（TeX 写法转成浏览器原生的 MathML）。代码、图片、表格的高度都能设：整体给一个默认值，单个块也能在 Markdown 里单独写。下面切到"源码"或"并排"可以直接改着看。

## 验收要点

- 用法：renderMarkdown(el, md, { codeMax: 240, imgH: 220, tableMax: 0 })，返回的 set() 改高度、update() 换内容；也可以直接在容器上设 --md-code-max、--md-img-h、--md-table-max。
- 单个块：代码块的信息行写 ```js title=app.js maxh=120 wrap nonum（文件名、最高、自动换行、不要行号）；图片在地址后面写 =x160 定高、=320x 定宽、=16:9 定比例。
- 代码比上限高出一行以上才折叠，底部渐隐，点"展开全部"在 240ms 里缓缓展开；收起时代码块顶部跑出窗口就把它拉回来。复制的是原文，不带行号。
- 公式：行内 $…$、块级 $$…$$；支持分式、根号、上下标、求和与积分（块级时上下限在符号上下）、希腊字母、常用关系符和箭头、矩阵、分段函数、\left … \right 括号自动长高、\text、\mathbb。不认识的写法原样显示源码，不影响别的内容。
- 安全：文字全部转义，不渲染原始 HTML；链接只放行 http(s)、mailto 和站内地址，图片另外放行 data:image，外链新窗口打开。半截的 Markdown（流式输出时）也能渲：没闭合的代码块照样显示成代码块。

## 写法

### renderMarkdown(容器, 文本, 选项)（satin-ui/markdown）

| 选项 | 说明 |
|---|---|
| codeMax | 代码块超过多高折叠（px），0 = 不折叠；单个代码块写 maxh=120 |
| imgH | 块级图片统一高度（px），"auto" = 原比例；单张写 =x160、=320x、=16:9 |
| tableMax | 表格最高（px），超出在框里滚，0 = 不限 |
| 返回 | { el, update(文本)（整篇重渲染，滚动位置不跳）, set(选项)（只改样式）, options } |

### 表现

| 内容 | 说明 |
|---|---|
| 图片 | 加载中微光占位，失败给图标和说明；块级图片点开用看图组件——图从原位置长到铺满窗口，整篇文档里加载好的图左右翻，能放大缩小、旋转、还原 |
| 表格 | 表头吸顶；限高后在框里滚，滚到头就停住、不回弹，再滚一次交给页面 |
| 视频、音频 | 图片写法里地址是视频 / 音频，就渲染成播放器 / 音频条 |
| 安全 | 原文里的 HTML 只放行白名单里的标签和属性，script、style、iframe 连内容一起去掉；链接、图片地址只放行相对地址、http(s)、mailto 和图片的 data:image，其余（javascript: 这类，协议中间夹 Tab / 换行也算）换成 # |

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-md-cfg">
<span class="sn-cap">代码最高</span><div class="sn-seg sn-sm" data-seg="mdcode"><span class="sn-thumb"></span><button data-v="120">120</button><button data-v="240">240</button><button data-v="0">不限</button></div>
<span class="sn-cap">图片高度</span><div class="sn-seg sn-sm" data-seg="mdimg"><span class="sn-thumb"></span><button data-v="140">140</button><button data-v="220">220</button><button data-v="auto">原比例</button></div>
<span class="sn-cap">表格最高</span><div class="sn-seg sn-sm" data-seg="mdtable"><span class="sn-thumb"></span><button data-v="0">不限</button><button data-v="120">120</button></div>
<span class="sn-cap">视图</span><div class="sn-seg sn-sm" data-seg="mdview"><span class="sn-thumb"></span><button data-v="doc">预览</button><button data-v="split">并排</button><button data-v="src">源码</button></div>
</div>
<div class="sn-md-demo" data-view="doc"><div class="sn-md-doc" id="mdDoc"></div><textarea class="sn-md-src" id="mdSrc" spellcheck="false" aria-label="Markdown 源码"></textarea></div>
```

## 规则

- 用法：`renderMarkdown(el, md, { codeMax: 240, imgH: 220, tableMax: 0 })`，返回的 `set()` 改高度、`update()` 换内容；也可以直接在容器上设 `--md-code-max`、`--md-img-h`、`--md-table-max`。
- 单个块：代码块的信息行写 ````js title=app.js maxh=120 wrap nonum`（文件名、最高、自动换行、不要行号）；图片在地址后面写 `=x160` 定高、`=320x` 定宽、`=16:9` 定比例。
- 代码比上限高出一行以上才折叠，底部渐隐，点"展开全部"在 240ms 里缓缓展开；收起时代码块顶部跑出窗口就把它拉回来。复制的是原文，不带行号。
- 公式：行内 `$…$`、块级 `$$…$$`；支持分式、根号、上下标、求和与积分（块级时上下限在符号上下）、希腊字母、常用关系符和箭头、矩阵、分段函数、`\left … \right` 括号自动长高、`\text`、`\mathbb`。不认识的写法原样显示源码，不影响别的内容。
- 安全：文字全部转义，不渲染原始 HTML；链接只放行 http(s)、mailto 和站内地址，图片另外放行 data:image，外链新窗口打开。半截的 Markdown（流式输出时）也能渲：没闭合的代码块照样显示成代码块。

