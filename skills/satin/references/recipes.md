# 页面配方

先照着搭骨架，再换成自己的内容。每份都用 Satin 的骨架类和组件，不需要自己写布局和颜色。

## 后台列表（侧栏 + 搜索筛选 + 表格 + 分页）

结构：左侧栏导航 → 页头（标题、数量、主按钮）→ 工具条（搜索、筛选、次要操作）→ 表格 → 分页。
一页只有一个主按钮（"新建"）；筛选用分段控件或芯片，不用一排下拉；表格数字列右对齐、用等宽数字；状态用 `sn-tag`。

```html
<div class="sn-app">
  <aside class="sn-side">
    <div class="sn-side-top"><span class="sn-logo"></span><b>分镜工作台</b></div>
    <nav class="sn-side-nav">
      <a class="sn-on" href="/projects" data-i="layout-grid:before"><span class="sn-lbl">全部项目</span></a>
      <a href="/assets" data-i="image:before"><span class="sn-lbl">素材库</span></a>
      <a href="/tasks" data-i="clock:before"><span class="sn-lbl">任务</span><span class="sn-badge sn-soft">3</span></a>
      <a href="/team" data-i="users:before"><span class="sn-lbl">团队</span></a>
    </nav>
    <div class="sn-side-foot"><a href="/settings" data-i="settings:before"><span class="sn-lbl">设置</span></a></div>
  </aside>
  <main class="sn-app-main"><div class="sn-page sn-wide">
    <header class="sn-page-hd">
      <div><h1>全部项目</h1><p>共 128 个项目，本周新增 6 个</p></div>
      <div class="sn-acts"><button class="sn-btn sn-secondary" data-i="download:before">导出</button><button class="sn-btn sn-primary" data-i="plus:before">新建项目</button></div>
    </header>
    <div class="sn-row" style="margin-bottom: var(--sn-sp-16)">
      <span class="sn-ib sn-has-pre" style="width: 240px"><span class="sn-pre" data-i="search"></span><input class="sn-input" placeholder="搜索项目或负责人" aria-label="搜索"></span>
      <sn-segmented items='["全部","进行中","已完成","失败"]' value="全部"></sn-segmented>
    </div>
    <div class="sn-tbl-wrap"><div class="sn-tbl-sc"><table class="sn-tbl" aria-label="项目列表">
      <thead><tr><th>项目</th><th>负责人</th><th>状态</th><th class="sn-r">镜头</th><th class="sn-r">更新</th><th></th></tr></thead>
      <tbody>
        <tr><td><b>雨夜车站</b></td><td><span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:210">林</span>林夏</span></td><td><span class="sn-tag sn-ok"><i></i>已完成</span></td><td class="sn-r sn-num">48</td><td class="sn-r sn-num sn-c-tertiary">3 分钟前</td><td class="sn-r"><button class="sn-btn sn-ghost sn-sm sn-ibtn" data-tip="更多" data-i="ellipsis"></button></td></tr>
        <tr><td><b>海边的第七天</b></td><td><span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:30">周</span>周屿</span></td><td><span class="sn-tag sn-run"><i></i>生成中</span></td><td class="sn-r sn-num">32</td><td class="sn-r sn-num sn-c-tertiary">1 小时前</td><td class="sn-r"><button class="sn-btn sn-ghost sn-sm sn-ibtn" data-tip="更多" data-i="ellipsis"></button></td></tr>
        <tr><td><b>长夜</b></td><td><span class="sn-name"><span class="sn-av sn-xs" style="--sn-h:280">许</span>许诺</span></td><td><span class="sn-tag sn-bad"><i></i>失败</span></td><td class="sn-r sn-num">20</td><td class="sn-r sn-num sn-c-tertiary">昨天</td><td class="sn-r"><button class="sn-btn sn-ghost sn-sm sn-ibtn" data-tip="更多" data-i="ellipsis"></button></td></tr>
      </tbody>
    </table></div></div>
    <div class="sn-row sn-between" style="margin-top: var(--sn-sp-16)">
      <span class="sn-t-callout sn-c-tertiary">第 1–20 条，共 128 条</span>
      <sn-pager total="7" page="1"></sn-pager>
    </div>
  </div></main>
</div>
```

