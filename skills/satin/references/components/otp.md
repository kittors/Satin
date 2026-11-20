# 验证码 · OTP

> 组件 id：`otp`　分组：表单

6 格，输入后自动跳到下一格；退格回到上一格；粘贴一串数字会自动分到各格。填进去的数字从下面淡入上来。

## 写法

### createOtp(容器, 选项)

| 选项 / 返回 | 说明 |
|---|---|
| length | 空容器按它渲染几格（默认 6） |
| onComplete | (code) => {}：填满时调（同时在容器上发 complete、sn-complete 事件） |
| 返回 value / clear() | 现在填了的 / 清空 |

## 用法

```js
import { createOtp } from "satin-ui/components";

// 自动跳格、退格回上一格、粘贴自动分配；填进去的数字从下面淡入
const otp = createOtp(document.querySelector("[data-otp]"), {
  onComplete: (code) => verify(code), // 6 位都填满时调
});
otp.value;   // 现在填了的
otp.clear(); // 清空、焦点回第一格
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

```html
<div class="sn-otp" data-otp=""><input inputmode="numeric" maxlength="1" aria-label="第 1 位"><input inputmode="numeric" maxlength="1" aria-label="第 2 位"><input inputmode="numeric" maxlength="1" aria-label="第 3 位"><span class="sn-gap"></span><input inputmode="numeric" maxlength="1" aria-label="第 4 位"><input inputmode="numeric" maxlength="1" aria-label="第 5 位"><input inputmode="numeric" maxlength="1" aria-label="第 6 位"></div>
```

