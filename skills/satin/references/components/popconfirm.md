# 气泡确认 · Popconfirm

> 组件 id：`popconfirm`　分组：浮层

能撤销的操作不确认：直接做，再用 Toast 给"撤销"。只有单条、属于自己、不能撤销的操作才确认，锚在按钮上，从按钮那里展开，默认焦点在"取消"。

## 验收要点

- 确认按钮写明动作："永久删除"，不写"确定"。
- 删掉的行先脱离布局、160ms 缩到 0.96 淡出，下面的行用弹簧补位（09 号 §8.2）。
- 影响大、涉及他人或批量的操作，用下面的弹窗确认。

## 写法

### 标记

| 写法 | 说明 |
|---|---|
| .sn-pop.sn-popconfirm | 气泡确认面板（role="alertdialog"） |
| [data-no] / [data-yes] | 取消 / 确认；打开时焦点先落在取消上 |

### 函数

| 名称 | 说明 |
|---|---|
| openPopover(面板, 按钮, { align: "end" }) | 和弹出面板同一个接口，返回 { close } |

## 用法

```html
<button class="sn-btn sn-danger-soft sn-sm" id="purge">永久删除</button>

<div class="sn-pop sn-popconfirm" id="pc" role="alertdialog" aria-labelledby="pc-q">
  <div class="sn-q"><span data-i="triangle-alert"></span>
    <div><div id="pc-q">永久删除这个镜头？</div><div class="sn-d">删除后无法恢复。</div></div>
  </div>
  <div class="sn-acts">
    <button class="sn-btn sn-ghost sn-sm" data-no>取消</button>
    <button class="sn-btn sn-danger sn-sm" data-yes>永久删除</button>
  </div>
</div>
```

```js
import { openPopover, toast } from "satin-ui/components";

// 气泡确认就是一个弹出面板：打开时焦点先落在"取消"上（防止回车误删）
const btn = document.querySelector("#purge"), pc = document.querySelector("#pc");
btn.addEventListener("click", () => {
  const confirm = openPopover(pc, btn, { align: "end" });
  pc.querySelector("[data-no]").focus();
  pc.querySelector("[data-no]").onclick = () => confirm.close(true);
  pc.querySelector("[data-yes]").onclick = () => { confirm.close(); toast({ text: "镜头已永久删除" }); }; // 换成你的删除
});
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-shot-list" id="shotList"></div>
```

## 规则

- 确认按钮写明动作："永久删除"，不写"确定"。
- 删掉的行先脱离布局、160ms 缩到 0.96 淡出，下面的行用弹簧补位（09 号 §8.2）。
- 影响大、涉及他人或批量的操作，用下面的弹窗确认。

