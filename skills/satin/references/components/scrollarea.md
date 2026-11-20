# 滚动区域 · ScrollArea

> 组件 id：`scrollarea`　分组：数据展示

所有会溢出滚动的地方都用它：原生滚动（惯性、键盘、读屏都在），系统滚动条换成一根细的悬浮滚动条，不滚动 0.7 秒后淡出，悬停或拖动时变粗；边缘渐隐只在那个方向还有内容时出现，可以按边开关、调宽度。滚动条位置和渐隐都由滚动时间线驱动，在合成线程上跟手。已经做好的菜单、命令面板、通知列表、抽屉、左侧目录都换成了它。

## 验收要点

- 用法：scrollArea(el, { fade: "y" | "x" | "both" | "top bottom…", size: 24 })；面板自己有定位时（菜单、侧栏）加 inner: true。
- 可配置：bar 滚动条显示方式（auto 自动 / hover 悬停才出 / always 常显，悬浮在内容上 / gutter 常驻占位：滚动条有自己的一条、不压内容，只有真的溢出才出现 / none 隐藏）、barSize 粗细、barInset 离边距离；overscroll 滚到头（auto 默认：竖向交给页面接着滚、横向停住 / contain 停住，弹层和菜单里用 / bounce 回弹：越拉越紧、最多 72px、松手弹回 / chain 交给外层）；wheel: "x" 竖滚轮也横向滚。运行时可以用 set() 改。
- 横向长条（附件条、胶片条）：隐藏滚动条、竖滚轮转横向、回弹；只靠左右渐隐提示还有内容。
- 滑块最短 24px；点轨道翻一屏（平滑）；拖滑块时滑块变粗、不淡出。
- 不支持滚动时间线的环境，由 JS 每帧写位置，外观一样。

## 写法

### createScrollArea(元素, 选项)

| 选项 | 取值 | 默认 | 说明 |
|---|---|---|---|
| fade | "y" \| "x" \| "both" \| "none" \| "top bottom left right" 任意几条边 | "y" | 边缘渐隐的方向。只在那个方向还有内容时出现 |
| size | 数字（px） | 24 | 渐隐带宽度 |
| bar | "auto" \| "hover" \| "always" \| "gutter" \| "none" | "auto" | 滚动条怎么出现：滚动时 / 悬停时 / 一直悬浮 / 一直占位 / 不显示 |
| barSize | 数字（px） | 5 | 滚动条平时的粗细，悬停、拖动时再粗 3px |
| barInset | 数字（px） | 1 | 滚动条离边的距离 |
| overscroll | "auto" \| "contain" \| "bounce" \| "chain" | "auto" | 滚到头：一次滚动里停住、不回弹，再滚一次交给外层（横向停住）/ 都停住 / 回弹（表格别用）/ 都交给外层 |
| wheel | "auto" \| "x" | "auto" | "x"：竖着滚滚轮也横向滚（横向长条用），滚到头放行给页面 |
| inner | true \| false | false | 元素自己有定位（菜单、侧栏这类 absolute / fixed / sticky 面板）时为 true：在元素里面套一层滚动视口 |

### 返回值

| 名称 | 类型 | 说明 |
|---|---|---|
| box | 元素 | 滚动区域外面那一层（定位容器，滚动条画在这里） |
| vp | 元素 | 滚动视口（原生滚动的那个元素） |
| set(选项) | 函数 | 运行时改任意一项选项 |
| refresh() | 函数 | 内容大小变了但没触发观察时，手动重新量滚动条 |
| options | 对象（只读） | 当前的选项 |
| destroy() | 函数 | 撤掉接上时加的监听和观察器 |

### 展示页的标记写法

| 属性 | 对应选项 | 例子 |
|---|---|---|
| data-sa | fade | data-sa="y" |
| data-sa-size | size | data-sa-size="40" |
| data-sa-bar | bar | data-sa-bar="hover" |
| data-sa-bar-size | barSize | data-sa-bar-size="8" |
| data-sa-inset | barInset | data-sa-inset="4" |
| data-sa-over | overscroll | data-sa-over="contain" |
| data-sa-wheel | wheel | data-sa-wheel="x" |

