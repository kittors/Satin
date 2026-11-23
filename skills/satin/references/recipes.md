# 页面配方

先照着搭骨架，再换成自己的内容。每份都用 Satin 的骨架类和组件，不需要自己写布局和颜色。

## 后台列表（三层工作台 + Chrome 弧形多页签 + 可收起侧栏 + 占满高度产品级表格）

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

## 设置页

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

## 登录 / 注册

结构：整屏一个面板 → 标题 + 一句说明 → 字段 → 撑满的主按钮 → 次要链接（`.sn-auth-ft`）。
宽屏上是屏幕正中一张 400 宽的卡片；手机上（窄于 640）不是卡片：整屏铺满面板的底色（html、body 也换成这个颜色，四周不露灰），标题在上面，"还没有账号？注册"贴在屏幕底部、让出底部横条。
不要左右分屏放插画、不要渐变或照片背景、不要"欢迎回来！👋"。错误写在字段下面；密码框带显隐按钮；按钮在请求时用 busy。

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

登录页是进入应用的第一屏，手机上不放导航栏；从别的页面弹出来登录时，在面板最前面放一个关闭按钮（`<button class="sn-btn sn-ghost sn-ibtn sn-lg" data-i="x" aria-label="关闭"></button>`）。主按钮紧跟在字段下面：键盘弹出来时还看得见。
密码框也可以不手写：`createPassword(空容器, { label: "密码", id: "l-pwd" })` 直接渲染整个字段（显示 / 隐藏、大写锁定提示都带着；注册页加 `meter: true` 出强度条），邮箱同理 `createEmail`；手写的标记用 `enhance()` 接上眼睛按钮；注册页要强度提示时加 `.sn-pw-meter`，标记见 `references/components/special.md`。复选框可以用 `checkHTML({ label, checked })` 生成，React 写 `<Checkbox label="30 天内保持登录" defaultChecked />`。
注册页一样的结构：名字、邮箱、密码三个字段 + "创建账号"，底部换成"已经有账号？登录"；验证码用 `<sn-otp length="6">` / `<Otp length={6} />`。
提交：`validateForm(form, 规则)` 过了再 `busy(按钮, 请求)`；失败把服务端的原因写到对应字段下面（`setFieldError(字段, "邮箱或密码不对")`），不要弹窗。

## 数据分析仪表盘

面向「AI 影视创作与渲染集群」的真实业务数据分析工作台：从顶栏周期与业务线筛选，到带迷你火花线的 4 项核心指标面板、平滑趋势面积图、可点击联动筛选的环形状态图、可 360° 拖拽旋转的 3D 时空算力柱阵图、题材交付对比柱状图，再到实时联动过滤的项目效能明细表与团队动态流。整页零第三方图表依赖，深浅双主题与多端响应式全部开箱即用。

