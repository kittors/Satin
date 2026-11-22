# 表单向导（多步）

结构：页头（返回 + 标题）→ 步骤条 → 当前这一步的字段（一个面板）→ 底部"上一步"（左，ghost）+"下一步"（右，primary）；最后一步主按钮写具体动作（"创建项目"）。
每一步只问一类事；进入下一步前校验当前这一步，错误写在字段下面；返回上一步不丢已填的内容。不要把所有步骤做成一个超长表单，也不要每步一个弹窗。步骤条已经写了有哪几步，页头不再写一遍。

```html
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<div class="sn-page sn-narrow sn-screen">
  <header class="sn-page-hd"><a class="sn-nav-back" href="/projects" data-i="chevron-left:before">全部项目</a><div><h1>新建项目</h1></div></header>
  <div class="sn-steps" style="margin-bottom: var(--sn-sp-24)"><span class="sn-st sn-done"><span class="sn-n">1</span>基本信息</span><span class="sn-ln sn-done"><i></i></span><span class="sn-st sn-cur"><span class="sn-n">2</span>导入原文</span><span class="sn-ln"><i></i></span><span class="sn-st"><span class="sn-n">3</span>生成设置</span></div>
  <form class="sn-panel sn-grow" novalidate>
    <div class="sn-form" style="max-width: none">
      <div class="sn-field" data-f="src"><span class="sn-lbl">从哪里开始</span><sn-segmented items='["小说改编","原创剧本","空白项目"]' value="小说改编"></sn-segmented></div>
      <div class="sn-field" data-f="text"><label class="sn-lbl" for="w-text">粘贴原文</label><textarea class="sn-input" id="w-text" rows="5" placeholder="把第一集的原文贴在这里"></textarea><div class="sn-help">最多 2&nbsp;万字；更长的分几集导入。</div><div class="sn-err"><span></span></div></div>
    </div>
    <div class="sn-bottom-bar" style="justify-content: space-between">
      <button type="button" class="sn-btn sn-ghost sn-lg" data-i="arrow-left:before">上一步</button>
      <button type="submit" class="sn-btn sn-primary sn-lg">下一步</button>
    </div>
  </form>
</div>
```

外层 `.sn-page.sn-narrow.sn-screen`（整屏页面）、表单面板加 `.sn-grow`：手机上（窄于 640）页头变成吸顶的导航栏（"‹ 全部项目"在左、标题居中），表单面板铺满左右、一直撑到屏幕底部，"上一步 / 下一步"那一排（`.sn-bottom-bar`，留在 form 里面，回车也能提交）贴底、让出底部横条；宽屏上是一栏窄页面里的一个面板，按钮那一排就是面板的最后一行。
步骤条用 `stepsHTML({ steps: ["基本信息", "导入原文", "生成设置"], current: 1 })` 生成（React `<Steps steps={[...]} current={1} />`），换步时重新生成。
步骤之间换内容不要整页闪：只换面板里的字段，面板高度用 `transition: height` 不行（会卡），直接换即可；减少动态效果时也一样。