侧栏在手机上自动收成图标栏：`createSidebar(document.querySelector(".sn-app"), { collapseBelow: 720 })`。
React：`<Segmented items={[...]} value={f} onChange={setF} />`、`<Pager total={7} page={page} onChange={setPage} />`；表格用 `rows.map` 生成 `<tr>`。
没有数据时 `tbody` 里放一行：`<tr><td colspan="6"><div class="sn-empty-state"><span class="sn-art" data-i="folder-open"></span><h4>还没有项目</h4><p>从一部小说或剧本开始。</p><div class="sn-acts"><button class="sn-btn sn-primary">新建项目</button></div></div></td></tr>`。
加载中：表格先显示几行骨架（`references/components/loading.md`），不要整页转圈。删除用弹窗确认并写清影响范围，成功后 `toast({ text: "已删除「长夜」", action: { label: "撤销", run } })`。

## 设置页

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

## 登录 / 注册

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

密码框也可以不手写：`createPassword(空容器, { label: "密码", id: "l-pwd" })` 直接渲染整个字段（显示 / 隐藏、大写锁定提示都带着；注册页加 `meter: true` 出强度条），邮箱同理 `createEmail`；手写的标记用 `enhance()` 接上眼睛按钮；注册页要强度提示时加 `.sn-pw-meter`，标记见 `references/components/special.md`。复选框可以用 `checkHTML({ label, checked })` 生成，React 写 `<Checkbox label="30 天内保持登录" defaultChecked />`。
注册页一样的结构：名字、邮箱、密码三个字段 + "创建账号"；验证码用 `<sn-otp length="6">` / `<Otp length={6} />`。
提交：`validateForm(form, 规则)` 过了再 `busy(按钮, 请求)`；失败把服务端的原因写到对应字段下面（`setFieldError(字段, "邮箱或密码不对")`），不要弹窗。

## 仪表盘

结构：页头 → 一个面板里放 3～4 个指标 → 两栏：左边主要内容（表格 / 分布），右边最近动态。
不做"指标墙"（八九张彩色 KPI 卡片），不给每个数字配一个彩色图标；彩色只用在涨跌和状态上。没有图表组件时，用进度条做分布、用表格列数字，比花哨的图更清楚。

```html
<div class="sn-page">
  <header class="sn-page-hd">
    <div><h1>本周概览</h1><p>11 月 14 日 – 11 月 20 日</p></div>
    <div class="sn-acts"><sn-segmented items='["本周","本月","全年"]' value="本周"></sn-segmented></div>
  </header>
  <div class="sn-panel" style="margin-bottom: var(--sn-sp-24)">
    <div class="sn-cols" style="--sn-min: 160px">
      <div class="sn-stat"><span>生成的镜头</span><b>1,284</b><small class="sn-up">比上周 +12%</small></div>
      <div class="sn-stat"><span>完成的项目</span><b>36</b><small>比上周 +4</small></div>
      <div class="sn-stat"><span>平均生成时长</span><b>2 分 18 秒</b><small class="sn-down">比上周慢 9 秒</small></div>
      <div class="sn-stat"><span>本月用量</span><b>68%</b><small>还剩 3,200 次</small></div>
    </div>
  </div>
  <div class="sn-with-aside" style="--sn-aside: 340px">
    <section class="sn-panel">
      <div class="sn-panel-hd"><h2>各状态的项目</h2><a class="sn-t-callout" href="/projects">全部项目</a></div>
      <div class="sn-stack sn-gap-16">
        <div class="sn-stack sn-gap-8"><div class="sn-row sn-between"><span>已完成</span><span class="sn-num sn-c-secondary">58</span></div><div class="sn-pbar" style="--sn-p:.45"><i></i></div></div>
        <div class="sn-stack sn-gap-8"><div class="sn-row sn-between"><span>生成中</span><span class="sn-num sn-c-secondary">31</span></div><div class="sn-pbar" style="--sn-p:.24"><i></i></div></div>
        <div class="sn-stack sn-gap-8"><div class="sn-row sn-between"><span>待审核</span><span class="sn-num sn-c-secondary">27</span></div><div class="sn-pbar" style="--sn-p:.21"><i></i></div></div>
        <div class="sn-stack sn-gap-8"><div class="sn-row sn-between"><span>失败</span><span class="sn-num sn-c-secondary">12</span></div><div class="sn-pbar" style="--sn-p:.09"><i></i></div></div>
      </div>
    </section>
    <section class="sn-panel">
      <div class="sn-panel-hd"><h2>最近动态</h2></div>
      <div class="sn-stack sn-gap-12">
        <div class="sn-row sn-gap-8"><span class="sn-av sn-sm" style="--sn-h:210">林</span><div class="sn-grow"><b>林夏</b> 完成了「雨夜车站」<div class="sn-t-caption sn-c-tertiary">3 分钟前</div></div></div>
        <div class="sn-row sn-gap-8"><span class="sn-av sn-sm" style="--sn-h:30">周</span><div class="sn-grow"><b>周屿</b> 上传了 12 张素材<div class="sn-t-caption sn-c-tertiary">1 小时前</div></div></div>
      </div>
    </section>
  </div>
</div>
```