```html
<div class="sn-page">
  <header class="sn-page-hd">
    <div>
      <h1>渲染与创作效能</h1>
      <p id="dbRange">11&nbsp;月&nbsp;17&nbsp;日 – 11&nbsp;月&nbsp;23&nbsp;日 · 全部业务线</p>
    </div>
    <div class="sn-acts" style="flex-wrap:wrap">
      <sn-select id="dbLine" value="all" items='[{"value":"all","label":"全部业务线"},{"value":"drama","label":"剧集分镜"},{"value":"ad","label":"商业短片"},{"value":"anime","label":"二维动画"}]'></sn-select>
      <sn-segmented id="dbPeriod" items='["本周","本月","本季"]' value="本周"></sn-segmented>
      <button type="button" class="sn-btn sn-secondary sn-sm" id="dbExport" style="flex:none" data-i="download:before">导出周报</button>
    </div>
  </header>

  <div class="sn-stack sn-gap-24">
    <!-- 第 1 层：核心指标面板（4 项 KPI + NumberFlow 滚动数字 + 迷你火花线） -->
    <section class="sn-panel">
      <div class="sn-stats">
        <div class="sn-stat">
          <div class="sn-row sn-between"><span>累计生成镜头</span><small class="sn-up" id="kpiDelta0">+14.2%</small></div>
          <b class="sn-num" id="kpiVal0">1,784</b>
          <div id="kpiSpk0"></div>
        </div>
        <div class="sn-stat">
          <div class="sn-row sn-between"><span>首镜通过率</span><small class="sn-up" id="kpiDelta1">+3.8%</small></div>
          <b class="sn-num" id="kpiVal1">84.6%</b>
          <div id="kpiSpk1"></div>
        </div>
        <div class="sn-stat">
          <div class="sn-row sn-between"><span>平均单镜耗时</span><small class="sn-up" id="kpiDelta2">快 14&nbsp;秒</small></div>
          <b class="sn-num" id="kpiVal2">1&nbsp;分&nbsp;52&nbsp;秒</b>
          <div id="kpiSpk2"></div>
        </div>
        <div class="sn-stat">
          <div class="sn-row sn-between"><span>GPU&nbsp;利用率</span><small id="kpiDelta3">余量 22%</small></div>
          <b class="sn-num" id="kpiVal3">78.2%</b>
          <div id="kpiSpk3"></div>
        </div>
      </div>
    </section>

    <!-- 第 2 层：主趋势面积图 + 状态分布环形图（点击环段联动下方明细表） -->
    <div class="sn-with-aside" style="--sn-aside: 360px">
      <section class="sn-panel">
        <div class="sn-panel-hd">
          <div><h2>镜头生成与一次通过走势</h2><p>悬停查看逐日产出与采纳率，点击图例可开关对比系列</p></div>
          <span class="sn-t-caption sn-c-tertiary sn-num" id="dbRateNote">采纳率 84.6%</span>
        </div>
        <div id="dbArea"></div>
      </section>
      <section class="sn-panel">
        <div class="sn-panel-hd">
          <div><h2>项目交付状态分布</h2><p>点击环段直接筛选下方项目明细</p></div>
        </div>
        <div id="dbDonut"></div>
      </section>
    </div>

    <!-- 第 3 层：3D 时空算力柱阵图 + 题材产出分组对比柱状图 -->
    <div class="sn-with-aside" style="--sn-aside: 440px">
      <section class="sn-panel">
        <div class="sn-panel-hd">
          <div><h2>三大渲染集群时空吞吐（3D）</h2><p>拖拽 360° 观察机房峰值分布，支持等轴测 / 俯视 / 正面切换</p></div>
        </div>
        <div id="db3d"></div>
      </section>
      <section class="sn-panel">
        <div class="sn-panel-hd">
          <div><h2>各题材镜头交付对比</h2><p>点击柱组联动筛选对应题材项目</p></div>
        </div>
        <div id="dbBar"></div>
      </section>
    </div>

    <!-- 第 4 层：联动项目效能明细表 + 团队动态与异常追踪 -->
    <div class="sn-with-aside" style="--sn-aside: 340px">
      <section class="sn-panel sn-flush">
        <div class="sn-panel-hd" style="padding: var(--sn-sp-16) var(--sn-sp-20) var(--sn-sp-12)">
          <div><h2>重点项目效能明细</h2><p id="dbTblHint">全部 6&nbsp;个项目 · 支持图表联动与关键词筛选</p></div>
          <div class="sn-row sn-gap-8">
            <button type="button" class="sn-btn sn-ghost sn-sm" id="dbReset" hidden>重置筛选</button>
            <input class="sn-input sn-sm" id="dbSearch" type="search" placeholder="搜索项目或导演…" style="width: 168px">
          </div>
        </div>
        <div class="sn-tbl-wrap sn-plain">
          <table class="sn-tbl">
            <thead>
              <tr><th>项目</th><th>题材</th><th>状态</th><th class="sn-num" style="text-align:right">镜头</th><th class="sn-num" style="text-align:right">通过率</th><th class="sn-num" style="text-align:right">均耗</th></tr>
            </thead>
            <tbody id="dbRows"></tbody>
          </table>
        </div>
      </section>

      <section class="sn-panel">
        <div class="sn-panel-hd"><div><h2>实时渲染与团队动态</h2><p>最近 24&nbsp;小时关键事件</p></div></div>
        <div class="sn-stack sn-gap-16">
          <div class="sn-row sn-gap-12" style="flex-wrap:nowrap;align-items:flex-start"><sn-avatar style="flex:none" seed="u3" name="林夏" size="32" decorative></sn-avatar><div class="sn-grow">林夏完成了「雨夜车站 · 第 3 集」母带导出<div class="sn-t-caption sn-c-tertiary">3&nbsp;分钟前 · 上海集群</div></div></div>
          <div class="sn-row sn-gap-12" style="flex-wrap:nowrap;align-items:flex-start"><sn-avatar style="flex:none" seed="u4" name="周屿" size="32" decorative></sn-avatar><div class="sn-grow">周屿调优了「风起长街」超分管线，单镜缩短 18&nbsp;秒<div class="sn-t-caption sn-c-tertiary">42&nbsp;分钟前 · 杭州集群</div></div></div>
          <div class="sn-row sn-gap-12" style="flex-wrap:nowrap;align-items:flex-start"><sn-avatar style="flex:none" seed="u11" name="许诺" size="32" decorative></sn-avatar><div class="sn-grow">许诺提交「星河渡口」14&nbsp;个镜头进入审核队列<div class="sn-t-caption sn-c-tertiary">2&nbsp;小时前 · 剧集分镜</div></div></div>
          <div class="sn-row sn-gap-12" style="flex-wrap:nowrap;align-items:flex-start"><sn-avatar style="flex:none" seed="u8" name="陈默" size="32" decorative></sn-avatar><div class="sn-grow">「旧城回声」2&nbsp;个高动态镜头触发重试并已自动恢复<div class="sn-t-caption sn-c-tertiary">昨天 19:20 · 深圳集群</div></div></div>
        </div>
      </section>
    </div>
  </div>
</div>

<script type="module">
  import { injectIcons } from "satin-ui";
  import { busy, succeed, toast, createNumberFlow } from "satin-ui/components";
  import { createAreaChart, createBarChart, createDonutChart, createChart3D, createSparkline } from "satin-ui/charts";

  injectIcons();

  const DATASET = {
    "本周": {
      range: "11 月 17 日 – 11 月 23 日",
      kpis: [
        { val: 1784, delta: "+14.2%", spk: [168, 214, 196, 268, 312, 284, 342] },
        { val: 84.6, fmt: (v) => v.toFixed(1) + "%", delta: "+3.8%", spk: [79, 81, 80, 83, 85, 84, 86] },
        { text: "1 分 52 秒", delta: "快 14 秒", spk: [134, 128, 125, 119, 116, 114, 112] },
        { val: 78.2, fmt: (v) => v.toFixed(1) + "%", delta: "余量 22%", spk: [66, 72, 70, 76, 82, 79, 78] },
      ],
      area: {
        labels: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        gen: [168, 214, 196, 268, 312, 284, 342],
        pass: [134, 178, 162, 224, 266, 241, 298],
      },
      donut: [
        { label: "已完成", value: 64, color: "success" },
        { label: "生成中", value: 32, color: "blue" },
        { label: "待审核", value: 24, color: "warning" },
        { label: "失败重试", value: 8, color: "danger" },
      ],
      bar: { cur: [420, 580, 360, 290, 470], prev: [350, 490, 310, 260, 390] },
      c3d: [[72, 94, 88, 126, 148, 112], [56, 78, 108, 118, 134, 96], [42, 64, 74, 92, 106, 84]],
    },
    "本月": {
      range: "2026 年 11 月 1 日 – 11 月 23 日",
      kpis: [
        { val: 6230, delta: "+21.6%", spk: [1120, 1480, 1690, 1940] },
        { val: 86.1, fmt: (v) => v.toFixed(1) + "%", delta: "+5.1%", spk: [81, 83, 85, 87] },
        { text: "1 分 46 秒", delta: "快 22 秒", spk: [128, 118, 110, 106] },
        { val: 82.4, fmt: (v) => v.toFixed(1) + "%", delta: "余量 18%", spk: [71, 76, 80, 82] },
      ],
      area: {
        labels: ["第 1 周", "第 2 周", "第 3 周", "第 4 周"],
        gen: [1120, 1480, 1690, 1940],
        pass: [918, 1258, 1468, 1712],
      },
      donut: [
        { label: "已完成", value: 214, color: "success" },
        { label: "生成中", value: 68, color: "blue" },
        { label: "待审核", value: 49, color: "warning" },
        { label: "失败重试", value: 15, color: "danger" },
      ],
      bar: { cur: [1480, 1960, 1240, 920, 1630], prev: [1210, 1640, 1080, 810, 1390] },
      c3d: [[96, 118, 132, 154, 176, 140], [74, 98, 124, 146, 158, 122], [62, 82, 94, 116, 128, 104]],
    },
    "本季": {
      range: "2026 年 Q4（9 月 – 11 月）",
      kpis: [
        { val: 18420, delta: "+38.4%", spk: [4280, 5610, 6230, 7480] },
        { val: 87.9, fmt: (v) => v.toFixed(1) + "%", delta: "+7.4%", spk: [78, 82, 86, 88] },
        { text: "1 分 39 秒", delta: "快 35 秒", spk: [134, 120, 108, 99] },
        { val: 85.1, fmt: (v) => v.toFixed(1) + "%", delta: "余量 15%", spk: [68, 75, 81, 85] },
      ],
      area: {
        labels: ["9 月上", "9 月下", "10 月上", "10 月下", "11 月上", "11 月下"],
        gen: [2120, 2640, 3080, 3420, 3510, 3650],
        pass: [1760, 2244, 2680, 3010, 3124, 3318],
      },
      donut: [
        { label: "已完成", value: 618, color: "success" },
        { label: "生成中", value: 112, color: "blue" },
        { label: "待审核", value: 84, color: "warning" },
        { label: "失败重试", value: 26, color: "danger" },
      ],
      bar: { cur: [4120, 5640, 3480, 2640, 4540], prev: [3190, 4420, 2760, 2180, 3580] },
      c3d: [[112, 134, 148, 172, 194, 162], [88, 114, 138, 162, 178, 146], [76, 94, 112, 134, 152, 126]],
    },
  };

  const LINE_SCALE = { all: [1, "全部业务线"], drama: [0.62, "剧集分镜"], ad: [0.44, "商业短片"], anime: [0.51, "二维动画"] };
  const PROJECTS = [
    { name: "雨夜车站 · 第 3 集", owner: "林夏", line: "drama", genre: "电影感", status: "已完成", tone: "sn-ok", shots: 48, rate: "93.8%", avg: "1 分 38 秒" },
    { name: "风起长街 · 预告片", owner: "周屿", line: "ad", genre: "纪录", status: "生成中", tone: "sn-run", shots: 32, rate: "84.4%", avg: "1 分 49 秒" },
    { name: "星河渡口 · 先导集", owner: "许诺", line: "anime", genre: "动画", status: "待审核", tone: "sn-warn", shots: 64, rate: "87.5%", avg: "1 分 56 秒" },
    { name: "霓虹脉搏 · 视觉单曲", owner: "苏婉", line: "ad", genre: "MV", status: "已完成", tone: "sn-ok", shots: 28, rate: "92.9%", avg: "1 分 31 秒" },
    { name: "海雾尽头 · 第 1 集", owner: "程橙", line: "drama", genre: "短剧", status: "生成中", tone: "sn-run", shots: 56, rate: "81.2%", avg: "2 分 04 秒" },
    { name: "旧城回声 · 复原篇", owner: "陈默", line: "drama", genre: "纪录", status: "失败重试", tone: "sn-bad", shots: 19, rate: "68.4%", avg: "2 分 36 秒" },
  ];

  let period = "本周", line = "all", filterStatus = "", filterGenre = "", query = "";

  const nf0 = createNumberFlow(document.getElementById("kpiVal0"), { value: 1784 });
  const nf1 = createNumberFlow(document.getElementById("kpiVal1"), { value: 84.6, format: (v) => v.toFixed(1) + "%" });
  const nf3 = createNumberFlow(document.getElementById("kpiVal3"), { value: 78.2, format: (v) => v.toFixed(1) + "%" });
  const spks = [
    createSparkline(document.getElementById("kpiSpk0"), { values: DATASET["本周"].kpis[0].spk, color: "accent", height: 30 }),
    createSparkline(document.getElementById("kpiSpk1"), { values: DATASET["本周"].kpis[1].spk, color: "success", height: 30 }),
    createSparkline(document.getElementById("kpiSpk2"), { values: DATASET["本周"].kpis[2].spk, color: "blue", height: 30 }),
    createSparkline(document.getElementById("kpiSpk3"), { values: DATASET["本周"].kpis[3].spk, color: "violet", height: 30 }),
  ];

  const area = createAreaChart(document.getElementById("dbArea"), {
    labels: DATASET["本周"].area.labels,
    height: 244,
    unit: " 镜",
    series: [
      { name: "生成镜头", color: "accent", values: DATASET["本周"].area.gen },
      { name: "一次通过", color: "success", values: DATASET["本周"].area.pass },
    ],
  });

  const donut = createDonutChart(document.getElementById("dbDonut"), {
    size: 158,
    centerLabel: "项目数",
    unit: " 个",
    items: DATASET["本周"].donut,
    onSelect(item) { filterStatus = item ? item.label : ""; renderRows(); },
  });

  const c3d = createChart3D(document.getElementById("db3d"), {
    rows: ["上海集群", "杭州集群", "深圳集群"],
    cols: ["周一", "周二", "周三", "周四", "周五", "周六"],
    rowColors: ["blue", "violet", "success"],
    metricLabel: "渲染吞吐",
    unit: " 镜/h",
    height: 304,
    values: DATASET["本周"].c3d,
  });

  const bar = createBarChart(document.getElementById("dbBar"), {
    labels: ["纪录", "电影感", "动画", "MV", "短剧"],
    height: 256,
    unit: " 镜",
    series: [
      { name: "本期交付", color: "blue", values: DATASET["本周"].bar.cur },
      { name: "上期交付", color: "muted", values: DATASET["本周"].bar.prev },
    ],
    onSelect(label) { filterGenre = label || ""; renderRows(); },
  });

  function renderRows() {
    const q = query.trim().toLowerCase();
    const list = PROJECTS.filter((p) => (line === "all" || p.line === line) && (!filterStatus || p.status === filterStatus) && (!filterGenre || p.genre === filterGenre) && (!q || p.name.toLowerCase().includes(q) || p.owner.toLowerCase().includes(q)));
    const tb = document.getElementById("dbRows");
    tb.innerHTML = list.length ? list.map((p) => `<tr>
      <td><b>${p.name}</b><div class="sn-t-caption sn-c-tertiary">${p.owner}</div></td>
      <td>${p.genre}</td>
      <td><span class="sn-tag ${p.tone}"><i></i>${p.status}</span></td>
      <td class="sn-num" style="text-align:right">${p.shots}</td>
      <td class="sn-num" style="text-align:right">${p.rate}</td>
      <td class="sn-num sn-c-secondary" style="text-align:right">${p.avg}</td>
    </tr>`).join("") : `<tr><td colspan="6" style="text-align:center;padding:28px;color:var(--sn-label3)">当前筛选条件下暂无匹配项目</td></tr>`;
    const parts = [filterStatus && `状态：${filterStatus}`, filterGenre && `题材：${filterGenre}`, q && `搜索：${q}`].filter(Boolean);
    document.getElementById("dbTblHint").textContent = parts.length ? `已筛选 ${list.length} / ${PROJECTS.length} 个项目 · ${parts.join(" · ")}` : `全部 ${list.length} 个项目 · 支持图表联动与关键词筛选`;
    document.getElementById("dbReset").hidden = !parts.length;
  }

  function applyFilters() {
    const d = DATASET[period] || DATASET["本周"], [k, lineName] = LINE_SCALE[line] || LINE_SCALE.all;
    const sc = (arr) => arr.map((v) => Math.max(1, Math.round(v * k)));
    document.getElementById("dbRange").textContent = `${d.range} · ${lineName}`;
    nf0.set(Math.round(d.kpis[0].val * k));
    nf1.set(d.kpis[1].val);
    document.getElementById("kpiVal2").textContent = d.kpis[2].text;
    nf3.set(d.kpis[3].val);
    d.kpis.forEach((kp, i) => {
      document.getElementById("kpiDelta" + i).textContent = kp.delta;
      spks[i].update({ values: i === 0 ? sc(kp.spk) : kp.spk });
    });
    const gen = sc(d.area.gen), pass = sc(d.area.pass);
    const totalG = gen.reduce((a, b) => a + b, 0), totalP = pass.reduce((a, b) => a + b, 0);
    document.getElementById("dbRateNote").textContent = `采纳率 ${((totalP / Math.max(1, totalG)) * 100).toFixed(1)}%`;
    area.update({ labels: d.area.labels, series: [{ name: "生成镜头", color: "accent", values: gen }, { name: "一次通过", color: "success", values: pass }] });
    donut.update({ items: d.donut.map((it) => ({ ...it, value: Math.max(1, Math.round(it.value * k)) })) });
    bar.update({ series: [{ name: "本期交付", color: "blue", values: sc(d.bar.cur) }, { name: "上期交付", color: "muted", values: sc(d.bar.prev) }] });
    c3d.update({ values: d.c3d.map(sc) });
    renderRows();
  }

  document.getElementById("dbPeriod").addEventListener("sn-change", (e) => { period = e.detail; applyFilters(); });
  document.getElementById("dbLine").addEventListener("sn-change", (e) => { line = e.detail; applyFilters(); });
  document.getElementById("dbSearch").addEventListener("input", (e) => { query = e.target.value; renderRows(); });
  document.getElementById("dbReset").addEventListener("click", () => { filterStatus = ""; filterGenre = ""; query = ""; document.getElementById("dbSearch").value = ""; donut.update({ activeIndex: -1 }); bar.update({ activeIndex: -1 }); renderRows(); });
  document.getElementById("dbExport").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    await busy(btn, 720);
    succeed(btn);
    toast({ text: `已导出「${period} · ${LINE_SCALE[line][1]}」效能分析周报` });
  });

  renderRows();
</script>
```

