# 图标 · 04 号 §7

> 组件 id：`icons`　分组：基础

统一的线性图标，线宽 1.5，颜色跟随文字。16 放在正文旁，20 用在工具栏，24 用在空状态。不用 emoji，不用彩色图标。

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-row" style="margin-bottom:16px"><div class="sn-seg sn-sm" data-seg="iconsize"><span class="sn-thumb"></span><button data-v="16">16</button><button data-v="20">20</button><button data-v="24">24</button></div></div>
<div id="iconGrid"></div>
```

