# 搜索、密码、邮箱 · SearchField · SecretInput · EmailField

> 组件 id：`special`　分组：表单

搜索：空着时显示快捷键，一输入就换成清除按钮；等结果超过 300ms 时放大镜换成转圈，结果数量从右边淡入。密码：强度条从左往右依次点亮，文字滚动换掉；大写锁定打开时下面展开一行提示。邮箱：格式对了，右边的对勾一笔画出来。

## 验收要点

- 搜索的转圈遵守 09 号 §7：300ms 内回来就不转，转了至少留 500ms。
- 密码强度只看长度和字符种类，不在用户还没写完时说"太弱"：8 位以内只亮灰色。
- 邮箱校验在停止输入 400ms 后才判断；离开输入框时格式还不对，才在下面展开错误。

## 写法

### 函数

| 名称 | 说明 |
|---|---|
| createPassword(input[data-pw]) | 强度条 + 文字；大写锁定提示 |
| createEmail(input[data-email]) | 停手 400ms 判断，对了画对勾；离开时不对才报错 |
| createSearch([data-search], { search, debounce, onSearch }) | search(q) 返回数量、数组或 Promise；超过 300ms 才转圈、至少转 500ms；debounce 默认 150ms |

### 标记

| 写法 | 说明 |
|---|---|
| [data-clearable] | 有内容时右边出清除按钮（照“代码”里几行接上） |
| [data-eye] | 显示 / 隐藏密码（照“代码”里几行接上） |

## 用法

```js
import { createPassword, createEmail, createSearch } from "satin-ui/components";

// 密码：四段强度条 + 文字，不到 8 位提示还差几位；大写锁定开着时提示
createPassword(document.querySelector("input[data-pw]"));

// 邮箱：停手 400ms 再判断，对了画对勾；离开时还不对才报错
createEmail(document.querySelector("input[data-email]"));

// 搜索：等待超过 300ms 才转圈、转了至少 500ms；search 返回结果数量（或数组）
createSearch(document.querySelector("[data-search]"), {
  search: async (q) => (await fetch("/api/search?q=" + encodeURIComponent(q)).then((r) => r.json())).length,
});

// 清除按钮（[data-clearable]）：有内容时出现，点了清空并补发一次 input
for (const w of document.querySelectorAll("[data-clearable]")) {
  const input = w.querySelector("input"), sync = () => w.classList.toggle("sn-filled", !!input.value);
  input.addEventListener("input", sync); sync();
  w.querySelector(".sn-clear").addEventListener("click", () => {
    input.value = ""; input.dispatchEvent(new Event("input", { bubbles: true })); input.focus();
  });
}
// 显示密码（[data-eye]）：切换 type，图标原地换
for (const b of document.querySelectorAll("[data-eye]")) {
  b.addEventListener("click", () => {
    const input = b.closest(".sn-ib").querySelector("input"), show = input.type === "password";
    input.type = show ? "text" : "password";
    b.querySelector(".sn-swap")?.classList.toggle("sn-on", show);
    b.setAttribute("aria-label", show ? "隐藏密码" : "显示密码");
    input.focus();
  });
}
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-cols" style="--sn-min:200px;gap:20px;align-items:start">
<div class="sn-field"><span class="sn-lbl">搜索</span>
<span class="sn-ib sn-has-pre sn-has-post sn-search" data-clearable="" data-search=""><span class="sn-pre"><span class="sn-swap"><span class="sn-a" data-i="search"></span><span class="sn-b"><span class="sn-spin-ic"></span></span></span></span><input class="sn-input" placeholder="搜索镜头、角色"><span class="sn-post"><span class="sn-res-count"></span><span class="sn-kbd">/</span><button class="sn-clear" aria-label="清除" data-i="x"></button></span></span>
<div class="sn-help">试试输入"雨"或"站台"，按 / 也能直接跳到这里。</div></div>
<div class="sn-field"><label class="sn-lbl" for="pw1">设置密码</label>
<span class="sn-ib sn-has-post"><input class="sn-input" type="password" id="pw1" placeholder="至少 8 位，字母加数字更安全" data-pw=""><span class="sn-post"><button class="sn-eye" data-eye="" aria-label="显示密码"><span class="sn-swap"><span class="sn-a" data-i="eye"></span><span class="sn-b" data-i="eye-off"></span></span></button></span></span>
<div class="sn-pw-meter" data-level="0" aria-live="polite"><i></i><i></i><i></i><i></i><span class="sn-pw-label"><span class="sn-roll"><span>
</span></span></span></div>
<div class="sn-caps"><span><span data-i="triangle-alert"></span>大写锁定已打开</span></div></div>
<div class="sn-field"><label class="sn-lbl" for="em1">通知邮箱</label>
<span class="sn-ib sn-has-post"><input class="sn-input" type="email" id="em1" placeholder="name@example.com" data-email=""><span class="sn-post"><svg class="sn-ok-mark" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7" /></svg></span></span>
<div class="sn-err"><span></span></div></div>
</div>
```

## 规则

- 搜索的转圈遵守 09 号 §7：300ms 内回来就不转，转了至少留 500ms。
- 密码强度只看长度和字符种类，不在用户还没写完时说"太弱"：8 位以内只亮灰色。
- 邮箱校验在停止输入 400ms 后才判断；离开输入框时格式还不对，才在下面展开错误。