## 业务场景与决策目标

这份落地案例不是为了堆砌图表，而是面向 **AI 影视创作与渲染平台负责人 / 制片总监** 每天早会的 3 个真实决策问题：

- **产能是否健康**：本周/本月生成的总镜头数与「首镜一次通过率」是否同步走高？如果镜头量涨了但采纳率跌了，说明模型提示词或资产库出现了返工。
- **算力瓶颈在哪里**：上海、杭州、深圳三个 GPU 渲染集群在周一至周六的吞吐热力分布是否均衡？哪一天、哪个机房出现排队积压？
- **哪些项目正在掉队**：在 128 个进行中的项目里，哪几个停在「待审核」或「失败重试」，负责人是谁，是否需要立刻介入？

> **设计核心结论**：好的数据分析页在 3 秒内让负责人看到「异常与趋势」，10 秒内通过一次点击下钻到「具体责任人与具体项目」，绝不让用户在一堆装饰性卡片里翻找答案。

## F 型四层信息架构拆解

整个页面严格遵循自上而下、从宏观到微观的 **F 型四层阅读动线**，每一层只承担单一职责，不互相抢焦点：

| 层级 | 区块与骨架类 | 解决的问题 | 关键交互与微动效 |
| :--- | :--- | :--- | :--- |
| **顶栏控制层** | `.sn-page-hd` + `.sn-acts` | 锁定全局时间窗口与业务线视角 | 业务线 `<sn-select>`、周期 `<sn-segmented>` 全局联动，导出按钮带 300ms/500ms 等待与成功态 |
| **第 1 层 · 指标层** | `.sn-panel` → `.sn-stats` | 3 秒扫读 4 个北极星指标与走势方向 | 数字仅 22px 等宽（`tabular-nums`）配 NumberFlow 局部翻滚，底部嵌 30px 迷你火花线 |
| **第 2 层 · 核心趋势与构成** | `.sn-with-aside`（左趋势 + 右环形） | 看整体走势与项目状态占比 | 面积图支持平滑 Morph 与阻尼准星；点击环形分片直接筛选下方明细表 |
| **第 3 层 · 空间热力与题材对比** | `.sn-with-aside`（左 3D 柱阵 + 右柱状） | 看「机房 × 日期」三维算力峰值与题材交付对比 | 3D 柱阵支持 360° 拖拽惯性旋转与三视角飞行；点击题材柱组同样联动明细表 |
| **第 4 层 · 行动与追踪层** | `.sn-with-aside`（左明细表 + 右动态流） | 从宏观洞察一键落到可执行的项目与负责人 | 表格用 `.sn-panel.sn-flush` + `.sn-tbl-wrap.sn-plain` 杜绝卡片套边框，动态流全用 `<sn-avatar>` |

