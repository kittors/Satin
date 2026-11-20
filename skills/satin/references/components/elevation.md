# 阴影与层级 · 04 号 §6

> 组件 id：`elevation`　分组：基础

三层：卡片（只靠描边和明度差）、浮层（菜单、Popover、通知）、对话框。卡片悬停时不上浮、不加阴影，只叠一层悬停填充。Tooltip 和 Toast 不在这三层里，用反色底，一眼能和页面内容分开。

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div><b>卡片</b><span class="sn-t-caption sn-c-tertiary">raised + 1px 描边</span></div>
<div><b>浮层</b><span class="sn-t-caption sn-c-tertiary">菜单、Popover、通知</span></div>
<div><b>对话框</b><span class="sn-t-caption sn-c-tertiary">对话框、抽屉</span></div>
```

