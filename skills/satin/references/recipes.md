# 页面配方

先照着搭骨架，再换成自己的内容。每份都用 Satin 的骨架类和组件，不需要自己写布局和颜色。

## 后台列表

三层工作台布局：可收起侧栏、弧形多页签与占满剩余高度的数据表格。

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

## 结构与交互要点

- **三层表面令牌**：壳层与页签槽 `--sn-shell` → 侧栏 `--sn-side-bg` → 主内容圆角工作板 `--sn-workspace`（与激活页签同色无缝融合，禁止手写色值）。
- **占满剩余高度表格**：`.sn-page.sn-work` 搭配 `createTable(..., { fill: true, selectable: true, pagination })`；数据少时白卡延展到底、分页栏贴底不悬空，数据多时表头吸顶内部滚动。
- **侧栏与批量交互**：顶部 `[data-collapse]` 支持 `⌘\` 收起至 56px 图标栏；多选自动浮出 `.sn-bulk` 批量操作条；宽表主键左固定、操作右固定，内置 Satin 悬浮细滚动条且横滑不回弹。
- **多端自适应**：窄于 720px 侧栏自动收为图标栏（`data-collapse-below="0"` 可关）；窄于 640px 切换底部 `.sn-tabbar` 并解除一屏锁高。
- **状态兜底**：空态用 `empty: ({ filtered }) => ...`，加载传 `loading: true`（骨架行），删除需二次确认并附可撤销 `toast`。

## 设置页

单栏窄版设置页：按分组左右排布，即时开关免提交，表单组自带保存。

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

即时生效的选项用开关（无需保存按钮），需提交的放进表单并把保存按钮放在组右下角；不要每组卡片套卡片。
手机上（窄于 640）：页头吸顶居中，每组 `.sn-setting` 自动展开为通栏分组白块；二级进入时在标题前放 `<a class="sn-nav-back" href="…" data-i="chevron-left:before">我的</a>`。
校验用 `validateForm(form, rules)`，保存用 `busy(按钮, 请求)` 并在成功后 `toast({ text: "已保存", icon: "check" })`。
条目较多的纯移动端设置页可使用 `.sn-set-list > .sn-set-row`，见 `references/components/list.md`。

## 登录 / 注册

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

## 数据分析仪表盘

多维联动的数据分析仪表盘：指标火花线、趋势与状态图表、3D 算力分布及明细表。

```html
<div class="sn-page">
  <header class="sn-page-hd">
    <div style="min-width:0;flex:1">
      <h1>渲染与创作效能</h1>
      <p id="dbRange" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">11.17 – 11.23 · 全部业务线</p>
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
    <div class="sn-with-aside" style="--sn-aside: 288px">
      <section class="sn-panel sn-flush">
        <div class="sn-panel-hd" style="padding: var(--sn-sp-16) var(--sn-sp-20) var(--sn-sp-12)">
          <div style="min-width:0;flex:1"><h2>重点项目效能明细</h2><p id="dbTblHint" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">全部 6&nbsp;个项目 · 支持图表联动与关键词筛选</p></div>
          <div class="sn-row sn-gap-8" style="flex:none">
            <button type="button" class="sn-btn sn-ghost sn-sm" id="dbReset" hidden>重置筛选</button>
            <input class="sn-input sn-sm" id="dbSearch" type="search" placeholder="搜索项目或导演…" style="width: 156px">
          </div>
        </div>
        <div class="sn-tbl-wrap sn-plain" style="min-height: 320px">
          <div class="sn-tbl-sc" id="dbTblSc">
            <table class="sn-tbl">
              <thead>
                <tr><th>项目</th><th>题材</th><th>状态</th><th class="sn-num" style="text-align:right">镜头</th><th class="sn-num" style="text-align:right">通过率</th><th class="sn-num" style="text-align:right">均耗时</th></tr>
              </thead>
              <tbody id="dbRows"></tbody>
            </table>
          </div>
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
  import { busy, succeed, toast, createNumberFlow, createScrollArea } from "satin-ui/components";
  import { createAreaChart, createBarChart, createDonutChart, createChart3D, createSparkline } from "satin-ui/charts";

  injectIcons();
  createScrollArea(document.getElementById("dbTblSc"), { fade: "none", overscroll: "auto" });

  const DATASET = {
    "本周": {
      range: "11.17 – 11.23",
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
      range: "11.01 – 11.23",
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
      range: "2026 Q4（9 – 11 月）",
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
    { name: "雨夜车站 · 第 3 集", owner: "林夏", line: "drama", genre: "电影感", status: "已完成", tone: "sn-ok", shots: 48, rate: "93.8%", avg: "1分38秒" },
    { name: "风起长街 · 预告片", owner: "周屿", line: "ad", genre: "纪录", status: "生成中", tone: "sn-run", shots: 32, rate: "84.4%", avg: "1分49秒" },
    { name: "星河渡口 · 先导集", owner: "许诺", line: "anime", genre: "动画", status: "待审核", tone: "sn-warn", shots: 64, rate: "87.5%", avg: "1分56秒" },
    { name: "霓虹脉搏 · 视觉单曲", owner: "苏婉", line: "ad", genre: "MV", status: "已完成", tone: "sn-ok", shots: 28, rate: "92.9%", avg: "1分31秒" },
    { name: "海雾尽头 · 第 1 集", owner: "程橙", line: "drama", genre: "短剧", status: "生成中", tone: "sn-run", shots: 56, rate: "81.2%", avg: "2分04秒" },
    { name: "旧城回声 · 复原篇", owner: "陈默", line: "drama", genre: "纪录", status: "失败重试", tone: "sn-bad", shots: 19, rate: "68.4%", avg: "2分36秒" },
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

## 结构与联动要点

| 层级 | 区块与组件 | 作用与关键交互 |
| :--- | :--- | :--- |
| **顶栏筛选** | `.sn-page-hd` + `<sn-select>` / `<sn-segmented>` | 切换业务线与周期时全局驱动所有图表平滑 Morph，单行锁定防页头跳动 |
| **核心指标** | `.sn-panel` → `.sn-stats` + `createNumberFlow` + `createSparkline` | 4 项关键指标合并一张面板，22px 等宽数字配迷你趋势线，零彩色发光卡 |
| **趋势与状态** | `createAreaChart` + `createDonutChart` | 面积图支持图例开关与阻尼准星；点击环形分片直接筛选下方明细表 |
| **3D 与对比** | `createChart3D` + `createBarChart` | 3D 柱阵仅用于「集群 × 日期 × 吞吐」三维分布，支持拖拽与视角切换；柱组点击同样联动明细表 |
| **明细与动态** | `.sn-panel.sn-flush` → `.sn-tbl-wrap.sn-plain` + `<sn-avatar>` | 表格无双层套框、内置 Satin 滚动条与零回弹；动态流统一使用预设头像组件 |

- **单向状态流**：业务线 / 周期变更统一调用 `applyFilters()` 全局平滑重绘；环形图 / 柱状图点击与关键词输入局部筛选明细表，命中 0 条时就地显示安静空态且不塌陷高度。
- **响应式与高分屏**：`satin-ui/charts` 自动按 `Math.min(2, devicePixelRatio)` 渲染并监听深浅主题实时重绘；空闲时零 `requestAnimationFrame` 功耗。

## AI 对话

全屏 AI 对话界面：顶栏会话切换、流式消息区与底部提示词输入框。

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

用 `satin-ui/chat` 的 `createChat`（React `<Chat>` / Vue `<SnChat>`）自动处理匀速流式输出、贴底跟随、历史分页、Markdown/公式渲染与安全区留白，无需手写气泡和滚动。
外层 `.sn-page.sn-screen` + `viewport-fit=cover`：桌面四周留白填满一屏，手机自动贴边铺满全屏；嵌入侧栏主区或弹窗时只给容器 `flex: 1` 或 `height: 100%`。
顶栏自带标题、左侧会话菜单（`menu: true`）与右侧新对话（`newChat: true`），外面不再重复放同名页头。
只需底部输入框时可用 `createComposer(el, { placeholder, onSend })`。

## 落地页

克制清晰的产品落地页：一句话价值主张、真实实景图与三列核心特性。

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

功能点用 `--sn-min: max(200px, 30%)` 保证桌面一行三列、手机自动单列，不出现 2 + 1 孤儿项；首屏标题用 `sn-t-display`，不手写超大字号、不堆渐变发光与假客户墙。
手机上（窄于 640）：顶栏自动隐藏中间锚点（`.sn-hide-phone`）只留品牌与登录/试用按钮，页脚靠留白和小一号字自然分隔。
首屏配图使用真实产品截图或实景照片并固定 `aspect-ratio` 防止加载跳动，特性图标统一采用 Satin 细线单色图标不加彩色底盒。

## 移动端 H5 下单

舒展留白的移动端结算页：三张白卡片承托收货、商品与摘要，底部操作栏固定。

```html
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<style>
.sn-ord-addr { display: flex; align-items: center; gap: var(--sn-sp-12); padding: var(--sn-sp-16); cursor: pointer; }
.sn-ord-addr-tx { flex: 1; min-width: 0; display: grid; gap: var(--sn-sp-4); }
.sn-ord-addr-hd { display: flex; align-items: baseline; gap: var(--sn-sp-8); }
.sn-ord-addr-hd b { font: 600 calc(15px * var(--sn-font-scale, 1))/calc(22px * var(--sn-font-scale, 1)) var(--sn-sans); }
.sn-ord-addr-hd span { font: 400 calc(13px * var(--sn-font-scale, 1))/calc(18px * var(--sn-font-scale, 1)) var(--sn-sans); color: var(--sn-label3); font-variant-numeric: tabular-nums; }
.sn-ord-addr-tx p { margin: 0; font: 400 calc(13px * var(--sn-font-scale, 1))/calc(18px * var(--sn-font-scale, 1)) var(--sn-sans); color: var(--sn-label2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sn-ord-hero { display: block; width: 100%; height: 148px; border-radius: var(--sn-r-lg); object-fit: cover; background: var(--sn-fill-subtle); }
.sn-ord-prod { display: grid; gap: var(--sn-sp-16); }
.sn-ord-prod-hd { display: flex; align-items: baseline; justify-content: space-between; gap: var(--sn-sp-12); }
.sn-ord-prod-hd b { font: 600 calc(17px * var(--sn-font-scale, 1))/calc(24px * var(--sn-font-scale, 1)) var(--sn-sans); letter-spacing: -.01em; }
.sn-ord-prod-sub { margin: var(--sn-sp-2) 0 0; font: 400 calc(13px * var(--sn-font-scale, 1))/calc(18px * var(--sn-font-scale, 1)) var(--sn-sans); color: var(--sn-label3); }
.sn-ord-ctrl { display: flex; align-items: center; justify-content: space-between; gap: var(--sn-sp-12); padding-top: var(--sn-sp-12); box-shadow: inset 0 1px 0 color-mix(in srgb, var(--sn-line) 70%, transparent); }
.sn-ord-kv { display: flex; align-items: center; justify-content: space-between; gap: var(--sn-sp-12); min-height: 50px; padding: var(--sn-sp-12) var(--sn-sp-16); cursor: pointer; }
.sn-ord-kv + .sn-ord-kv { box-shadow: inset 0 1px 0 color-mix(in srgb, var(--sn-line) 70%, transparent); }
.sn-ord-kv > span:first-child { font: 400 calc(14px * var(--sn-font-scale, 1))/calc(20px * var(--sn-font-scale, 1)) var(--sn-sans); color: var(--sn-label2); }
.sn-ord-kv-r { display: inline-flex; align-items: center; gap: var(--sn-sp-4); font: 500 calc(14px * var(--sn-font-scale, 1))/calc(20px * var(--sn-font-scale, 1)) var(--sn-sans); color: var(--sn-label); }
.sn-ord-kv-r .sn-ic { width: 15px; height: 15px; color: var(--sn-label3); }
.sn-ord-bar-meta { display: grid; gap: var(--sn-sp-2); }
.sn-ord-bar-meta small { font: 400 calc(11px * var(--sn-font-scale, 1))/1 var(--sn-sans); color: var(--sn-label3); }
</style>
<main class="sn-page sn-narrow sn-screen" data-order-root>
  <header class="sn-page-hd">
    <a class="sn-nav-back sn-nav-circle" href="/cart" aria-label="返回购物车" data-i="arrow-left"></a>
    <div><h1>确认订单</h1></div>
  </header>

  <div class="sn-stack sn-gap-16">
    <section class="sn-panel sn-flush">
      <div class="sn-ord-addr" tabindex="0" role="button" data-ord-addr>
        <div class="sn-ord-addr-tx">
          <div class="sn-ord-addr-hd"><b>林夏</b><span>138 0000 1234</span></div>
          <p>上海市徐汇区漕溪北路 88&nbsp;号 12&nbsp;楼</p>
        </div>
        <span class="sn-end" data-i="chevron-right" style="color: var(--sn-label3)"></span>
      </div>
    </section>

    <section class="sn-panel sn-ord-prod">
      <img class="sn-ord-hero" src="https://images.unsplash.com/photo-1534105615256-13940a56ff44?auto=format&fit=crop&w=720&h=360&q=85" alt="折叠台灯" width="720" height="360">
      <div>
        <div class="sn-ord-prod-hd">
          <b>折叠台灯</b>
          <b class="sn-num" data-ord-unit>¥189</b>
        </div>
        <p class="sn-ord-prod-sub" data-ord-spec>暖白 · 三档调光 · USB-C 充电</p>
      </div>
      <div class="sn-ord-ctrl">
        <div class="sn-row sn-gap-8" role="radiogroup" aria-label="选择颜色" data-ord-colors>
          <button type="button" class="sn-chip sn-on" aria-checked="true" role="radio" data-color="暖白">暖白</button>
          <button type="button" class="sn-chip" aria-checked="false" role="radio" data-color="冷白">冷白</button>
          <button type="button" class="sn-chip" aria-checked="false" role="radio" data-color="胡桃木">胡桃木</button>
        </div>
        <sn-stepper value="1" min="1" max="9" data-ord-qty></sn-stepper>
      </div>
    </section>

    <section class="sn-panel sn-flush">
      <div class="sn-ord-kv" tabindex="0" role="button" data-ord-ship>
        <span>配送</span>
        <span class="sn-ord-kv-r">明天上午 · 免运费<span data-i="chevron-right"></span></span>
      </div>
      <div class="sn-ord-kv" tabindex="0" role="button" data-ord-coupon>
        <span>优惠</span>
        <span class="sn-ord-kv-r sn-num sn-c-success">−¥20<span data-i="chevron-right"></span></span>
      </div>
      <div class="sn-ord-kv" tabindex="0" role="button" data-ord-pay>
        <span>支付方式</span>
        <span class="sn-ord-kv-r"><span data-ord-pay-val>微信支付</span><span data-i="chevron-right"></span></span>
      </div>
    </section>
  </div>

  <div class="sn-bottom-bar">
    <div class="sn-grow sn-ord-bar-meta">
      <small>应付</small>
      <b class="sn-t-title1 sn-num" data-ord-total>¥169</b>
    </div>
    <button type="button" class="sn-btn sn-primary sn-lg" data-ord-submit>立即支付</button>
  </div>
</main>
<script type="module">
import { busy, toast } from "satin-ui/components";

const root = document.querySelector("[data-order-root]");
if (root) {
  const UNIT = 189, OFF = 20;
  const totEl = root.querySelector("[data-ord-total]");
  const unitEl = root.querySelector("[data-ord-unit]");
  const specEl = root.querySelector("[data-ord-spec]");
  const qtyEl = root.querySelector("[data-ord-qty]");
  const sync = () => {
    const q = Math.max(1, Number(qtyEl?.getAttribute("value") || qtyEl?.value || 1));
    const sub = UNIT * q;
    if (unitEl) unitEl.textContent = "¥" + sub;
    if (totEl) totEl.textContent = "¥" + Math.max(0, sub - OFF);
  };
  qtyEl?.addEventListener("change", sync);
  qtyEl?.addEventListener("input", sync);

  const colors = root.querySelector("[data-ord-colors]");
  colors?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-color]");
    if (!btn) return;
    for (const b of colors.querySelectorAll("button[data-color]")) {
      const on = b === btn;
      b.classList.toggle("sn-on", on);
      b.setAttribute("aria-checked", String(on));
    }
    if (specEl) specEl.textContent = btn.dataset.color + " · 三档调光 · USB-C 充电";
  });

  const payRow = root.querySelector("[data-ord-pay]");
  const payVal = root.querySelector("[data-ord-pay-val]");
  payRow?.addEventListener("click", () => {
    if (!payVal) return;
    payVal.textContent = payVal.textContent === "微信支付" ? "支付宝" : "微信支付";
    toast({ text: "已切换至" + payVal.textContent, tone: "info" });
  });

  const submitBtn = root.querySelector("[data-ord-submit]");
  submitBtn?.addEventListener("click", () => {
    busy(submitBtn, new Promise((r) => setTimeout(r, 600)).then(() => {
      toast({ text: "订单已创建，正在拉起支付", tone: "success" });
    }));
  });
}
</script>
```

## 移动端 UI 设计要点（反 AI 味规范）

- **留白舒展，克制信息密度**（`mobile-breathing`）：不把十余项表单塞满一屏，只突出一个视觉主角（大图商品卡）与精炼的核心区块，组间留出 16px 呼吸间距。
- **拒绝行前灰底小方盒装饰图标**（`no-icon-box`）：「配送」「优惠」「支付方式」与收货人地址靠清晰中文与字号层次即可一目了然，不强凑时钟、标签、铅笔等装饰图标，更不套浅灰圆角方盒。
- **圆形返回按钮与原生安全区**：顶栏采用 38px 圆形柔底箭头返回，底栏饱满圆角主按钮留足底部安全区，内容从不被截断。

## 表单向导（多步）

分步表单向导：顶部步骤进度、单面板聚焦当前步、底部固定上/下一步操作。

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

每步只聚焦一类信息，进入下一步前校验当前步并保留返回状态，最后一步主按钮写具体动作（如"创建项目"）。
外层 `.sn-page.sn-narrow.sn-screen` 配表单 `.sn-grow`：手机上页头吸顶居中、面板铺满屏高、`.sn-bottom-bar` 稳稳贴底并保留在 `<form>` 内支持回车提交。
步骤条可用 `stepsHTML({ steps, current })` / `<Steps>` 生成，切换步骤直接替换面板内字段，不对高度做卡顿过渡。

## 404 页面

极简整页 404：互动机械光圈视觉雕塑、一句清晰提示与首页/返回双按钮。

```html
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<main class="sn-e404" data-nf-root>
  <div class="sn-e404-wrap">
    <div class="sn-e404-trio" aria-label="404">
      <svg class="sn-e404-digit" viewBox="0 0 88 124" aria-hidden="true">
        <path class="sn-e404-digit-solid" fill-rule="evenodd" d="M55 17 L13 78 V91 H55 V113 H71 V91 H83 V77 H71 V17 Z M55 39 V77 H29 Z" />
      </svg>

      <button type="button" class="sn-e404-lens" data-nf-lens aria-label="点击触发光圈快门">
        <svg class="sn-e404-lens-svg" viewBox="0 0 140 140" aria-hidden="true">
          <defs>
            <clipPath id="sn-e404-iris-clip"><circle cx="70" cy="70" r="42" /></clipPath>
          </defs>
          <g class="sn-e404-dial">
            <line class="sn-e404-tick-major" x1="70" y1="8" x2="70" y2="15" />
            <line class="sn-e404-tick" x1="70" y1="10" x2="70" y2="14" transform="rotate(30 70 70)" />
            <line class="sn-e404-tick" x1="70" y1="10" x2="70" y2="14" transform="rotate(60 70 70)" />
            <line class="sn-e404-tick-major" x1="70" y1="8" x2="70" y2="15" transform="rotate(90 70 70)" />
            <line class="sn-e404-tick" x1="70" y1="10" x2="70" y2="14" transform="rotate(120 70 70)" />
            <line class="sn-e404-tick" x1="70" y1="10" x2="70" y2="14" transform="rotate(150 70 70)" />
            <line class="sn-e404-tick-major" x1="70" y1="8" x2="70" y2="15" transform="rotate(180 70 70)" />
            <line class="sn-e404-tick" x1="70" y1="10" x2="70" y2="14" transform="rotate(210 70 70)" />
            <line class="sn-e404-tick" x1="70" y1="10" x2="70" y2="14" transform="rotate(240 70 70)" />
            <line class="sn-e404-tick-major" x1="70" y1="8" x2="70" y2="15" transform="rotate(270 70 70)" />
            <line class="sn-e404-tick" x1="70" y1="10" x2="70" y2="14" transform="rotate(300 70 70)" />
            <line class="sn-e404-tick" x1="70" y1="10" x2="70" y2="14" transform="rotate(330 70 70)" />
          </g>
          <g class="sn-e404-iris-wrap">
            <circle class="sn-e404-barrel" cx="70" cy="70" r="42" />
            <g clip-path="url(#sn-e404-iris-clip)">
              <g class="sn-e404-blades">
                <path class="sn-e404-blade" d="M58 51 H118 V18 H58 Z" />
                <path class="sn-e404-blade-alt" d="M58 51 H118 V18 H58 Z" transform="rotate(60 70 70)" />
                <path class="sn-e404-blade" d="M58 51 H118 V18 H58 Z" transform="rotate(120 70 70)" />
                <path class="sn-e404-blade-alt" d="M58 51 H118 V18 H58 Z" transform="rotate(180 70 70)" />
                <path class="sn-e404-blade" d="M58 51 H118 V18 H58 Z" transform="rotate(240 70 70)" />
                <path class="sn-e404-blade-alt" d="M58 51 H118 V18 H58 Z" transform="rotate(300 70 70)" />
              </g>
            </g>
            <circle class="sn-e404-dot" cx="70" cy="70" r="2.2" />
          </g>
        </svg>
      </button>

      <svg class="sn-e404-digit" viewBox="0 0 88 124" aria-hidden="true">
        <path class="sn-e404-digit-solid" fill-rule="evenodd" d="M55 17 L13 78 V91 H55 V113 H71 V91 H83 V77 H71 V17 Z M55 39 V77 H29 Z" />
      </svg>
    </div>

    <div class="sn-e404-head">
      <h1>这一页不在镜头里</h1>
      <p>你访问的地址可能已移动或失效。</p>
    </div>

    <div class="sn-e404-acts">
      <a class="sn-btn sn-primary" href="/">回到首页</a>
      <button type="button" class="sn-btn sn-secondary" data-nf-back>返回上一页</button>
    </div>
  </div>
</main>
<script type="module">
const root = document.querySelector("[data-nf-root]");
if (root) {
  let rot = 0, timer = 0;
  const shoot = () => {
    rot += 30;
    root.style.setProperty("--sn-e404-rot", rot + "deg");
    root.classList.remove("sn-shutter");
    void root.offsetWidth;
    root.classList.add("sn-shutter");
    clearTimeout(timer);
    timer = setTimeout(() => root.classList.remove("sn-shutter"), 180);
  };

  root.querySelector("[data-nf-lens]")?.addEventListener("click", shoot);
  root.querySelector("[data-nf-back]")?.addEventListener("click", () => { if (history.length > 1) history.back(); });

  root.addEventListener("pointermove", (e) => {
    const r = root.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
    root.style.setProperty("--sn-e404-x", (nx * 5).toFixed(1) + "px");
    root.style.setProperty("--sn-e404-y", (ny * 5).toFixed(1) + "px");
  });
  root.addEventListener("pointerleave", () => {
    root.style.setProperty("--sn-e404-x", "0px");
    root.style.setProperty("--sn-e404-y", "0px");
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

## 设计思路

- **极简三层结构**：页面居中留出充裕呼吸空间，只呈现 `4 [光圈 0] 4` 主符号、一句主副文案与两颗胶囊操作按钮，绝不堆砌状态栏、路径参数与多余卡片墙。
- **藏巧于简的光学交互**：静态时克制如几何字体雕塑；指针移动时内部 6 叶片机械光圈作 `±5px` 轻柔追焦，点击光圈或按空格键触发一次利落的快门收合与刻度微转。
- **主题与无障碍**：全走 `--sn-*` 中性色令牌，浅色与深色模式无缝适配；开启 `prefers-reduced-motion` 自动关闭位移动效。
