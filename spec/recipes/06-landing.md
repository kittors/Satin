# 落地页

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
