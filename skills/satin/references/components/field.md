# 字段与错误 · FormField

> 组件 id：`field`　分组：表单

每个表单项 = 标签 + 控件 + 帮助文字 + 错误。标签在上；只标"可选"，不标必填。错误放在字段下方展开，边框变红、左右抖两下；一开始输入就收起。

## 写法

### 函数

| 名称 | 说明 |
|---|---|
| validateForm(form, 规则) | 规则 { data-f 的值: (值, 输入框) => 错误文字或假值 }；返回是否通过 |
| setFieldError(字段, 文字) | 错误在字段下方展开、输入框抖两下（aria-invalid） |
| clearFieldError(字段) | 收起错误；一开始输入也会自动收起（要整页调过 setup()） |
| fieldHTML({ label, control, help, error, id }) / inputHTML({ value, placeholder, size, type, id }) | 生成字段、输入框的标记 |

### 标记

| 写法 | 说明 |
|---|---|
| .sn-field[data-f] | 要校验的字段 |
| .sn-lbl / .sn-help / .sn-err > span | 标签 / 帮助文字 / 错误文字的位置 |

## 用法

```js
import { validateForm, busy, succeed } from "satin-ui/components";

// 每个要校验的字段写 data-f="名字"，下面放 <div class="sn-err"><span></span></div>
const form = document.querySelector("#fieldDemo"), desc = document.querySelector("#f-desc"), count = form.querySelector(".sn-count");
const rules = {
  name: (v) => !v.trim() && "请填写项目名称",
  mail: (v) => v.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) && "邮箱格式不对",
  desc: (v) => !v.trim() && "写一句话就好，方便以后找到",
};
// 字数：到上限变色
desc.addEventListener("input", () => { count.textContent = `${desc.value.length}/80`; count.classList.toggle("sn-over", desc.value.length >= 80); });
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateForm(form, rules)) return; // 有错的都标出来（错误在下方展开、输入框抖两下），焦点到第一个
  const btn = form.querySelector("button[type=submit]");
  await busy(btn, 900); // 换成你的提交请求（Promise）
  succeed(btn);
});
// 也能单独标：比如服务器说名字重复了 → setFieldError(form.querySelector('[data-f="name"]'), "已经有叫这个名字的项目了")
// 一开始输入就自动收起（setup() 装好的页面级行为）
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<form id="fieldDemo" novalidate>
<div class="sn-field" data-f="name"><label class="sn-lbl" for="f-name">项目名称</label><input class="sn-input sn-lg" id="f-name" placeholder="比如：雨夜车站"><div class="sn-err"><span></span></div></div>
<div class="sn-field" data-f="mail"><label class="sn-lbl" for="f-mail">通知邮箱 <span class="sn-opt">可选</span></label><input class="sn-input sn-lg" id="f-mail" placeholder="name@example.com"><div class="sn-help">生成完成后发邮件提醒。</div><div class="sn-err"><span></span></div></div>
<div class="sn-field" data-f="desc"><label class="sn-lbl" for="f-desc">一句话简介</label><textarea class="sn-input" id="f-desc" maxlength="80" placeholder="写给自己看的备忘"></textarea><div class="sn-help"><span>最多 80 个字。</span><span class="sn-count">0/80</span></div><div class="sn-err"><span></span></div></div>
<div class="sn-row"><button class="sn-btn sn-primary" type="submit"><span class="sn-sheen"></span><span class="sn-label"><span class="sn-spin"></span><svg class="sn-tick" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7" /></svg><span class="sn-txt">创建项目</span></span></button><span class="sn-note">什么都不填直接点，看错误怎么出现；再随便输入，看它怎么收起。</span></div>
</form>
```

