# 后台列表（三层工作台 + Chrome 弧形多页签 + 可收起侧栏 + 占满高度产品级表格）

结构：三层表面配色外壳 `.sn-app.sn-workbench` → 左侧可收起展开侧栏 `.sn-side`（顶部必配 `[data-collapse]` 收起按钮与 `⌘\` 快捷键）→ 右侧工作台外壳 `.sn-app-shell`（顶部 Chrome 弧形多页签 `.sn-btabs` + 下方圆角主工作板 `.sn-work-body`）→ 一屏工作页 `.sn-page.sn-work`：页头（标题、数量、主按钮）→ 工具条 `.sn-filters`（搜索、筛选、次要操作）→ 占满底部剩余高度的主角表格 `.sn-tbl-wrap.sn-tbl-fill`（标配复选框 + 左右固定列 + 贴底分页栏）。

**三层表面配色规范**（全部由令牌自动适配深浅色，禁止手写色值）：
- **Layer 0 壳层 / 顶部弧形页签槽**（`--sn-shell`）：浅色 `#ebebf0` / 深色 `#09090b`；
- **Layer 1 侧边栏**（`--sn-side-bg`）：浅色 `#f2f2f5` / 深色 `#0d0d10`，选中项用 `--sn-side-active`；
- **Layer 2 主内容圆角工作板**（`--sn-workspace`）：浅色 `#ffffff` / 深色 `#16161a`（左侧 1px `--sn-workspace-line` 极细分隔），与激活的 Chrome 弧形页签 **100% 同色无缝融合**；内部表格/卡片用 `--sn-raised`，浮层用 `--sn-overlay`。

**主角表格占满底部剩余高度原则**：当表格下方没有其他内容区块占位时，用 `.sn-page.sn-work` + `createTable(..., { fill: true, selectable: true, pagination: ... })`（或标记 `.sn-tbl-wrap.sn-tbl-fill`）。数据少时表格白卡自然延展到底（不拉伸行高、不画假空行、分页栏稳稳贴底不悬空）；数据多时表头吸顶、表体内部滚、分页栏贴底不动；极矮窗口自动降级整区滚动。

**后台工作台必须具备的产品级交互（不要偷懒省略）**：
1. **侧栏收起 / 展开**：`.sn-side-top` 必放 `<button class="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse data-tip="收起侧栏" data-kbd="⌘\" data-i="panel-left" aria-label="收起侧栏"></button>`；收起至 56px 时图标严格居中、分组标题化为短横线、待办徽标缩为精致圆点并自动出反色 Tooltip。
2. **多选与批量操作**：列表页默认 `selectable: true`（表头三态全选 + 行勾选），勾选后在分页栏上方浮出 `.sn-bulk` 批量操作条（批量导出 / 归档 / 删除 / 取消选择）。
3. **左右固定列**：宽表（≥ 6 列）将主键列设为 `fixed: "left"`（勾选列自动跟左固定），操作列设为 `type: "actions", fixed: "right"`，横向滚离边缘时自动浮现柔和边缘投影。
4. **贴底分页**：传 `pagination: { pageSize: 12, pageSizes: [10, 20, 50] }`，总条数、每页条数与滑动正圆页码稳稳落底。
5. **真实头像与状态**：负责人列用 `<sn-avatar>`（React `<Avatar>` / Vue `<SnAvatar>`）加 `decorative`，严禁拿姓氏首字配彩底；状态用 `.sn-tag` 中性淡灰底 + 6px 语义彩点；数字列右对齐等宽数字。

