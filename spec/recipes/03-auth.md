# 登录 / 注册

结构：整屏居中一个面板 → 标题 + 一句说明 → 字段 → 撑满的主按钮 → 次要链接。
不要左右分屏放插画、不要渐变或照片背景、不要"欢迎回来！👋"。错误写在字段下面；密码框带显隐按钮；按钮在请求时用 busy。

```html
<main class="sn-auth">
  <div class="sn-panel">
    <h1>登录分镜工作台</h1>
    <p>用工作邮箱登录，团队成员会自动加入你的空间。</p>
    <form class="sn-form" style="margin-top: var(--sn-sp-24)" novalidate>
      <div class="sn-field" data-f="mail"><label class="sn-lbl" for="l-mail">邮箱</label><input class="sn-input sn-lg" id="l-mail" type="email" autocomplete="email" placeholder="name@company.com"><div class="sn-err"><span></span></div></div>
      <div class="sn-field" data-f="pwd">
        <label class="sn-lbl" for="l-pwd">密码 <a class="sn-aside" href="/forgot">忘记密码？</a></label>
        <span class="sn-ib sn-has-post"><input class="sn-input sn-lg" id="l-pwd" type="password" autocomplete="current-password"><span class="sn-post"><button type="button" class="sn-eye" data-eye aria-label="显示密码"><span class="sn-swap"><span class="sn-a" data-i="eye"></span><span class="sn-b" data-i="eye-off"></span></span></button></span></span>
        <div class="sn-err"><span></span></div>
      </div>
      <label class="sn-check"><input type="checkbox" checked><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span>30 天内保持登录</label>
      <button class="sn-btn sn-primary sn-lg" type="submit" style="width: 100%">登录</button>
    </form>
    <p class="sn-t-callout sn-c-tertiary" style="margin-top: var(--sn-sp-20); text-align: center">还没有账号？<a href="/signup">注册</a></p>
  </div>
</main>
```

密码框的显隐：`bindInputs()`（或对这个字段 `createPassword(字段)`）接上眼睛按钮；注册页要强度提示时加 `.sn-pw-meter`，标记见 `references/components/special.md`。复选框可以用 `checkHTML({ label, checked })` 生成，React 写 `<Checkbox label="30 天内保持登录" defaultChecked />`。
注册页一样的结构：名字、邮箱、密码三个字段 + "创建账号"；验证码用 `<sn-otp length="6">` / `<Otp length={6} />`。
提交：`validateForm(form, 规则)` 过了再 `busy(按钮, 请求)`；失败把服务端的原因写到对应字段下面（`setFieldError(字段, "邮箱或密码不对")`），不要弹窗。
