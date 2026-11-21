# 新增与删除 · Add · Remove

> 组件 id：`addremove`　分组：行为

新的一项从它该在的位置出现（位移 8px、从 96% 放大），其他项平滑让位；删除时数据立刻删掉，离场的元素马上脱离布局淡出，剩下的用弹簧补位；撤销后元素按"新增"的方式回来。

## 写法

### 函数

| 名称 | 说明 |
|---|---|
| insertWithFlip(容器, 元素, 放在谁前面) | 从下面淡入，别的元素让位 |
| removeWithFlip(元素) | 先脱离布局淡出，剩下的用弹簧补位；返回 Promise |

## 用法

```js
import { injectIcons } from "satin-ui";
import { insertWithFlip, removeWithFlip, toast } from "satin-ui/components";

// 新增：从下面淡入，别的标签让位；删除：先脱离布局淡出，剩下的用弹簧补位，给撤销
const box = document.querySelector("#chipsBox"), input = document.querySelector("#addTag");
const chipOf = (text) => {
  const chip = document.createElement("span"); chip.className = "sn-chip sn-tag sn-on";
  chip.innerHTML = `${text}<button class="sn-x" aria-label="移除 ${text}" data-i="x"></button>`;
  injectIcons(chip); return chip;
};
const add = (text, index) => insertWithFlip(box, chipOf(text), box.querySelectorAll(".sn-chip")[index ?? 1e9] || null);
const submit = () => { const v = input.value.trim(); if (!v) return; add(v); input.value = ""; };
input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
document.querySelector("[data-add-tag]").addEventListener("click", submit);

box.addEventListener("click", (e) => {
  const x = e.target.closest(".sn-x"); if (!x) return;
  const chip = x.closest(".sn-chip"), text = chip.firstChild.textContent.trim(), index = [...box.querySelectorAll(".sn-chip")].indexOf(chip);
  removeWithFlip(chip);
  toast({ kind: "action", text: `已移除标签"${text}"`, action: { label: "撤销", run: (t) => { add(text, index); t.update({ kind: "status", text: `已恢复"${text}"`, done: true, duration: 2000 }); } } });
});
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-add-row"><input class="sn-input" id="addTag" placeholder="添加一个标签，回车确认"><button class="sn-btn sn-secondary" data-add-tag="">添加</button></div><div class="sn-chips-box" id="chipsBox"></div>
```

