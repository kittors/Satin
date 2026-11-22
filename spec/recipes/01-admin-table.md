# 后台列表（侧栏 + 搜索筛选 + 表格 + 分页）

结构：左侧栏导航 → 页头（标题、数量、主按钮）→ 工具条 `.sn-filters`（搜索、筛选、次要操作）→ 表格 → 分页。
账户（头像）放页头右上角或顶栏，侧栏底部只放"设置"，不要自己在侧栏底部拼头像 + 名字 + 角色。一页只有一个主按钮（"新建"）；筛选用分段控件或芯片，不用一排下拉；表格数字列右对齐、用等宽数字；状态用 `sn-tag`。
负责人这一列用 `<sn-avatar>`（React `<Avatar>` / Vue `<SnAvatar>`）配名字，头像加 `decorative` 只当装饰，按用户 id（`seed`）稳定地挑一张预设头像；严禁拿名字里的一个字配底色当头像（检查器按 error 报）。

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
      <div><h1>全部项目</h1><p>共 128&nbsp;个项目，本周新增 6&nbsp;个</p></div>
      <div class="sn-acts"><button class="sn-btn sn-secondary" data-i="download:before">导出</button><button class="sn-btn sn-primary sn-tap" data-i="plus:before">新建项目</button></div>
    </header>
    <div class="sn-filters">
      <span class="sn-ib sn-has-pre"><span class="sn-pre" data-i="search"></span><input class="sn-input" placeholder="搜索项目或负责人" aria-label="搜索"></span>
      <sn-segmented items='["全部","进行中","已完成","失败"]' value="全部"></sn-segmented>
    </div>
    <div class="sn-tbl-wrap"><div class="sn-tbl-sc"><table class="sn-tbl" aria-label="项目列表">
      <thead><tr><th>项目</th><th class="sn-hide-phone">负责人</th><th>状态</th><th class="sn-r">镜头</th><th class="sn-r sn-hide-phone">更新</th><th></th></tr></thead>
      <tbody>
        <tr><td>雨夜车站</td><td class="sn-hide-phone"><span class="sn-name"><sn-avatar seed="u3" name="林夏" size="20" decorative></sn-avatar>林夏</span></td><td><span class="sn-tag sn-ok"><i></i>已完成</span></td><td class="sn-r sn-num">48</td><td class="sn-r sn-num sn-c-tertiary sn-hide-phone">3&nbsp;分钟前</td><td class="sn-r"><button class="sn-btn sn-ghost sn-sm sn-ibtn sn-tap" data-tip="更多" data-i="ellipsis"></button></td></tr>
        <tr><td>海边的第七天</td><td class="sn-hide-phone"><span class="sn-name"><sn-avatar seed="u4" name="周屿" size="20" decorative></sn-avatar>周屿</span></td><td><span class="sn-tag sn-run"><i></i>生成中</span></td><td class="sn-r sn-num">32</td><td class="sn-r sn-num sn-c-tertiary sn-hide-phone">1&nbsp;小时前</td><td class="sn-r"><button class="sn-btn sn-ghost sn-sm sn-ibtn sn-tap" data-tip="更多" data-i="ellipsis"></button></td></tr>
        <tr><td>长夜</td><td class="sn-hide-phone"><span class="sn-name"><sn-avatar seed="u11" name="许诺" size="20" decorative></sn-avatar>许诺</span></td><td><span class="sn-tag sn-bad"><i></i>失败</span></td><td class="sn-r sn-num">20</td><td class="sn-r sn-num sn-c-tertiary sn-hide-phone">昨天</td><td class="sn-r"><button class="sn-btn sn-ghost sn-sm sn-ibtn sn-tap" data-tip="更多" data-i="ellipsis"></button></td></tr>
      </tbody>
    </table></div></div>
    <div class="sn-row" style="justify-content: flex-end; margin-top: var(--sn-sp-16)"><sn-pager total="7" page="1"></sn-pager></div>
  </div></main>
  <nav class="sn-tabbar" aria-label="主导航">
    <a class="sn-nav-item sn-on" href="/projects" aria-current="page" data-i="layout-grid:before">项目</a>
    <a class="sn-nav-item" href="/assets" data-i="image:before">素材</a>
    <a class="sn-nav-item" href="/tasks" data-i="clock:before">任务<span class="sn-badge sn-soft">3</span></a>
    <a class="sn-nav-item" href="/team" data-i="users:before">团队</a>
    <a class="sn-nav-item" href="/settings" data-i="settings:before">设置</a>
  </nav>
</div>
```

手机上（窄于 640）：侧栏藏起来，换成最后那个底部标签栏 `.sn-tabbar`（和侧栏同样几项，名字缩成两个字；宽屏不显示），像手机应用一样在底部切换、让出底部横条。其余的骨架类自己变：页头变成吸顶的导航栏（标题居中、说明在标题下面一行小字），右边只留最后一个按钮，有图标时只显示图标（"导出"这类次要操作在手机上不出现，要的话收进"更多"菜单）；工具条里搜索框、分段控件各占一整行；表格铺满左右，加了 `.sn-hide-phone` 的列（负责人、更新时间）藏起来，剩下的列放得下，不用横着滑。
总数写在页头的说明里（"共 128 个项目"），分页旁边不再写一遍"共 128 条"。
侧栏：`enhance()` 已经接上（选中滑块、收起按钮、⌘\）；布局窄于 720（竖着的平板）自动收成图标栏，`<div class="sn-app" data-collapse-below="0">` 不收；窄于 640 有标签栏时侧栏不显示。框架里用 `createSidebar(el, { collapseBelow: 720 })`；切页时侧栏和标签栏的 `.sn-on` 一起换。
React：`<Segmented items={[...]} value={f} onChange={setF} />`、`<Pager total={7} page={page} onChange={setPage} />`；表格用 `rows.map` 生成 `<tr>`。
没有数据时 `tbody` 里放一行：`<tr><td colspan="6"><div class="sn-empty-state"><span class="sn-art" data-i="folder-open"></span><h4>还没有项目</h4><p>从一部小说或剧本开始。</p><div class="sn-acts"><button class="sn-btn sn-primary">新建项目</button></div></div></td></tr>`。
加载中：表格先显示几行骨架（`references/components/loading.md`），不要整页转圈。删除用弹窗确认并写清影响范围，成功后 `toast({ text: "已删除「长夜」", action: { label: "撤销", run } })`。