表格放在左栏时用 `.sn-panel.sn-flush` 包住 `.sn-tbl-wrap.sn-plain`（无外框的表格），不要卡片里再套一圈边框。

## AI 对话

结构：对话框占满主区高度：顶栏（助手名字、状态）→ 消息区（虚拟列表、流式输出、跳到最新）→ 底部提示词输入框（附件、用量环、发送 / 停止）。
用 `satin-ui/chat` 的 `mountChat`，不要自己写消息气泡和滚动：它已经处理了流式输出匀速放字、贴底跟随、往上翻加载历史、发送动画、减少动态效果。

```html
<div class="sn-page sn-wide" style="height: 100dvh; display: grid; grid-template-rows: auto minmax(0, 1fr)">
  <header class="sn-page-hd"><div><h1>分镜助手</h1><p>改剧本、拆镜头、写画面描述</p></div></header>
  <div id="chat" style="min-height: 0"></div>
</div>
<script type="module">
  import { setup } from "satin-ui";
  import { mountChat } from "satin-ui/chat";
  setup();
  // 空容器：mountChat 按选项填好标记。respond 返回异步迭代的文字片段（流式），或者直接返回一整段
  mountChat(document.getElementById("chat"), {
    title: "分镜助手", placeholder: "和分镜助手一起改这一集",
    async *respond(text) {
      const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ text }) });
      const reader = res.body.getReader(), dec = new TextDecoder();
      for (;;) { const { value, done } = await reader.read(); if (done) break; yield dec.decode(value); }
    },
  });
</script>
```

React / Vue：在 `useEffect` / `onMounted` 里对一个空 `<div>` 调 `mountChat`，返回的实例在卸载时不用管（容器移除后监听会跟着失效）；或者整块用纯 HTML 写在一个组件里。
只要一个输入框（不要对话列表）：`createComposer(空容器, { placeholder, onSend({ text, files }) })`（React 里同样在 effect 里调）。
消息里有 Markdown：助手回复按 Markdown 渲染（代码块、表格、公式），不用自己处理。

## 落地页

结构：顶栏 → 首屏（一句话说清做什么 + 一句副标题 + 一主一次两个按钮 + 一张真实的产品截图）→ 3 个功能点 → 一段真实的使用场景或数字 → 页脚。
不要：渐变背景、发光、玻璃拟态卡片、满屏 emoji、"赋能 / 一站式 / 释放潜能"、居中堆叠八个功能卡片、假的客户 logo 墙。
彩色只给主按钮（默认墨色）；首屏的字号用 `sn-t-display`，正文 `sn-t-body`，不要自己放大到 72px。