## 图表选型与 3D 视觉引入边界

很多数据分析页显得混乱、像 AI 拼出来的模板，根源在于**乱选图表**（比如把 3 个状态画成雷达图，或把普通折线硬做成 3D 饼图导致角度畸变）。本案例严格遵守以下选型边界：

| 数据维度特征 | 选用组件 | 引入理由与克制约束 |
| :--- | :--- | :--- |
| **KPI 迷你走势** | `createSparkline` | 仅表达近 7 天/4 周的方向感，不画坐标轴与网格，保持卡片轻盈 |
| **时间序列双指标对比** | `createAreaChart` | Monotone Hermite 平滑曲线绝不过冲歪曲单调数据，切换周期时 420ms 形变插值 |
| **4 类以内状态占比** | `createDonutChart` | 环心动态联动选中分片数值与占比，悬停外扩 4px 并柔和压暗非焦点弧段 |
| **离散类目本期 vs 上期** | `createBarChart` | 35ms 交错弹簧生长，悬停聚焦组顶自动浮现精准数值，点击驱动全局筛选 |
| **双维度 × 强度热力结构** | `createChart3D` | **仅在需要同时呈现「集群 × 日期 × 吞吐高度」三维分布时引入 3D**；配有「俯视 / 正面」一键视角避免透视遮挡 |

## 单向筛选联动与状态机设计

页面所有筛选器（业务线、周期、环形图状态分片、柱状图题材组、搜索框）遵循**单一数据源（Single Source of Truth）**流转：

- **全局重算（业务线 / 周期变更）**：统一调用 `applyFilters()`，依次驱动 4 组 NumberFlow 与 Sparkline、面积图、环形图、3D 柱阵、分组柱状图执行平滑 `update()` Morph 过渡，并同步刷新页头范围说明。
- **局部下钻（图表点击 / 关键词输入）**：点击环形图「失败重试」或柱状图「纪录」时，仅更新筛选状态并调用 `renderRows()` 重绘明细表，同时自动浮现「重置筛选」幽灵按钮与状态说明栏，避免误操作迷路。
- **空状态兜底**：当组合筛选命中 0 条项目时，表格内部就地展示安静的空态说明，不折叠表头，杜绝页面高度塌陷。

## 去 AI 味设计规范对照

本落地页已通过 Satin 检查器全部静态与视觉规范核验，以下 5 处关键细节最容易区分「真实成熟产品」与「AI 模板」：

| 常见 AI 模板毛病 | 本落地案例的 Satin 规范实现 |
| :--- | :--- |
| 放 8 张大字号彩色渐变 KPI 卡片，每张左上角配一个彩色发光圆角图标 | 4 个指标合在一个 `.sn-panel` 的 `.sn-stats` 内，22px 等宽数字 + 迷你火花线，零彩色背景块 |
| 卡片里再套一层带边框和圆角的表格容器 | 左栏明细表用 `.sn-panel.sn-flush` 包裹 `.sn-tbl-wrap.sn-plain`，消除双层套框 |
| 每个状态都堆高饱和彩色底色胶囊（绿底、蓝底、黄底、红底） | 统一使用 `.sn-tag` 中性浅底，仅靠前置 6px 状态语义圆点（`sn-ok / sn-run / sn-warn / sn-bad`）区分 |
| 团队动态里用单字圆圈头像（“林”“周”），名字全部加粗 | 全量采用 `<sn-avatar seed="…" name="…" decorative>`，正文保持 400 字重、时间用三级灰 |
| 使用原生 `<select>` 下拉框与硬编码色值（切换深色主题图表发白失明） | 全量使用 Satin `<sn-select>` 与 `--sn-*` 令牌；所有 Canvas 图表监听 `data-theme` 变化即时重绘 |

