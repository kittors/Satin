# 乐观更新 · Optimistic

> 组件 id：`optimistic`　分组：行为

几乎一定成功、能撤回的操作（收藏、重命名、排序）先显示结果再保存；保存失败时这一行左右抖两下、恢复原样，并给出重试。付款、永久删除、发给别人的操作不用乐观更新。

## 写法

### optimistic(选项)

| 选项 | 说明 |
|---|---|
| apply / revert | 马上改界面 / 失败时改回去 |
| save | () => Promise：保存 |
| shake | 失败时抖两下的元素 |
| failText | 失败提示（默认“没保存上，已恢复原样”），带“重试” |

## 用法

```js
import { optimistic } from "satin-ui/components";

// 先显示结果再保存；失败时恢复、整行抖两下、出一条带"重试"的提示
star.addEventListener("click", () => {
  const on = !star.classList.contains("sn-on");
  optimistic({
    apply: () => star.classList.toggle("sn-on", on),
    revert: () => star.classList.toggle("sn-on", !on),
    save: () => fetch("/api/star", { method: on ? "POST" : "DELETE" }).then((r) => { if (!r.ok) throw r; }),
    shake: row,
  });
});
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-opt-row"><span class="sn-cv" style="width:48px;height:28px;border-radius:4px;--sn-g:linear-gradient(160deg,#2c3b50,#0e131b);background:var(--sn-g)"></span><span class="sn-nm" data-rename="" tabindex="0" data-tip="双击或按回车改名">雨夜车站</span><button class="sn-star" data-star="" aria-pressed="false"><span data-i="star"></span><span class="sn-n"><span>24</span></span></button></div>
<label class="sn-check" data-c="" style="margin-top:4px"><input type="checkbox" id="optFail">模拟保存失败</label>
```