```html
<header class="sn-page sn-wide" style="padding-block: var(--sn-sp-16)">
  <div class="sn-row sn-between">
    <b class="sn-t-title3">分镜工作台</b>
    <nav class="sn-row sn-gap-24 sn-t-callout"><a href="#features">功能</a><a href="#pricing">价格</a><a href="/docs">文档</a></nav>
    <div class="sn-row sn-gap-8"><a class="sn-btn sn-ghost" href="/login">登录</a><a class="sn-btn sn-primary" href="/signup">免费试用</a></div>
  </div>
</header>
<main>
  <section class="sn-page sn-wide" style="padding-block: var(--sn-sp-64) var(--sn-sp-48)">
    <div class="sn-stack sn-gap-16" style="max-width: 640px">
      <h1 class="sn-t-display">把剧本变成可以拍的分镜</h1>
      <p class="sn-t-body sn-c-secondary">导入一集剧本，几分钟得到每个镜头的景别、时长和画面描述；导演改一句，后面的镜头跟着调整。</p>
      <div class="sn-row sn-gap-8"><a class="sn-btn sn-primary sn-lg" href="/signup">免费试用 14 天</a><a class="sn-btn sn-secondary sn-lg" href="/demo">看 2 分钟演示</a></div>
    </div>
    <img src="/screenshot-editor.png" alt="分镜编辑器：左边剧本，右边按镜头排好的画面" style="margin-top: var(--sn-sp-40); width: 100%; border-radius: var(--sn-r-xl); border: 1px solid var(--sn-line)">
  </section>
  <section id="features" class="sn-page sn-wide" style="padding-block: var(--sn-sp-48)">
    <div class="sn-cols sn-gap-32" style="--sn-min: 240px">
      <div class="sn-stack sn-gap-8"><span data-i="clapperboard"></span><h2 class="sn-t-title3">按镜头拆好</h2><p class="sn-t-callout sn-c-secondary">每场戏拆成镜头，标好景别、时长和机位，导出给摄影直接用。</p></div>
      <div class="sn-stack sn-gap-8"><span data-i="users"></span><h2 class="sn-t-title3">多人一起改</h2><p class="sn-t-callout sn-c-secondary">导演、编剧、美术在同一份分镜上批注，谁改了什么都留着记录。</p></div>
      <div class="sn-stack sn-gap-8"><span data-i="download"></span><h2 class="sn-t-title3">导出成片脚本</h2><p class="sn-t-callout sn-c-secondary">导出 PDF 分镜本、Excel 拍摄表，或者直接生成 30 秒的样片。</p></div>
    </div>
  </section>
</main>
<footer class="sn-page sn-wide sn-t-caption sn-c-tertiary" style="border-top: 1px solid var(--sn-line); padding-block: var(--sn-sp-24)">© 2026 分镜工作台 · <a href="/privacy">隐私</a> · <a href="/terms">条款</a></footer>
```

截图要用真实的产品界面（或用 Satin 搭一个真实的界面再截），不要用插画和渐变色块代替。功能点的图标用 Satin 的线性图标，不加彩色底。

## 移动端 H5 下单

结构：单栏 → 商品 / 订单信息 → 收货、规格、数量（字段一栏，间距 20）→ 费用明细 → 底部贴边操作栏（合计 + 主按钮）。
手机上：可点区域至少 44×44（`sn-btn sn-lg` 高 40，再加外边距；图标按钮用 `sn-lg`）；输入框字号不小于 16px 防止 iOS 放大（`sn-input sn-lg`）；
底部操作栏用 `.sn-bottom-bar`，已经避开 iPhone 底部横条；页面底部留出操作栏的高度，内容不被盖住。

