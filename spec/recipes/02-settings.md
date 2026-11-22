# 设置页

结构：单栏窄页面 → 页头（只有标题）→ 若干组设置（左边标题和一句说明，右边字段）→ 需要提交的那一组自己带保存按钮。
立即生效的选项用开关（不需要保存按钮）；需要提交的放进表单，按钮在组的右下。不要每组一张卡片再套卡片。说明只写标题没说的事，不要"这里是你的设置"。

```html
<div class="sn-page sn-narrow">
  <header class="sn-page-hd"><div><h1>设置</h1></div></header>
  <div class="sn-panel">
    <section class="sn-setting">
      <div><h3>个人资料</h3><p>团队成员会看到你的名字。</p></div>
      <form class="sn-form" novalidate>
        <div class="sn-field" data-f="name"><label class="sn-lbl" for="s-name">名字</label><input class="sn-input" id="s-name" value="林夏"><div class="sn-err"><span></span></div></div>
        <div class="sn-field" data-f="mail"><label class="sn-lbl" for="s-mail">邮箱</label><input class="sn-input" id="s-mail" type="email" value="linxia@example.com"><div class="sn-help">用来登录和接收通知。</div><div class="sn-err"><span></span></div></div>
        <div class="sn-form-ft"><button class="sn-btn sn-primary" type="submit">保存修改</button></div>
      </form>
    </section>
    <section class="sn-setting">
      <div><h3>通知</h3><p>发到上面的邮箱，改了马上生效。</p></div>
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
      <div><h3>导出格式</h3><p>点“导出”时默认生成的文件。</p></div>
      <div><sn-segmented items='["PDF 分镜本","Excel 拍摄表"]' value="PDF 分镜本"></sn-segmented></div>
    </section>
    <section class="sn-setting">
      <div><h3>删除账户</h3><p>所有项目和素材会一起删除，不能恢复。</p></div>
      <div><button class="sn-btn sn-danger-soft">删除账户…</button></div>
    </section>
  </div>
</div>
```

手机上（窄于 640）：页头变成吸顶的导航栏（标题居中）；面板本身不画底，每组 `.sn-setting` 是一条铺满左右的白底（一组一块，像 iOS 的分组列表，不是整页装在一张卡片里），组里标题、说明在上，字段在下。设置页在手机上通常是一个标签页的根页面，不放返回；从别的页面点进来时在标题前面加 `<a class="sn-nav-back" href="…" data-i="chevron-left:before">我的</a>`。
校验：`validateForm(form, { name: (v) => !v.trim() && "名字不能为空", mail: (v) => !/^\S+@\S+\.\S+$/.test(v) && "邮箱格式不对" })`，错误写在字段下面。
保存：`busy(按钮, 请求)`，成功 `toast({ text: "已保存", icon: "check" })`。React 里字段用 `<Field label error><Input /></Field>`。
另一种写法（手机上、条目多时）：设置列表 `.sn-set-list > .sn-set-row`，见 `references/components/list.md`。
