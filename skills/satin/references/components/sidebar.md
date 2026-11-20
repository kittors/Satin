# 侧栏与布局 · Sidebar · Layout

> 组件 id：`sidebar`　分组：导航

侧栏收起和展开时，主区宽度跟着连续变化；里面的网格换列时，卡片从原位移到新位，换行的卡片从这一行的末尾离开、从下一行的开头进来，不斜穿整个网格。选中项的切换有四种，按侧栏的样子选，不是所有侧栏都适合"底色滑过去"。

## 验收要点

- 选中切换四选一（data-navfx）：**滑块**——一级导航、条目不多、中间没有分组标题；**指示条**——条目密、带图标的侧栏，或收起成图标栏；**原地淡入**——条目多、有分组标题、侧栏自己会滚动、多层级；**仅文字**——文档目录、设置分区这类不抢正文的次级导航。减少动态效果时一律直接切换。
- 侧栏宽 220 ↔ 56，300ms ease.open；文字在收起的前 30% 内淡出，展开过半后再淡入。
- 窗口缩放时不做过渡，布局实时跟手；只有侧栏开合这种一次性的操作才平滑让位。

## 写法

### createSidebar(.sn-app, 选项)

| 选项 / 方法 | 说明 |
|---|---|
| onNavigate | (a) => {}：点了侧栏条目；同时冒泡 sn-navigate |
| toggle() | 收起 / 展开（⌘\ 也行） |
| select(a) | 选中某一项 |
| setFx(v) | 选中样式："slide"（底色滑）\| "bar"（指示条）\| "fade" \| "text" |

## 用法

```js
import { createSidebar } from "satin-ui/components";

// 选中的底色 / 指示条在条目之间滑动（.sn-app 上 data-navfx="slide | bar | fade | text"）；
// [data-collapse] 收起 / 展开（⌘\\ 也行），主区宽度连续变，.sn-app-grid 里的卡片按新列数从原位置滑过去
const side = createSidebar(document.querySelector(".sn-app"), {
  onNavigate: (a) => router.go(a.getAttribute("href")),
});
side.toggle();
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-app" id="app" data-navfx="slide">
<aside class="sn-side">
<div class="sn-side-top"><span class="sn-logo"></span><b>Satin</b><button class="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse="" data-tip="收起侧栏" data-kbd="⌘\" data-i="panel-left"></button></div>
<nav class="sn-side-nav"><span class="sn-hl-bar"></span><span class="sn-hl-ind"></span><a class="sn-on" data-i="layout-grid:before"><span class="sn-lbl">全部项目</span></a><a data-i="image:before"><span class="sn-lbl">素材库</span></a><a data-i="clock:before"><span class="sn-lbl">任务</span><span class="sn-badge sn-soft">3</span></a><a data-i="users:before"><span class="sn-lbl">团队</span></a><p>最近打开</p><a data-i="folder:before"><span class="sn-lbl">雨夜车站</span></a><a data-i="folder:before"><span class="sn-lbl">海边的第七天</span></a></nav>
<div class="sn-side-foot"><a data-i="settings:before"><span class="sn-lbl">设置</span></a></div>
</aside>
<main class="sn-app-main"><div class="sn-app-head"><b>全部项目</b><span class="sn-note">8 个</span></div><div class="sn-app-grid" id="appGrid"></div></main>
</div>
```

## 规则

- 选中切换四选一（`data-navfx`）：**滑块**——一级导航、条目不多、中间没有分组标题；**指示条**——条目密、带图标的侧栏，或收起成图标栏；**原地淡入**——条目多、有分组标题、侧栏自己会滚动、多层级；**仅文字**——文档目录、设置分区这类不抢正文的次级导航。减少动态效果时一律直接切换。
- 侧栏宽 220 ↔ 56，300ms `ease.open`；文字在收起的前 30% 内淡出，展开过半后再淡入。
- 窗口缩放时不做过渡，布局实时跟手；只有侧栏开合这种一次性的操作才平滑让位。

