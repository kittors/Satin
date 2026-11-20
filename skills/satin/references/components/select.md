# 下拉选择与菜单 · Select · Menu

> 组件 id：`select`　分组：表单

面板从触发器那里长出来，带一点回弹，全程不透明，不会透出背后的字。上下键移动、回车选中、Esc 关闭；收起比展开快。

## 验收要点

- 菜单项高 32、圆角 8，面板圆角 12、内边距 4（嵌套公式）。
- 危险项放在最后，用分隔隔开，文字和图标都是红色；不可撤销的再弹确认。
- 子菜单、安全三角区、右键菜单见 右键菜单与子菜单。

## 写法

### createSelect(元素, 选项)

| 选项 | 取值 | 说明 |
|---|---|---|
| items / value / placeholder / label | ["16:9", { value, label, disabled }] / 字符串 | 空容器按它渲染；已有标记时不用给 |
| onChange | (value) => {} | 选中一项时调；value 取条目的 data-v，没写就用文字；同时冒泡 sn-change |

### 返回值

| 名称 | 说明 |
|---|---|
| open() / close(refocus) | 打开、关上 |
| value | 当前选中项的值（只读） |
| update({ value }) | 选中某一项（不触发回调） |

### 标记

| 写法 | 说明 |
|---|---|
| .sn-select[data-select] | 下拉选择：选中后把文字写进 .sn-val、打勾 |
| .sn-select（不带 data-select） | 菜单按钮：选了就关 |
| .sn-trigger / [data-menubtn] | 触发器 |
| [data-prefix] | 写在菜单按钮的触发器上：选中后按钮文字 = 前缀 + 条目文字 |
| .sn-menu > .sn-item | 条目；.sn-sel 选中、.sn-chk 打勾位置、.sn-is-off 不可用、data-v 值 |

### 其他

| 名称 | 说明 |
|---|---|
| bindSelects(root) | 把 root 里所有 .sn-select 一次接上（接过的不重复接） |
| select 事件 | 选中时在 .sn-select 上冒泡，detail: { value, item } |

## 用法

```html
<!-- 下拉选择：选中后把文字写进 .sn-val，打勾 -->
<div class="sn-select" data-select>
  <button class="sn-trigger"><span class="sn-val">16:9 · 横屏</span><span data-i="chevron-down"></span></button>
  <div class="sn-menu" role="listbox">
    <div class="sn-item sn-sel" data-v="16:9">16:9 · 横屏<span class="sn-chk" data-i="check"></span></div>
    <div class="sn-item" data-v="9:16">9:16 · 竖屏<span class="sn-chk" data-i="check"></span></div>
    <div class="sn-item" data-v="1:1">1:1 · 方形<span class="sn-chk" data-i="check"></span></div>
  </div>
</div>

<!-- 菜单按钮：选了就关；触发器写了 data-prefix，选中后按钮文字变成"排序：……" -->
<div class="sn-select sn-inline-menu">
  <button class="sn-btn sn-secondary" data-menubtn data-prefix="排序：">排序：最近更新</button>
  <div class="sn-menu" role="menu">
    <div class="sn-item sn-sel">最近更新<span class="sn-chk" data-i="check"></span></div>
    <div class="sn-item">名称<span class="sn-chk" data-i="check"></span></div>
  </div>
</div>
```

```js
import { setup, injectIcons } from "satin-ui";
import { createSelect, bindSelects } from "satin-ui/components";
import "satin-ui/css/form.css";
import "satin-ui/css/overlay.css";

setup();               // 页面级行为（点外面收起、Esc），整页调一次
injectIcons(document); // data-i 换成图标

// 一个一个接：选中时回调
const ratio = createSelect(document.querySelector("[data-select]"), {
  onChange: (value) => console.log("画面比例", value),
});
ratio.update({ value: "9:16" }); // 改选中项（不触发回调）
ratio.value;                     // "9:16"

// 或者把页面上所有 .sn-select 一次接上，用事件拿结果
bindSelects(document);
document.addEventListener("select", (e) => console.log(e.detail.value));

// 不写标记也行：给一个空容器，按选项渲染
createSelect(document.querySelector("#ratio"), { items: ["16:9 · 横屏", "9:16 · 竖屏"], value: "16:9 · 横屏", label: "画面比例" });
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-row" style="align-items:flex-start;gap:20px">
<div class="sn-select" data-select=""><button class="sn-trigger"><span class="sn-val">16:9 · 横屏</span><span data-i="chevron-down"></span></button>
<div class="sn-menu" role="listbox"><div class="sn-item sn-sel">16:9 · 横屏<span class="sn-chk" data-i="check"></span></div><div class="sn-item">9:16 · 竖屏<span class="sn-chk" data-i="check"></span></div><div class="sn-item">1:1 · 方形<span class="sn-chk" data-i="check"></span></div><div class="sn-item">2.39:1 · 宽银幕<span class="sn-chk" data-i="check"></span></div></div></div>
<div class="sn-select sn-inline-menu"><button class="sn-btn sn-ghost sn-ibtn" data-menubtn="" data-tip="更多" data-i="ellipsis"></button>
<div class="sn-menu" role="menu" style="min-width:200px"><div class="sn-item" data-i="pencil:before">重命名<span class="sn-key">F2</span></div><div class="sn-item" data-i="copy:before">复制一份<span class="sn-key">⌘D</span></div><div class="sn-item" data-i="archive:before">归档</div><div class="sn-sep"></div><div class="sn-item sn-danger-item" data-i="trash-2:before">删除项目</div></div></div>
</div>
```

## 规则

- 菜单项高 32、圆角 8，面板圆角 12、内边距 4（嵌套公式）。
- 危险项放在最后，用分隔隔开，文字和图标都是红色；不可撤销的再弹确认。
- 子菜单、安全三角区、右键菜单见 右键菜单与子菜单。

