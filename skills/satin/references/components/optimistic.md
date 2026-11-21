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
import { optimistic, createNumberFlow, toast } from "satin-ui/components";

// 先显示结果再保存；失败时恢复、整行抖两下、出一条带"重试"的提示（勾上"模拟保存失败"看失败的样子）
const row = document.querySelector(".sn-opt-row"), star = document.querySelector("[data-star]");
const nameEl = document.querySelector("[data-rename]"), failBox = document.querySelector("#optFail");
let count = 24;
const num = createNumberFlow(star.querySelector(".sn-n"), { value: count, style: "blur" });
// 保存：换成你的接口。这里 700ms 后成功，勾上"模拟保存失败"时失败
const save = () => new Promise((ok, fail) => setTimeout(() => (failBox.checked ? fail(new Error("保存失败")) : ok()), 700));

star.addEventListener("click", () => {
  const on = !star.classList.contains("sn-on");
  const show = (v) => { star.classList.toggle("sn-on", v); star.setAttribute("aria-pressed", String(v)); count += v ? 1 : -1; num.update({ value: count }); };
  optimistic({ shake: row, apply: () => show(on), revert: () => show(!on), save });
});

// 改名：双击或按回车进入编辑；回车保存、Esc 放弃，同样先显示再保存
function rename() {
  const old = nameEl.textContent.trim(), inp = document.createElement("input");
  inp.className = "sn-input sn-sm"; inp.value = old; nameEl.replaceChildren(inp); inp.focus(); inp.select();
  let done = false;
  const commit = (keep) => {
    if (done) return; done = true; const v = inp.value.trim() || old;
    if (!keep || v === old) { nameEl.textContent = old; return; }
    optimistic({ shake: row, apply: () => (nameEl.textContent = v), revert: () => (nameEl.textContent = old), save })
      .then(() => toast({ text: `已改名为"${v}"` }), () => {});
  };
  inp.addEventListener("keydown", (e) => { if (e.key === "Enter") commit(true); if (e.key === "Escape") { e.stopPropagation(); commit(false); } });
  inp.addEventListener("blur", () => commit(true));
}
nameEl.addEventListener("dblclick", rename);
nameEl.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target === nameEl) rename(); });
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-opt-row"><span class="sn-cv" style="width:48px;height:28px;border-radius:4px;--sn-g:linear-gradient(160deg,#2c3b50,#0e131b);background:var(--sn-g)"></span><span class="sn-nm" data-rename="" tabindex="0" data-tip="双击或按回车改名">雨夜车站</span><button class="sn-star" data-star="" aria-pressed="false"><span data-i="star"></span><span class="sn-n"><span>24</span></span></button></div>
<label class="sn-check" data-c="" style="margin-top:4px"><input type="checkbox" id="optFail">模拟保存失败</label>
```