```html
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<main class="sn-page sn-narrow" style="padding-bottom: calc(var(--sn-sp-80) + env(safe-area-inset-bottom))">
  <header class="sn-page-hd"><div><h1>确认订单</h1></div></header>
  <div class="sn-stack sn-gap-16">
    <section class="sn-panel">
      <div class="sn-row sn-gap-12">
        <img src="/p/lamp.jpg" alt="" width="64" height="64" style="border-radius: var(--sn-r-md); object-fit: cover">
        <div class="sn-grow"><b>折叠台灯 · 暖白</b><div class="sn-t-caption sn-c-tertiary">三档亮度 · USB-C 充电</div></div>
        <b class="sn-num">¥189.00</b>
      </div>
    </section>
    <section class="sn-panel sn-flush">
      <div class="sn-set-list" style="border: 0; border-radius: 0">
        <div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="map-pin"></span><div class="sn-tx"><b>林夏 138 0000 1234</b><span>上海市徐汇区漕溪北路 88 号 12 楼</span></div><span class="sn-end" data-i="chevron-right"></span></div>
        <div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="clock"></span><div class="sn-tx"><b>配送时间</b></div><span class="sn-val">明天 9:00–12:00</span><span class="sn-end" data-i="chevron-right"></span></div>
      </div>
    </section>
    <section class="sn-panel">
      <div class="sn-form" style="max-width: none">
        <div class="sn-field"><span class="sn-lbl">颜色</span><sn-segmented items='["暖白","冷白","木纹"]' value="暖白"></sn-segmented></div>
        <div class="sn-field"><span class="sn-lbl">数量</span><sn-stepper value="1" min="1" max="9" unit="件"></sn-stepper></div>
        <div class="sn-field"><label class="sn-lbl" for="o-note">备注 <span class="sn-opt">可选</span></label><textarea class="sn-input" id="o-note" rows="2" placeholder="比如：放门口，不用打电话"></textarea></div>
      </div>
    </section>
    <section class="sn-panel">
      <dl class="sn-kv"><dt>商品</dt><dd class="sn-num">¥189.00</dd><dt>运费</dt><dd class="sn-num">¥0.00</dd><dt>优惠</dt><dd class="sn-num sn-c-success">−¥20.00</dd></dl>
    </section>
  </div>
</main>
<div class="sn-bottom-bar" style="position: fixed; left: 0; right: 0">
  <div class="sn-grow"><span class="sn-t-caption sn-c-tertiary">合计</span> <b class="sn-t-title2 sn-num">¥169.00</b></div>
  <button class="sn-btn sn-primary sn-lg">提交订单</button>
</div>
```

提交时 `busy(按钮, 请求)`；失败用 `toast({ text: "库存不足，换个颜色试试", tone: "danger" })`，不要 `alert()`。
地址、时间的选择用底部抽屉（`openDrawer`）或选择器（`createPicker`），不要跳新页面再跳回来。

## 表单向导（多步）

结构：页头 → 步骤条 → 当前这一步的字段（一个面板）→ 底部"上一步"（左，ghost）+"下一步"（右，primary）；最后一步主按钮写具体动作（"创建项目"）。
每一步只问一类事；进入下一步前校验当前这一步，错误写在字段下面；返回上一步不丢已填的内容。不要把所有步骤做成一个超长表单，也不要每步一个弹窗。

```html
<div class="sn-page sn-narrow">
  <header class="sn-page-hd"><div><h1>新建项目</h1><p>三步：基本信息、导入原文、生成设置</p></div></header>
  <div class="sn-steps" style="margin-bottom: var(--sn-sp-24)"><span class="sn-st sn-done"><span class="sn-n">1</span>基本信息</span><span class="sn-ln sn-done"><i></i></span><span class="sn-st sn-cur"><span class="sn-n">2</span>导入原文</span><span class="sn-ln"><i></i></span><span class="sn-st"><span class="sn-n">3</span>生成设置</span></div>
  <form class="sn-panel" novalidate>
    <div class="sn-form" style="max-width: none">
      <div class="sn-field" data-f="src"><span class="sn-lbl">从哪里开始</span><sn-segmented items='["小说改编","原创剧本","空白项目"]' value="小说改编"></sn-segmented></div>
      <div class="sn-field" data-f="text"><label class="sn-lbl" for="w-text">粘贴原文</label><textarea class="sn-input" id="w-text" rows="8" placeholder="把第一集的原文贴在这里"></textarea><div class="sn-help">最多 2 万字；更长的分几集导入。</div><div class="sn-err"><span></span></div></div>
    </div>
    <div class="sn-panel-ft" style="justify-content: space-between">
      <button type="button" class="sn-btn sn-ghost" data-i="arrow-left:before">上一步</button>
      <button type="submit" class="sn-btn sn-primary">下一步</button>
    </div>
  </form>
</div>
```

步骤条用 `stepsHTML({ steps: ["基本信息", "导入原文", "生成设置"], current: 1 })` 生成（React `<Steps steps={[...]} current={1} />`），换步时重新生成。
步骤之间换内容不要整页闪：只换面板里的字段，面板高度用 `transition: height` 不行（会卡），直接换即可；减少动态效果时也一样。