```html
<div class="sn-app sn-workbench" data-navfx="slide">
  <aside class="sn-side">
    <div class="sn-side-top">
      <span class="sn-logo"></span><b>分镜工作台</b>
      <button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" data-collapse data-tip="收起侧栏" data-kbd="⌘\" data-i="panel-left" aria-label="收起侧栏"></button>
    </div>
    <nav class="sn-side-nav" aria-label="工作台导航">
      <span class="sn-hl-bar" aria-hidden="true"></span>
      <a class="sn-on" href="/projects" data-i="layout-grid:before"><span class="sn-lbl">全部项目</span></a>
      <a href="/assets" data-i="image:before"><span class="sn-lbl">素材库</span></a>
      <a href="/tasks" data-i="clock:before"><span class="sn-lbl">任务</span><span class="sn-badge sn-soft">3</span></a>
      <a href="/team" data-i="users:before"><span class="sn-lbl">团队</span></a>
    </nav>
    <div class="sn-side-foot"><a href="/settings" data-i="settings:before"><span class="sn-lbl">设置</span></a></div>
  </aside>
  <div class="sn-app-shell">
    <div id="work-tabs"></div>
    <main class="sn-work-body"><div class="sn-page sn-work">
      <header class="sn-page-hd">
        <div><h1>全部项目</h1><p>共 128&nbsp;个项目，本周新增 6&nbsp;个</p></div>
        <div class="sn-acts"><button class="sn-btn sn-secondary" data-i="download:before">导出</button><button class="sn-btn sn-primary sn-tap" data-i="plus:before">新建项目</button></div>
      </header>
      <div class="sn-filters">
        <span class="sn-ib sn-has-pre"><span class="sn-pre" data-i="search"></span><input class="sn-input" placeholder="搜索项目或负责人" aria-label="搜索"></span>
        <sn-segmented items='["全部","进行中","已完成","失败"]' value="全部"></sn-segmented>
      </div>
      <div id="projects-table"></div>
    </div></main>
  </div>
  <nav class="sn-tabbar" aria-label="主导航">
    <a class="sn-nav-item sn-on" href="/projects" aria-current="page" data-i="layout-grid:before">项目</a>
    <a class="sn-nav-item" href="/assets" data-i="image:before">素材</a>
    <a class="sn-nav-item" href="/tasks" data-i="clock:before">任务<span class="sn-badge sn-soft">3</span></a>
    <a class="sn-nav-item" href="/team" data-i="users:before">团队</a>
    <a class="sn-nav-item" href="/settings" data-i="settings:before">设置</a>
  </nav>
</div>
<script type="module">
  import { createBrowserTabs, createTable, avatarHTML } from "satin-ui";
  createBrowserTabs(document.getElementById("work-tabs"), {
    tabs: [
      { id: "projects", title: "全部项目", icon: "layout-grid", pinned: true },
      { id: "station", title: "雨夜车站 · 分镜", icon: "film" },
      { id: "tasks", title: "渲染任务", icon: "clock", dot: "ok" },
    ],
    active: "projects",
  });
  createTable(document.getElementById("projects-table"), {
    columns: [
      { key: "name", title: "项目", fixed: "left", width: 220, sortable: true, html: (v) => `<b>${v}</b>` },
      { key: "owner", title: "负责人", width: 132, html: (v, r) => `<span class="sn-name">${avatarHTML({ seed: r.uid, name: v, size: 20, decorative: true })}${v}</span>` },
      { key: "status", title: "状态", width: 112, html: (v) => `<span class="sn-tag ${v.tone}"><i></i>${v.text}</span>` },
      { key: "shots", title: "镜头", width: 96, align: "right", sortable: true },
      { key: "res", title: "分辨率", width: 120, className: "sn-num sn-c-secondary" },
      { key: "updated", title: "更新时间", width: 120, align: "right", className: "sn-num sn-c-tertiary" },
      { key: "acts", type: "actions", fixed: "right", width: 72, html: () => `<button class="sn-btn sn-ghost sn-sm sn-ibtn sn-tap" data-tip="更多" data-i="ellipsis"></button>` },
    ],
    data: [
      { id: "p1", name: "雨夜车站", uid: "u3", owner: "林夏", status: { tone: "sn-ok", text: "已完成" }, shots: 48, res: "4K · 24fps", updated: "3 分钟前" },
      { id: "p2", name: "海边的第七天", uid: "u4", owner: "周屿", status: { tone: "sn-run", text: "生成中" }, shots: 32, res: "2K · 24fps", updated: "1 小时前" },
      { id: "p3", name: "长夜", uid: "u11", owner: "许诺", status: { tone: "sn-bad", text: "失败" }, shots: 20, res: "4K · 30fps", updated: "昨天" },
    ],
    selectable: true,
    fill: true,
    pagination: { pageSize: 12, pageSizes: [10, 20, 50] },
    label: "项目列表",
  });
</script>
```

手机上（窄于 640）：侧栏藏起来，换成最后那个底部标签栏 `.sn-tabbar`（和侧栏同样几项，名字缩成两个字；宽屏不显示），像手机应用一样在底部切换、让出底部横条；一屏锁高自动解除为自然滚动。
侧栏：`enhance()` 已经接上（选中滑块、收起按钮、⌘\）；布局窄于 720（竖着的平板）自动收成图标栏，`<div class="sn-app sn-workbench" data-collapse-below="0">` 不收。框架里用 `createSidebar(el, { collapseBelow: 720 })`。
没有数据时用 `empty: ({ filtered }) => ...` 说明原因并给下一步操作；加载中传 `loading: true`（显示骨架行，不整页转圈）；删除用弹窗确认并写清影响范围，成功后 `toast({ text: "已删除「长夜」", action: { label: "撤销", run } })`。