## 响应式布局与 Canvas 高分屏工程要点

- **三档容器自适应**：宽屏（≥ 1200px）保持 `.sn-stats` 1×4 排布与双栏 `.sn-with-aside` 并排；平板（< 720px）`.sn-stats` 自动收成 2×2（绝不出现 3 + 1 孤儿项）；手机（< 640px）页头自动贴顶居中、周期分段撑满、面板铺满并去圆角描边，两栏图表平滑堆叠。
- **高分屏 Retina 清晰度**：`satin-ui/charts` 内部封装了 `setupCanvas` 与 `ResizeObserver`，自动按 `Math.min(2, devicePixelRatio)` 缩放像素缓冲并监听容器宽度变化重绘，在 2x/3x 屏与窄屏旋转下文字、坐标线、3D 棱线始终锐利无锯齿。
- **零空转功耗**：所有微动效（描边入场、阻尼准星、3D 拖拽惯性）仅在动画进行中申请 `requestAnimationFrame`，落定后立刻停止调度，空闲 CPU 占用为 0%。

## AI 对话

结构：对话框占满一屏：顶栏（左边会话列表、中间标题、右边新对话）→ 消息区（虚拟列表、流式输出、跳到最新）→ 底部提示词输入框（附件、用量环、发送 / 停止）。对话框的顶栏就是页面标题，外面不再放同名的页头；顶栏不写"在线"这类状态，思考、步骤、正文在消息里自己会显示。
用 `satin-ui/chat` 的 `createChat`，不要自己写消息气泡和滚动：它已经处理了流式输出匀速放字、贴底跟随、往上翻加载历史、发送动画、减少动态效果。
外面一层 `.sn-page.sn-screen`（整屏页面）：桌面上四周留白，对话填满一屏，整页不滚；手机上（窄于 640）页面没有边距，html、body 的底色跟对话一样，对话铺满整个屏幕——顶栏紧贴状态栏、输入框在底部横条上面，左右贴边，四周不露灰。

```html
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<!-- 对话框自己带顶栏（会话列表、标题、新对话）：外面不要再放一个写着同样名字的页头 -->
<div class="sn-page sn-wide sn-screen">
  <div id="chat"></div>
</div>
<script type="module">
  import { setup } from "satin-ui";
  import { createChat } from "satin-ui/chat";
  setup();
  // 空容器：createChat 按选项填好标记（顶栏、消息区、底部输入框都接好了）。respond 返回异步迭代的文字片段（流式），或者直接返回一整段
  createChat(document.getElementById("chat"), {
    title: "分镜助手", placeholder: "和分镜助手一起改这一集",
    menu: true, newChat: true, // 顶栏左边"会话列表"、右边"新对话"（单色细线图标）
    onMenu() { /* 自己接：打开会话列表（手机上用 openDrawer 从左边拉出来） */ },
    onNewChat() { /* 自己接：开一段新对话（换一个会话、清空消息） */ },
    async *respond(text) {
      const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ text }) });
      const reader = res.body.getReader(), dec = new TextDecoder();
      for (;;) { const { value, done } = await reader.read(); if (done) break; yield dec.decode(value); }
    },
  });
</script>
```

`viewport-fit=cover` 一定要写：不写的话 iPhone 上页面不延伸到状态栏和底部横条后面，上下各露一条浏览器的底色。状态栏、横条让出来的高度由对话自己加（`env(safe-area-inset-*)`），外面不要再垫内边距。
对话放在别的布局里（侧栏右边的主区、弹窗里）时，给它的容器一个高度（`flex: 1` 或者 `height: 100%`）就行，对话填满容器，不写死高度。
顶栏两侧的按钮：`menu: true` 左边出"会话列表"、`newChat: true` 右边出"新对话"，点了发 `menu` / `newChat` 事件（选项里写 `onMenu` / `onNewChat`）；手机上三栏、标题居中，按钮 40×40。不要的话不写这两项，顶栏只剩标题。
React：`import { Chat } from "satin-ui/react/chat"`，然后 `<Chat title="分镜助手" menu newChat onMenu={openList} onNewChat={startNew} respond={respond} />`，挂载、卸载都处理好了。
Vue：`import { Chat } from "satin-ui/vue/chat"`，然后 `<Chat title="分镜助手" menu new-chat @menu="openList" @new-chat="startNew" :respond="respond" />`。
自己在 `useEffect` / `onMounted` 里调 `createChat(空 div, 选项)` 也行，卸载时一定调返回值的 `destroy()`。
只要一个输入框（不要对话列表）：`createComposer(空容器, { placeholder, onSend({ text, files }) })`（React 里同样在 effect 里调）。
消息里有 Markdown：助手回复按 Markdown 渲染（代码块、表格、公式），不用自己处理。
回复直接给结果：不复述用户的话，不用"好的！""当然可以！"开头；演示用的假回复也一样。

## 落地页

结构：顶栏 → 首屏（一句话说清做什么 + 一句副标题 + 一主一次两个按钮 + 一张真实的图）→ 3 个功能点 → 一段真实的使用场景或数字 → 页脚。
不要：渐变背景、发光、玻璃拟态卡片、满屏 emoji、"赋能 / 一站式 / 释放潜能"、居中堆叠八个功能卡片、假的客户 logo 墙。
彩色只给主按钮（默认墨色）；首屏的字号用 `sn-t-display`，正文 `sn-t-body`，不要自己放大到 72px。

