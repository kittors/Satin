# 切换芯片 · ToggleChip · Tag

> 组件 id：`chip`　分组：按钮

筛选条件、多选标签。选中时前面长出一个对勾；可以移除的标签，移除时先收起宽度再消失，旁边的芯片平滑补位。

## 写法

### 标记

| 写法 | 说明 |
|---|---|
| .sn-chip[data-toggle] | 筛选芯片：点了切换 .sn-on（切换照“代码”里几行接上） |
| [data-chips="removable"] .sn-chip .sn-x | 可移除标签：点 × 移除 |

### 函数

| 名称 | 说明 |
|---|---|
| chipHTML({ text, on, removable }) | 生成芯片 / 标签的标记 |
| removeChip(芯片, { onRemoved }) | 先脱离布局淡出，剩下的用弹簧补位 |
| chipremove 事件 | 移除后在容器上冒泡，detail: { chip } |

## 用法

```html
<!-- 筛选芯片：可多选，点了切换（aria-pressed 跟着变） -->
<div class="row">
  <button class="sn-chip sn-on" data-toggle><span data-i="check"></span>进行中</button>
  <button class="sn-chip" data-toggle><span data-i="check"></span>已完成</button>
</div>

<!-- 可移除的标签：容器写 data-chips="removable" -->
<div class="row" data-chips="removable">
  <span class="sn-chip sn-tag sn-on">雨夜<button class="sn-x" aria-label="移除 雨夜" data-i="x"></button></span>
  <span class="sn-chip sn-tag sn-on">车站<button class="sn-x" aria-label="移除 车站" data-i="x"></button></span>
</div>
```

```js
import { injectIcons } from "satin-ui";
import { removeChip } from "satin-ui/components";
import "satin-ui/css/buttons.css";

injectIcons(document);

// 筛选芯片：点了切换 .sn-on，aria-pressed 跟着变
for (const c of document.querySelectorAll(".sn-chip[data-toggle]")) {
  c.setAttribute("aria-pressed", String(c.classList.contains("sn-on")));
  c.addEventListener("click", () => c.setAttribute("aria-pressed", String(c.classList.toggle("sn-on"))));
}

// 可移除标签：点 × 先脱离布局淡出，剩下的用弹簧补位；移除后容器上冒泡 chipremove
const row = document.querySelector('[data-chips="removable"]');
row.addEventListener("click", (e) => {
  const x = e.target.closest(".sn-chip .sn-x");
  if (x) removeChip(x.closest(".sn-chip"));
});
row.addEventListener("chipremove", (e) => console.log("移除了", e.detail.chip.textContent));
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-row" style="gap:8px" id="filterChips"><button class="sn-chip sn-on" data-toggle=""><span data-i="check"></span>进行中</button><button class="sn-chip" data-toggle=""><span data-i="check"></span>已完成</button><button class="sn-chip" data-toggle=""><span data-i="check"></span>失败</button><button class="sn-chip" data-toggle=""><span data-i="check"></span>已归档</button></div>
<div class="sn-row" style="gap:8px" id="tagChips" data-chips="removable"></div>
```

