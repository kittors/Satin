# 登录 / 注册

居中卡片式登录与注册页，移动端自动铺满全屏并将次要入口贴底。

```html
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<main class="sn-auth">
  <div class="sn-panel">
    <h1>登录分镜工作台</h1>
    <p>用工作邮箱登录，团队成员会自动加入你的空间。</p>
    <form class="sn-form" novalidate>
      <div class="sn-field" data-f="mail"><label class="sn-lbl" for="l-mail">邮箱</label><input class="sn-input sn-lg" id="l-mail" type="email" autocomplete="email" placeholder="name@company.com"><div class="sn-err"><span></span></div></div>
      <div class="sn-field" data-f="pwd">
        <label class="sn-lbl" for="l-pwd">密码 <a class="sn-aside sn-link" href="/forgot">忘记密码？</a></label>
        <span class="sn-ib sn-has-post"><input class="sn-input sn-lg" id="l-pwd" type="password" autocomplete="current-password"><span class="sn-post"><button type="button" class="sn-eye" data-eye aria-label="显示密码"><span class="sn-swap"><span class="sn-a" data-i="eye"></span><span class="sn-b" data-i="eye-off"></span></span></button></span></span>
        <div class="sn-err"><span></span></div>
      </div>
      <label class="sn-check"><input type="checkbox" checked><span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5"/></svg><span class="sn-bar"></span></span>30&nbsp;天内保持登录</label>
      <button class="sn-btn sn-primary sn-lg" type="submit" style="width: 100%">登录</button>
    </form>
    <p class="sn-auth-ft">还没有账号？<a class="sn-link" href="/signup">注册</a></p>
  </div>
</main>
```

宽屏为屏幕居中 400px 卡片，手机上（窄于 640）自动整屏铺满面板底色、次要链接贴底避让安全区；不加左右分屏插画、渐变照片底或"欢迎回来！"套话。
登录页首屏不放导航栏，从别处弹出时在面板前加关闭按钮；主按钮紧跟字段下方确保键盘弹出时仍可见。
密码与邮箱可直接用 `createPassword` / `createEmail` 生成（支持显隐、大写锁定提示与注册强度条）；注册页验证码用 `<sn-otp length="6">` / `<Otp length={6} />`。
提交先 `validateForm(form, rules)` 再 `busy(按钮, 请求)`，服务端错误用 `setFieldError` 写在对应字段下方而不弹窗。