```html
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<header class="sn-page sn-wide" style="padding-block: var(--sn-sp-16)">
  <div class="sn-row sn-between">
    <b class="sn-t-title3">分镜工作台</b>
    <nav class="sn-row sn-gap-4 sn-hide-phone" aria-label="页面导航"><a class="sn-btn sn-ghost sn-sm" href="#features">功能</a><a class="sn-btn sn-ghost sn-sm" href="/pricing">价格</a><a class="sn-btn sn-ghost sn-sm" href="/docs">文档</a></nav>
    <div class="sn-row sn-gap-8"><a class="sn-btn sn-ghost" href="/login">登录</a><a class="sn-btn sn-primary" href="/signup">免费试用</a></div>
  </div>
</header>
<main>
  <section class="sn-page sn-wide" style="padding-block: var(--sn-sp-48) var(--sn-sp-32)">
    <div class="sn-stack sn-gap-16" style="max-width: 640px">
      <h1 class="sn-t-display">把剧本变成可以拍的分镜</h1>
      <p class="sn-t-body sn-c-secondary">导入一集剧本，几分钟得到每个镜头的景别、时长和画面描述；导演改一句，后面的镜头跟着调整。</p>
      <div class="sn-row sn-gap-12"><a class="sn-btn sn-primary sn-lg" href="/signup">免费试用 14&nbsp;天</a><a class="sn-btn sn-secondary sn-lg" href="/demo">看 2&nbsp;分钟演示</a></div>
    </div>
    <img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&h=700&q=80" alt="片场里举起的场记板" style="margin-top: var(--sn-sp-40); width: 100%; aspect-ratio: 16 / 7; object-fit: cover; border-radius: var(--sn-r-xl); border: 1px solid var(--sn-line)">
  </section>
  <section id="features" class="sn-page sn-wide" style="padding-block: var(--sn-sp-32) var(--sn-sp-64)">
    <div class="sn-cols sn-gap-32" style="--sn-min: max(200px, 30%)">
      <div class="sn-stack sn-gap-8"><span data-i="clapperboard"></span><h2 class="sn-t-title3">按镜头拆好</h2><p class="sn-t-callout sn-c-secondary">每场戏拆成镜头，标好景别、时长和机位，导出给摄影直接用。</p></div>
      <div class="sn-stack sn-gap-8"><span data-i="users"></span><h2 class="sn-t-title3">多人一起改</h2><p class="sn-t-callout sn-c-secondary">导演、编剧、美术在同一份分镜上批注，谁改了什么都留着记录。</p></div>
      <div class="sn-stack sn-gap-8"><span data-i="download"></span><h2 class="sn-t-title3">导出成片脚本</h2><p class="sn-t-callout sn-c-secondary">导出 PDF 分镜本、Excel 拍摄表，或者直接生成 30&nbsp;秒的样片。</p></div>
    </div>
  </section>
</main>
<footer class="sn-page sn-wide sn-t-caption sn-c-tertiary" style="padding-block: var(--sn-sp-24) var(--sn-sp-40)">© 2026 分镜工作台 · <a class="sn-link" href="/pricing">价格</a> · <a class="sn-link" href="/docs">文档</a> · <a class="sn-link" href="/privacy">隐私</a> · <a class="sn-link" href="/terms">条款</a></footer>
```

功能点用 `--sn-min: max(200px, 30%)`：宽屏、平板都是一行 3 个，手机一个一行，不会排成 2 + 1。
手机上（窄于 640）：顶栏只留名字和右边的"登录""免费试用"，锚点链接（`.sn-hide-phone`）藏起来——价格、文档在页脚里也有；首屏（标题、按钮、图）和功能点一栏往下排，左右留 16。页脚上面不画分隔线，靠留白和小一号的字分开。
首屏的图要真实：上线时放真实的产品截图（或用 Satin 搭一个真实的界面再截），配方里先用一张片场照片（Unsplash 外链，写好 `aspect-ratio` 免得载入时页面跳）；不要用插画、渐变色块或灰块占位。功能点的图标用 Satin 的线性图标，不加彩色底。

## 移动端 H5 下单

结构：导航栏（返回 + 标题）→ 收货地址 → 商品和规格、数量 → 配送时间、优惠券 → 备注 → 支付方式 → 费用明细 → 底部贴边操作栏（合计 + 主按钮）。
外层 `.sn-page.sn-narrow.sn-screen`（整屏页面）：手机上（窄于 640）页头变成吸顶的导航栏，各块白底铺满左右（不是四周留白的圆角卡片），`.sn-bottom-bar` 贴在屏幕底部、让出底部横条，键盘弹出时停在键盘上面，内容不会被它盖住；宽屏上同一份标记是一栏窄页面，操作栏就是内容末尾的一行。
手机上：可点区域至少 44×44（`sn-btn sn-lg` 高 40，再加外边距；图标按钮用 `sn-lg`）；输入框字号不小于 16px 防止 iOS 放大（触屏上 `sn-input` 已经是 16px）。

```html
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<main class="sn-page sn-narrow sn-screen">
  <header class="sn-page-hd"><a class="sn-nav-back" href="/cart" data-i="chevron-left:before">购物车</a><div><h1>确认订单</h1></div></header>
  <div class="sn-stack sn-gap-12">
    <section class="sn-panel sn-flush">
      <div class="sn-set-list" style="border: 0; border-radius: 0">
        <div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="map-pin"></span><div class="sn-tx"><b>林夏 138 0000 1234</b><span>上海市徐汇区漕溪北路 88&nbsp;号 12&nbsp;楼</span></div><span class="sn-end" data-i="chevron-right"></span></div>
      </div>
    </section>
    <section class="sn-panel">
      <div class="sn-row sn-gap-12">
        <img src="https://images.unsplash.com/photo-1534105615256-13940a56ff44?auto=format&fit=crop&w=160&h=160&q=80" alt="" width="64" height="64" style="border-radius: var(--sn-r-md); object-fit: cover">
        <div class="sn-grow"><b>折叠台灯</b><div class="sn-t-caption sn-c-tertiary">三档亮度 · USB-C 充电</div></div>
        <b class="sn-num">¥189.00</b>
      </div>
      <div class="sn-form" style="max-width: none; margin-top: var(--sn-sp-20)">
        <div class="sn-field"><span class="sn-lbl">颜色</span><sn-segmented items='["暖白","冷白","木纹"]' value="暖白"></sn-segmented></div>
        <div class="sn-row sn-between"><span class="sn-lbl">数量</span><sn-stepper value="1" min="1" max="9" unit="件"></sn-stepper></div>
      </div>
    </section>
    <section class="sn-panel sn-flush">
      <div class="sn-set-list" style="border: 0; border-radius: 0">
        <div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="clock"></span><div class="sn-tx"><b>配送时间</b></div><span class="sn-val">明天 9:00–12:00</span><span class="sn-end" data-i="chevron-right"></span></div>
        <div class="sn-set-row" tabindex="0"><span class="sn-ico" data-i="tag"></span><div class="sn-tx"><b>优惠券</b></div><span class="sn-val">满 150 减 20</span><span class="sn-end" data-i="chevron-right"></span></div>
      </div>
    </section>
    <section class="sn-panel">
      <div class="sn-field"><label class="sn-lbl" for="o-note">备注 <span class="sn-opt">可选</span></label><textarea class="sn-input" id="o-note" rows="2" placeholder="比如：放门口，不用打电话"></textarea></div>
    </section>
    <section class="sn-panel sn-flush">
      <div class="sn-set-list" role="radiogroup" aria-label="支付方式" style="border: 0; border-radius: 0">
        <label class="sn-set-row"><span class="sn-ico" data-i="credit-card"></span><div class="sn-tx"><b>微信支付</b></div><span class="sn-radio"><input type="radio" name="pay" checked><span class="sn-box"></span></span></label>
        <label class="sn-set-row"><span class="sn-ico" data-i="credit-card"></span><div class="sn-tx"><b>支付宝</b></div><span class="sn-radio"><input type="radio" name="pay"><span class="sn-box"></span></span></label>
      </div>
    </section>
    <section class="sn-panel">
      <div class="sn-stack sn-gap-8">
        <div class="sn-row sn-between"><span class="sn-c-secondary">商品</span><span class="sn-num">¥189.00</span></div>
        <div class="sn-row sn-between"><span class="sn-c-secondary">运费</span><span class="sn-num">¥0.00</span></div>
        <div class="sn-row sn-between"><span class="sn-c-secondary">优惠</span><span class="sn-num sn-c-success">−¥20.00</span></div>
      </div>
    </section>
  </div>
  <div class="sn-bottom-bar">
    <div class="sn-grow"><span class="sn-t-caption sn-c-tertiary">合计</span> <b class="sn-t-title2 sn-num">¥169.00</b></div>
    <button class="sn-btn sn-primary sn-lg">提交订单</button>
  </div>
</main>
```

