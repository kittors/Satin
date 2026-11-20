# 设置页

结构：单栏窄页面 → 页头 → 若干组设置（左边标题和一句说明，右边字段）→ 底部保存。
立即生效的选项用开关（不需要保存按钮）；需要提交的放进表单，按钮在组的右下。不要每组一张卡片再套卡片。

```html
<div class="sn-page sn-narrow">
  <header class="sn-page-hd"><div><h1>设置</h1><p>账户、通知和默认的生成参数</p></div></header>
  <div class="sn-panel">
    <section class="sn-setting">
      <div><h3>个人资料</h3><p>团队成员会看到你的名字和头像。</p></div>
      <form class="sn-form" novalidate>
        <div class="sn-field" data-f="name"><label class="sn-lbl" for="s-name">名字</label><input class="sn-input" id="s-name" value="林夏"><div class="sn-err"><span></span></div></div>
        <div class="sn-field" data-f="mail"><label class="sn-lbl" for="s-mail">邮箱</label><input class="sn-input" id="s-mail" type="email" value="linxia@example.com"><div class="sn-help">用来登录和接收通知。</div><div class="sn-err"><span></span></div></div>
        <div class="sn-form-ft"><button class="sn-btn sn-primary" type="submit">保存修改</button></div>
      </form>
    </section>
    <section class="sn-setting">
      <div><h3>通知</h3><p>改了马上生效。</p></div>
      <div class="sn-stack sn-gap-12">
        <label class="sn-switch"><input type="checkbox" role="switch" checked><span class="sn-track"><span class="sn-knob"></span></span>生成完成时提醒我</label>
        <label class="sn-switch"><input type="checkbox" role="switch"><span class="sn-track"><span class="sn-knob"></span></span>每周发一封项目周报</label>
      </div>
    </section>
    <section class="sn-setting">
      <div><h3>默认画面比例</h3><p>新建项目时用这个比例。</p></div>
      <div><sn-segmented items='["16:9 横屏","9:16 竖屏","1:1 方形"]' value="16:9 横屏"></sn-segmented></div>
    </section>
    <section class="sn-setting">
      <div><h3>删除账户</h3><p>所有项目和素材会一起删除，不能恢复。</p></div>
      <div><button class="sn-btn sn-danger-soft">删除账户…</button></div>
    </section>
  </div>
</div>
```

校验：`validateForm(form, { name: (v) => !v.trim() && "名字不能为空", mail: (v) => !/^\S+@\S+\.\S+$/.test(v) && "邮箱格式不对" })`，错误写在字段下面。
保存：`busy(按钮, 请求)`，成功 `toast({ text: "已保存", icon: "check" })`。React 里字段用 `<Field label error><Input /></Field>`。
另一种写法（手机上、条目多时）：设置列表 `.sn-set-list > .sn-set-row`，见 `references/components/list.md`。
