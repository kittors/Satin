# 圆角与线 · 04 号 §4–§5

> 组件 id：`space`　分组：基础

圆角 6 档。线只有 1px，焦点环 2px；默认不画分割线。间距见上一节。

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-row" id="radii" style="gap:20px"></div>
```

### 嵌套圆角：内层 = 外层 − 内边距

```html
<div class="sn-row" style="gap:32px">
<div style="--R:16px;--sn-p:8px"><div></div><span class="sn-cap">外 16，内边距 8 → 内 8</span></div>
<div style="--R:12px;--sn-p:4px"><div></div><span class="sn-cap">外 12，内边距 4 → 内 8（菜单与菜单项）</span></div>
<div style="--R:16px;--sn-p:8px"><div></div><span class="sn-cap sn-c-danger">错误：内外同为 16，四周间距不均</span></div>
</div>
```