`.sn-bottom-bar` 放在 `.sn-screen` 里面（最后一个），不要再自己写 `position: fixed` 和给页面垫底部内边距：贴底、安全区、内容不被盖住都由骨架类处理。
商品图用真实的照片（这里是 Unsplash 的外链，上线换成自己的商品图），不要灰块占位。数量用紧凑的步进器放在这一行右边，标签在左，不要拉成整行宽。
金额右对齐、用等宽数字（`sn-num`）；规格写在选择器里，商品名就不再带"· 暖白"，同一件事不说两遍。支付方式只有两三种时直接列出来单选（整行可点），不用再点进去选。
提交时 `busy(按钮, 请求)`；失败用 `toast({ text: "库存不足，换个颜色试试", tone: "danger" })`，不要 `alert()`。
地址、配送时间、优惠券的选择用底部抽屉（`openDrawer`）或选择器（`createPicker`），不要跳新页面再跳回来。

## 表单向导（多步）

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

## 404 页面

面向精密创作工具与现代 Web 应用的整页 404 方案——「镜头 404 · 光学取景器」。摒弃廉价卡通插画、彩色渐变背景与网络段子，以纯中性黑白灰工业质感构建可互动的光学取景画幅：指针移动时 6 叶片机械光圈阻尼追焦，点击光圈或按空格键触发机械快门收合、场记笔记轮换与 `NumberFlow` 镜头号滚动；下方保留直白的返回动作与 3 张高频直达入口卡，桌面、平板与手机全自适应。

```html
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<main class="sn-e404" data-nf-root>
  <div class="sn-e404-wrap">
    <section class="sn-e404-frame" data-nf-frame aria-label="404 光学取景器">
      <div class="sn-e404-hud">
        <div class="sn-e404-hud-l">
          <i class="sn-e404-rec" aria-hidden="true"></i>
          <span class="sn-e404-tag">FRAME 404</span>
          <span class="sn-e404-path">
            <code data-nf-path>/projects/rainy-station/shot-404</code>
            <button type="button" class="sn-e404-copybtn" data-nf-copy data-tip="复制路径" aria-label="复制当前路径">
              <span class="sn-swap"><span class="sn-a" data-i="copy"></span><span class="sn-b" data-i="check"></span></span>
            </button>
          </span>
        </div>
        <span class="sn-e404-coord" data-nf-coord aria-hidden="true">X +00 · Y +00</span>
      </div>

      <div class="sn-e404-stage" data-nf-stage>
        <i class="sn-e404-corner sn-tl" aria-hidden="true"></i>
        <i class="sn-e404-corner sn-tr" aria-hidden="true"></i>
        <i class="sn-e404-corner sn-bl" aria-hidden="true"></i>
        <i class="sn-e404-corner sn-br" aria-hidden="true"></i>
        <div class="sn-e404-flash" aria-hidden="true"></div>

        <div class="sn-e404-trio">
          <svg class="sn-e404-digit" viewBox="0 0 88 124" aria-hidden="true">
            <path class="sn-e404-digit-ghost" d="M55 17 L13 78 V91 H55 V113 H71 V91 H83 V77 H71 V17 Z M55 39 V77 H29 Z" transform="translate(4 4)" />
            <path class="sn-e404-digit-solid" fill-rule="evenodd" d="M55 17 L13 78 V91 H55 V113 H71 V91 H83 V77 H71 V17 Z M55 39 V77 H29 Z" />
          </svg>

          <button type="button" class="sn-e404-lens" data-nf-lens aria-label="点击对焦快门，重新拍摄当前空帧">
            <svg class="sn-e404-lens-svg" viewBox="0 0 140 140" aria-hidden="true">
              <defs>
                <clipPath id="sn-e404-iris-clip"><circle cx="70" cy="70" r="44" /></clipPath>
              </defs>
              <g class="sn-e404-dial">
                <line class="sn-e404-tick-major" x1="70" y1="6" x2="70" y2="15" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(15 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(30 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(45 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(60 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(75 70 70)" />
                <line class="sn-e404-tick-major" x1="70" y1="6" x2="70" y2="15" transform="rotate(90 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(105 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(120 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(135 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(150 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(165 70 70)" />
                <line class="sn-e404-tick-major" x1="70" y1="6" x2="70" y2="15" transform="rotate(180 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(195 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(210 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(225 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(240 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(255 70 70)" />
                <line class="sn-e404-tick-major" x1="70" y1="6" x2="70" y2="15" transform="rotate(270 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(285 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(300 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(315 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(330 70 70)" />
                <line class="sn-e404-tick" x1="70" y1="8" x2="70" y2="13" transform="rotate(345 70 70)" />
                <polygon class="sn-e404-mark" points="70,18 67,13 73,13" />
              </g>
              <g class="sn-e404-iris-wrap">
                <circle class="sn-e404-barrel" cx="70" cy="70" r="44" />
                <g clip-path="url(#sn-e404-iris-clip)">
                  <g class="sn-e404-blades">
                    <path class="sn-e404-blade" d="M58 49 H118 V18 H58 Z" />
                    <path class="sn-e404-blade-alt" d="M58 49 H118 V18 H58 Z" transform="rotate(60 70 70)" />
                    <path class="sn-e404-blade" d="M58 49 H118 V18 H58 Z" transform="rotate(120 70 70)" />
                    <path class="sn-e404-blade-alt" d="M58 49 H118 V18 H58 Z" transform="rotate(180 70 70)" />
                    <path class="sn-e404-blade" d="M58 49 H118 V18 H58 Z" transform="rotate(240 70 70)" />
                    <path class="sn-e404-blade-alt" d="M58 49 H118 V18 H58 Z" transform="rotate(300 70 70)" />
                  </g>
                </g>
                <path class="sn-e404-reticle" d="M60 65 V60 H65 M75 60 H80 V65 M80 75 V80 H75 M65 80 H60 V75" />
                <circle class="sn-e404-dot" cx="70" cy="70" r="2" />
              </g>
            </svg>
          </button>

          <svg class="sn-e404-digit" viewBox="0 0 88 124" aria-hidden="true">
            <path class="sn-e404-digit-ghost" d="M55 17 L13 78 V91 H55 V113 H71 V91 H83 V77 H71 V17 Z M55 39 V77 H29 Z" transform="translate(4 4)" />
            <path class="sn-e404-digit-solid" fill-rule="evenodd" d="M55 17 L13 78 V91 H55 V113 H71 V91 H83 V77 H71 V17 Z M55 39 V77 H29 Z" />
          </svg>
        </div>
      </div>

      <div class="sn-e404-bar">
        <span class="sn-e404-note" data-nf-note aria-live="polite">第 1 镜 · 已对焦，但这一页不在当前时间线上。</span>
        <span class="sn-e404-meta">
          <span class="sn-e404-specs">F/2.8 · 24 FPS</span>
          <span class="sn-e404-take">TAKE <span data-nf-take>01</span></span>
        </span>
      </div>
    </section>

    <div class="sn-e404-head">
      <h1>这一页不在这个镜头里</h1>
      <p>你访问的地址可能已移除、改名，或这一场戏尚未开机。</p>
    </div>

    <div class="sn-e404-acts">
      <a class="sn-btn sn-primary" href="/" data-i="house:before">回到首页</a>
      <button type="button" class="sn-btn sn-secondary" data-nf-back data-i="arrow-left:before">返回上一页</button>
      <button type="button" class="sn-btn sn-ghost" data-nf-shutter data-i="rotate-cw:before">重新对焦<kbd class="sn-kbd">Space</kbd></button>
    </div>

    <nav class="sn-e404-links" aria-label="常用入口">
      <a class="sn-card sn-bordered sn-sm sn-interactive sn-e404-link" href="/components">
        <div class="sn-e404-link-top"><span class="sn-e404-link-ic" data-i="layout-grid"></span><b>组件总览</b><span class="sn-e404-link-arr" data-i="arrow-up-right"></span></div>
        <p>64 个即用组件与 7 框架示例</p>
      </a>
      <a class="sn-card sn-bordered sn-sm sn-interactive sn-e404-link" href="/recipes">
        <div class="sn-e404-link-top"><span class="sn-e404-link-ic" data-i="rows-3"></span><b>页面配方</b><span class="sn-e404-link-arr" data-i="arrow-up-right"></span></div>
        <p>9 套完整业务骨架开箱即用</p>
      </a>
      <a class="sn-card sn-bordered sn-sm sn-interactive sn-e404-link" href="/guide">
        <div class="sn-e404-link-top"><span class="sn-e404-link-ic" data-i="book-open"></span><b>设计规范</b><span class="sn-e404-link-arr" data-i="arrow-up-right"></span></div>
        <p>令牌、动效与去 AI 味准则</p>
      </a>
    </nav>
  </div>
</main>
<script type="module">
import { createNumberFlow, copied } from "satin-ui/components";

const root = document.querySelector("[data-nf-root]");
const frame = root?.querySelector("[data-nf-frame]");
const stage = root?.querySelector("[data-nf-stage]");
const coord = root?.querySelector("[data-nf-coord]");
const noteEl = root?.querySelector("[data-nf-note]");
const takeEl = root?.querySelector("[data-nf-take]");
const pathEl = root?.querySelector("[data-nf-path]");

if (root && frame && stage) {
  const NOTES = [
    "已对焦，但这一页不在当前时间线上。",
    "切换广角复核，场记表里没有这个编号。",
    "镜面干净，只是你要找的那场戏还没开机。",
    "光线与构图正常，唯独目标地址缺席。",
    "连续空拍多次，建议直接回到有画面的一页。",
  ];
  let take = 1, rot = 0, timer = 0;
  const nf = takeEl ? createNumberFlow(takeEl, { value: 1, effect: "roll", format: (v) => String(Math.round(v)).padStart(2, "0") }) : null;

  const shoot = () => {
    take += 1;
    rot += 30;
    frame.style.setProperty("--sn-e404-rot", rot + "deg");
    frame.classList.remove("sn-shutter");
    void frame.offsetWidth;
    frame.classList.add("sn-shutter");
    clearTimeout(timer);
    timer = setTimeout(() => frame.classList.remove("sn-shutter"), 180);
    nf?.set(take);
    if (noteEl) noteEl.textContent = `第 ${take} 镜 · ${NOTES[(take - 1) % NOTES.length]}`;
  };

  root.querySelector("[data-nf-lens]")?.addEventListener("click", shoot);
  root.querySelector("[data-nf-shutter]")?.addEventListener("click", shoot);
  root.querySelector("[data-nf-back]")?.addEventListener("click", () => { if (history.length > 1) history.back(); });

  const copyBtn = root.querySelector("[data-nf-copy]");
  copyBtn?.addEventListener("click", () => {
    const txt = pathEl?.textContent?.trim() || location.pathname;
    navigator.clipboard?.writeText(txt).catch(() => {});
    copied(copyBtn);
  });

  const fmt = (n) => (n >= 0 ? "+" : "-") + String(Math.abs(Math.round(n))).padStart(2, "0");
  stage.addEventListener("pointermove", (e) => {
    const r = stage.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
    frame.style.setProperty("--sn-e404-x", (nx * 8).toFixed(1) + "px");
    frame.style.setProperty("--sn-e404-y", (ny * 8).toFixed(1) + "px");
    if (coord) coord.textContent = `X ${fmt(nx * 48)} · Y ${fmt(ny * 32)}`;
  });
  stage.addEventListener("pointerleave", () => {
    frame.style.setProperty("--sn-e404-x", "0px");
    frame.style.setProperty("--sn-e404-y", "0px");
    if (coord) coord.textContent = "X +00 · Y +00";
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || "")) {
      e.preventDefault();
      shoot();
    }
  });
}
</script>
```