### CSS 变量

| 变量 | 默认 | 说明 |
|---|---|---|
| --sn-sa-fade | 24px | 渐隐带宽度（size 写的就是它） |
| --sn-sa-thumb | 浅色 rgba(0,0,0,.26) / 深色 rgba(255,255,255,.28) | 滑块颜色 |
| --sn-sa-thumb-hover | 浅色 rgba(0,0,0,.44) / 深色 rgba(255,255,255,.48) | 悬停、拖动时滑块颜色 |

### 事件

| 事件 | 说明 |
|---|---|
| sa-jump | 拖滑块一下跳很远时，在视口上同步发出：虚拟列表在同一个任务里画出新位置的内容，不等下一帧 |

## 用法

```html
<div class="sn-list" style="max-height: 240px">…</div>
<div class="sn-strip">…</div>
<div class="board" style="max-height: 240px">…</div>
```

```js
import { createScrollArea } from "satin-ui/components";
import "satin-ui/css/scroll.css";

// 竖向：上下渐隐（默认），系统滚动条换成悬浮的细滚动条
createScrollArea(document.querySelector(".sn-list"));

// 横向长条：左右渐隐 40px；竖着滚滚轮也横向滚，滚到头放行给页面
createScrollArea(document.querySelector(".sn-strip"), { fade: "x", size: 40, wheel: "x" });

// 两个方向都能滚：四边渐隐
createScrollArea(document.querySelector(".board"), { fade: "both" });
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

### 竖向、横向、双向

```html
<div class="sn-sa-demos">
<div class="sn-field"><span class="sn-cap">竖向 · 上下渐隐 24</span><div class="sn-sa-card"><div data-sa="y" id="saList"></div></div></div>
<div class="sn-field"><span class="sn-cap">横向 · 左右渐隐 40 · 竖着滚滚轮也横向滚</span><div class="sn-sa-card"><div data-sa="x" data-sa-size="40" data-sa-wheel="x" id="saStrip"></div></div></div>
<div class="sn-field"><span class="sn-cap">双向 · 四边渐隐</span><div class="sn-sa-card"><div data-sa="both" id="saGrid" style="max-height:240px"></div></div></div>
</div>
```

### 渐隐宽度（size）

```html
<div class="sn-sa-panes"><div class="sn-sa-pane-f"><b>size: 0</b><span>不渐隐，内容直接被边切断</span><div class="sn-sa-card"><div class="sn-sa-pane" data-sa="y" data-sa-size="0"><div class="sn-row-i"><b>镜头 01 · 车站外，雨刚停</b><span>远景 · 3 秒</span></div><div class="sn-row-i"><b>镜头 02 · 林夏走进候车厅</b><span>全景 · 4 秒</span></div><div class="sn-row-i"><b>镜头 03 · 站台上的最后一班车</b><span>中景 · 5 秒</span></div><div class="sn-row-i"><b>镜头 04 · 车窗里的倒影</b><span>近景 · 6 秒</span></div><div class="sn-row-i"><b>镜头 05 · 雨夜里的公交站</b><span>特写 · 7 秒</span></div><div class="sn-row-i"><b>镜头 06 · 空荡的候车厅</b><span>远景 · 3 秒</span></div><div class="sn-row-i"><b>镜头 07 · 天台上的风</b><span>全景 · 4 秒</span></div><div class="sn-row-i"><b>镜头 08 · 便利店的灯</b><span>中景 · 5 秒</span></div><div class="sn-row-i"><b>镜头 09 · 地铁口</b><span>近景 · 6 秒</span></div><div class="sn-row-i"><b>镜头 10 · 旧城区的巷子</b><span>特写 · 7 秒</span></div><div class="sn-row-i"><b>镜头 11 · 海边的清晨</b><span>远景 · 3 秒</span></div><div class="sn-row-i"><b>镜头 12 · 回忆里的教室</b><span>全景 · 4 秒</span></div><div class="sn-row-i"><b>镜头 13 · 告别</b><span>中景 · 5 秒</span></div><div class="sn-row-i"><b>镜头 14 · 清晨的站台</b><span>近景 · 6 秒</span></div></div></div></div><div class="sn-sa-pane-f"><b>size: 16</b><span>窄渐隐，菜单、小列表用</span><div class="sn-sa-card"><div class="sn-sa-pane" data-sa="y" data-sa-size="16"><div class="sn-row-i"><b>镜头 01 · 车站外，雨刚停</b><span>远景 · 3 秒</span></div><div class="sn-row-i"><b>镜头 02 · 林夏走进候车厅</b><span>全景 · 4 秒</span></div><div class="sn-row-i"><b>镜头 03 · 站台上的最后一班车</b><span>中景 · 5 秒</span></div><div class="sn-row-i"><b>镜头 04 · 车窗里的倒影</b><span>近景 · 6 秒</span></div><div class="sn-row-i"><b>镜头 05 · 雨夜里的公交站</b><span>特写 · 7 秒</span></div><div class="sn-row-i"><b>镜头 06 · 空荡的候车厅</b><span>远景 · 3 秒</span></div><div class="sn-row-i"><b>镜头 07 · 天台上的风</b><span>全景 · 4 秒</span></div><div class="sn-row-i"><b>镜头 08 · 便利店的灯</b><span>中景 · 5 秒</span></div><div class="sn-row-i"><b>镜头 09 · 地铁口</b><span>近景 · 6 秒</span></div><div class="sn-row-i"><b>镜头 10 · 旧城区的巷子</b><span>特写 · 7 秒</span></div><div class="sn-row-i"><b>镜头 11 · 海边的清晨</b><span>远景 · 3 秒</span></div><div class="sn-row-i"><b>镜头 12 · 回忆里的教室</b><span>全景 · 4 秒</span></div><div class="sn-row-i"><b>镜头 13 · 告别</b><span>中景 · 5 秒</span></div><div class="sn-row-i"><b>镜头 14 · 清晨的站台</b><span>近景 · 6 秒</span></div></div></div></div><div class="sn-sa-pane-f"><b>size: 24</b><span>默认，页面里的列表用</span><div class="sn-sa-card"><div class="sn-sa-pane" data-sa="y" data-sa-size="24"><div class="sn-row-i"><b>镜头 01 · 车站外，雨刚停</b><span>远景 · 3 秒</span></div><div class="sn-row-i"><b>镜头 02 · 林夏走进候车厅</b><span>全景 · 4 秒</span></div><div class="sn-row-i
<!-- ……后面还有，略 -->
```

### 滚动条怎么出现（bar）

```html
<div class="sn-sa-panes"><div class="sn-sa-pane-f"><b>auto</b><span>滚动或悬停时出现，停下 0.7 秒淡出（默认）</span><div class="sn-sa-card"><div class="sn-sa-pane" data-sa="y" data-sa-bar="auto"><div class="sn-row-i"><b>镜头 01 · 车站外，雨刚停</b><span>远景 · 3 秒</span></div><div class="sn-row-i"><b>镜头 02 · 林夏走进候车厅</b><span>全景 · 4 秒</span></div><div class="sn-row-i"><b>镜头 03 · 站台上的最后一班车</b><span>中景 · 5 秒</span></div><div class="sn-row-i"><b>镜头 04 · 车窗里的倒影</b><span>近景 · 6 秒</span></div><div class="sn-row-i"><b>镜头 05 · 雨夜里的公交站</b><span>特写 · 7 秒</span></div><div class="sn-row-i"><b>镜头 06 · 空荡的候车厅</b><span>远景 · 3 秒</span></div><div class="sn-row-i"><b>镜头 07 · 天台上的风</b><span>全景 · 4 秒</span></div><div class="sn-row-i"><b>镜头 08 · 便利店的灯</b><span>中景 · 5 秒</span></div><div class="sn-row-i"><b>镜头 09 · 地铁口</b><span>近景 · 6 秒</span></div><div class="sn-row-i"><b>镜头 10 · 旧城区的巷子</b><span>特写 · 7 秒</span></div><div class="sn-row-i"><b>镜头 11 · 海边的清晨</b><span>远景 · 3 秒</span></div><div class="sn-row-i"><b>镜头 12 · 回忆里的教室</b><span>全景 · 4 秒</span></div><div class="sn-row-i"><b>镜头 13 · 告别</b><span>中景 · 5 秒</span></div><div class="sn-row-i"><b>镜头 14 · 清晨的站台</b><span>近景 · 6 秒</span></div></div></div></div><div class="sn-sa-pane-f"><b>hover</b><span>只在指针停在区域上时出现</span><div class="sn-sa-card"><div class="sn-sa-pane" data-sa="y" data-sa-bar="hover"><div class="sn-row-i"><b>镜头 01 · 车站外，雨刚停</b><span>远景 · 3 秒</span></div><div class="sn-row-i"><b>镜头 02 · 林夏走进候车厅</b><span>全景 · 4 秒</span></div><div class="sn-row-i"><b>镜头 03 · 站台上的最后一班车</b><span>中景 · 5 秒</span></div><div class="sn-row-i"><b>镜头 04 · 车窗里的倒影</b><span>近景 · 6 秒</span></div><div class="sn-row-i"><b>镜头 05 · 雨夜里的公交站</b><span>特写 · 7 秒</span></div><div class="sn-row-i"><b>镜头 06 · 空荡的候车厅</b><span>远景 · 3 秒</span></div><div class="sn-row-i"><b>镜头 07 · 天台上的风</b><span>全景 · 4 秒</span></div><div class="sn-row-i"><b>镜头 08 · 便利店的灯</b><span>中景 · 5 秒</span></div><div class="sn-row-i"><b>镜头 09 · 地铁口</b><span>近景 · 6 秒</span></div><div class="sn-row-i"><b>镜头 10 · 旧城区的巷子</b><span>特写 · 7 秒</span></div><div class="sn-row-i"><b>镜头 11 · 海边的清晨</b><span>远景 · 3 秒</span></div><div class="sn-row-i"><b>镜头 12 · 回忆里的教室</b><span>全景 · 4 秒</span></div><div class="sn-row-i"><b>镜头 13 · 告别</b><span>中景 · 5 秒</span></div><div class="sn-row-i"><b>镜头 14 · 清晨的站台</b><span>近景 · 6 秒</span></div></div></div></div><div class="sn-sa-pane-f"><b>always</b><span>一直显示，悬浮在内容上</span><div class="sn-sa-card"><div class="sn-sa-pane" data-sa="y" data-sa-bar="always"><div class="sn-row-i"><b>镜头 01 · 车站外，雨刚停</b><span>远景 · 3 秒</span></div><div class="sn-row-i"><b>镜头 02 · 林夏走进候车厅</b><span>全景 · 4 秒</span></div><div cla
<!-- ……后面还有，略 -->
```

### 滚动条粗细、离边距离（barSize、barInset）

```html
<div class="sn-sa-panes"><div class="sn-sa-pane-f"><b>barSize: 3 · barInset: 1</b><span>细一点，贴着边</span><div class="sn-sa-card"><div class="sn-sa-pane" data-sa="y" data-sa-bar="always" data-sa-bar-size="3" data-sa-inset="1"><div class="sn-row-i"><b>镜头 01 · 车站外，雨刚停</b><span>远景 · 3 秒</span></div><div class="sn-row-i"><b>镜头 02 · 林夏走进候车厅</b><span>全景 · 4 秒</span></div><div class="sn-row-i"><b>镜头 03 · 站台上的最后一班车</b><span>中景 · 5 秒</span></div><div class="sn-row-i"><b>镜头 04 · 车窗里的倒影</b><span>近景 · 6 秒</span></div><div class="sn-row-i"><b>镜头 05 · 雨夜里的公交站</b><span>特写 · 7 秒</span></div><div class="sn-row-i"><b>镜头 06 · 空荡的候车厅</b><span>远景 · 3 秒</span></div><div class="sn-row-i"><b>镜头 07 · 天台上的风</b><span>全景 · 4 秒</span></div><div class="sn-row-i"><b>镜头 08 · 便利店的灯</b><span>中景 · 5 秒</span></div><div class="sn-row-i"><b>镜头 09 · 地铁口</b><span>近景 · 6 秒</span></div><div class="sn-row-i"><b>镜头 10 · 旧城区的巷子</b><span>特写 · 7 秒</span></div><div class="sn-row-i"><b>镜头 11 · 海边的清晨</b><span>远景 · 3 秒</span></div><div class="sn-row-i"><b>镜头 12 · 回忆里的教室</b><span>全景 · 4 秒</span></div><div class="sn-row-i"><b>镜头 13 · 告别</b><span>中景 · 5 秒</span></div><div class="sn-row-i"><b>镜头 14 · 清晨的站台</b><span>近景 · 6 秒</span></div></div></div></div><div class="sn-sa-pane-f"><b>barSize: 5 · barInset: 1</b><span>默认：平时 5px，悬停、拖动时再粗 3px</span><div class="sn-sa-card"><div class="sn-sa-pane" data-sa="y" data-sa-bar="always"><div class="sn-row-i"><b>镜头 01 · 车站外，雨刚停</b><span>远景 · 3 秒</span></div><div class="sn-row-i"><b>镜头 02 · 林夏走进候车厅</b><span>全景 · 4 秒</span></div><div class="sn-row-i"><b>镜头 03 · 站台上的最后一班车</b><span>中景 · 5 秒</span></div><div class="sn-row-i"><b>镜头 04 · 车窗里的倒影</b><span>近景 · 6 秒</span></div><div class="sn-row-i"><b>镜头 05 · 雨夜里的公交站</b><span>特写 · 7 秒</span></div><div class="sn-row-i"><b>镜头 06 · 空荡的候车厅</b><span>远景 · 3 秒</span></div><div class="sn-row-i"><b>镜头 07 · 天台上的风</b><span>全景 · 4 秒</span></div><div class="sn-row-i"><b>镜头 08 · 便利店的灯</b><span>中景 · 5 秒</span></div><div class="sn-row-i"><b>镜头 09 · 地铁口</b><span>近景 · 6 秒</span></div><div class="sn-row-i"><b>镜头 10 · 旧城区的巷子</b><span>特写 · 7 秒</span></div><div class="sn-row-i"><b>镜头 11 · 海边的清晨</b><span>远景 · 3 秒</span></div><div class="sn-row-i"><b>镜头 12 · 回忆里的教室</b><span>全景 · 4 秒</span></div><div class="sn-row-i"><b>镜头 13 · 告别</b><span>中景 · 5 秒</span></div><div class="sn-row-i"><b>镜头 14 · 清晨的站台</b><span>近景 · 6 秒</span></div></div></div></div><div class="sn-sa-pane-f"><b>barSize: 8 · barInset: 4</b><span>粗一点，离边远一点（触屏、大面板）</span><div class="sn-sa-card"><div class="sn-sa-pane" data-sa="y" data-sa-bar="always" data-sa-bar-size="8" data-sa-inset="4"><div class="
<!-- ……后面还有，略 -->
```

## 规则

- 用法：`scrollArea(el, { fade: "y" | "x" | "both" | "top bottom…", size: 24 })`；面板自己有定位时（菜单、侧栏）加 `inner: true`。
- 可配置：`bar` 滚动条显示方式（auto 自动 / hover 悬停才出 / always 常显，悬浮在内容上 / gutter 常驻占位：滚动条有自己的一条、不压内容，只有真的溢出才出现 / none 隐藏）、`barSize` 粗细、`barInset` 离边距离；`overscroll` 滚到头（auto 默认：竖向交给页面接着滚、横向停住 / contain 停住，弹层和菜单里用 / bounce 回弹：越拉越紧、最多 72px、松手弹回 / chain 交给外层）；`wheel: "x"` 竖滚轮也横向滚。运行时可以用 `set()` 改。
- 横向长条（附件条、胶片条）：隐藏滚动条、竖滚轮转横向、回弹；只靠左右渐隐提示还有内容。
- 滑块最短 24px；点轨道翻一屏（平滑）；拖滑块时滑块变粗、不淡出。
- 不支持滚动时间线的环境，由 JS 每帧写位置，外观一样。