## 设计思路与层次拆解

| 区域 | 构成与视觉职责 | 交互与防错要点 |
|---|---|---|
| 顶部取景标尺（`.sn-e404-hud`） | 状态圆点 + `FRAME 404` + 路径胶囊（可一键复制）+ 右侧微坐标 | 复制后图标原地切为对勾；窄屏自动隐藏右侧坐标以保单行利落 |
| 光学取景舞台（`.sn-e404-stage`） | 十字极淡参考线 + 四角光学 L 型折角 + 双层几何 `4` + 中央 6 叶片机械光圈 `0` | 指针移动时镜筒 ±8px 阻尼跟手；点击光圈或按 `Space` 触发快门叶片收合与柔和遮幅闪动 |
| 底部场记条（`.sn-e404-bar`） | 左侧单行场记状态句 + 右侧 `F/2.8 · 24 FPS` 与 `TAKE 01` | 场记区单行截断固定高度，切换文字零抖动；`TAKE` 计数走 `createNumberFlow` 纵向滚动 |
| 主信息与快捷导航 | 22/600 短标题 + ≤18 字平衡断行说明 + 主/次/轻三操作 + 3 张 `.sn-card.sn-bordered` 直达卡 | 仅「回到首页」用实心主按钮；卡片与外框平级并列，严守不嵌套卡片原则 |

## 接入业务项目的注意事项

- **真实路径替换**：在路由未命中时，把 `[data-nf-path]` 的文本填为真实 `location.pathname + location.hash`，方便用户一键复制反馈给排查人员。
- **主次出口实用优先**：快门互动只是克制的彩蛋，首屏永远一眼能看到「回到首页」「返回上一页」以及 3 个高频入口，手机端（`< 640px`）自动收敛为单列。
- **无障碍与动态偏好**：开启系统 `prefers-reduced-motion` 时，光圈旋转、防抖位移与快门遮幅自动关闭过渡，点击依然正常计数与更新场记文字（`aria-live="polite"`）。
