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

## 仪表盘

结构：页头（标题、时间范围、切换周期）→ 一个面板里放 3～4 个指标（`.sn-stats`）→ 两栏：左边主要内容（表格 / 分布），右边最近动态。
不做"指标墙"（八九张彩色 KPI 卡片），不给每个数字配一个彩色图标。彩色只用在涨跌和状态上：分布条按状态上色，和表格里状态标签的圆点同一套颜色——完成 `sn-ok`（绿）、生成中 `sn-run`（主色）、待审核 `sn-warn`（橙）、失败 `sn-bad`（红）。没有图表组件时，用进度条做分布、用表格列数字，比花哨的图更清楚。

```html
<div class="sn-page">
  <header class="sn-page-hd">
    <div><h1>概览</h1><p>11&nbsp;月&nbsp;14&nbsp;日 – 11&nbsp;月&nbsp;20&nbsp;日</p></div>
    <div class="sn-acts"><sn-segmented items='["本周","本月","全年"]' value="本周"></sn-segmented></div>
  </header>
  <div class="sn-stack sn-gap-24">
    <section class="sn-panel">
      <div class="sn-stats">
        <div class="sn-stat"><span>生成的镜头</span><b>1,284</b><small class="sn-up">比上周 +12%</small></div>
        <div class="sn-stat"><span>完成的项目</span><b>36</b><small>比上周 +4</small></div>
        <div class="sn-stat"><span>平均生成时长</span><b>2&nbsp;分&nbsp;18&nbsp;秒</b><small class="sn-down">比上周慢 9&nbsp;秒</small></div>
        <div class="sn-stat"><span>本月用量</span><b>68%</b><small>还剩 3,200&nbsp;次</small></div>
      </div>
    </section>
    <div class="sn-with-aside" style="--sn-aside: 340px">
      <section class="sn-panel">
        <div class="sn-panel-hd"><div><h2>各状态的项目</h2><p>共 128&nbsp;个</p></div><a class="sn-link" href="/projects">全部项目</a></div>
        <div class="sn-stack sn-gap-16">
          <div class="sn-stack sn-gap-8"><div class="sn-row sn-between"><span>已完成</span><span class="sn-num sn-c-secondary">58</span></div><div class="sn-pbar sn-ok" style="--sn-p: .45"><i></i></div></div>
          <div class="sn-stack sn-gap-8"><div class="sn-row sn-between"><span>生成中</span><span class="sn-num sn-c-secondary">31</span></div><div class="sn-pbar sn-run" style="--sn-p: .24"><i></i></div></div>
          <div class="sn-stack sn-gap-8"><div class="sn-row sn-between"><span>待审核</span><span class="sn-num sn-c-secondary">27</span></div><div class="sn-pbar sn-warn" style="--sn-p: .21"><i></i></div></div>
          <div class="sn-stack sn-gap-8"><div class="sn-row sn-between"><span>失败</span><span class="sn-num sn-c-secondary">12</span></div><div class="sn-pbar sn-bad" style="--sn-p: .09"><i></i></div></div>
        </div>
      </section>
      <section class="sn-panel">
        <div class="sn-panel-hd"><h2>最近动态</h2></div>
        <div class="sn-stack sn-gap-16">
          <div class="sn-row sn-gap-12"><sn-avatar seed="u3" name="林夏" size="32" decorative></sn-avatar><div class="sn-grow">林夏完成了「雨夜车站」<div class="sn-t-caption sn-c-tertiary">3&nbsp;分钟前</div></div></div>
          <div class="sn-row sn-gap-12"><sn-avatar seed="u4" name="周屿" size="32" decorative></sn-avatar><div class="sn-grow">周屿上传了 12&nbsp;张素材<div class="sn-t-caption sn-c-tertiary">1&nbsp;小时前</div></div></div>
          <div class="sn-row sn-gap-12"><sn-avatar seed="u11" name="许诺" size="32" decorative></sn-avatar><div class="sn-grow">许诺重新生成了「长夜」的第 12&nbsp;个镜头<div class="sn-t-caption sn-c-tertiary">昨天 18:40</div></div></div>
          <div class="sn-row sn-gap-12"><sn-avatar seed="u8" name="陈默" size="32" decorative></sn-avatar><div class="sn-grow">陈默加入了团队<div class="sn-t-caption sn-c-tertiary">11&nbsp;月&nbsp;18&nbsp;日</div></div></div>
        </div>
      </section>
    </div>
  </div>
</div>
```

指标用 `.sn-stats` 排：宽屏一行放下全部（4 个就是一行 4 个），页面窄于 720（平板、手机）两列，4 个是 2 × 2，不会在中等宽度排成 3 + 1。数字 22px，不放大成 KPI 大字卡。
手机上（窄于 640）：页头变成吸顶的导航栏（标题居中、时间范围是标题下面一行小字），周期切换换到导航栏下面一行、撑满；面板铺满左右、去掉圆角和描边；两栏变成上下两块。
"全部项目"这种文字链接用 `sn-link`，只套排版类（`sn-t-callout`）会露出浏览器默认的蓝色下划线。
最近动态不加粗名字、不放徽标；每行最前面放 `<sn-avatar seed="…" name="…" decorative>`（React `<Avatar>` / Vue `<SnAvatar>`），不要用名字里的一个字当头像。
表格放在左栏时用 `.sn-panel.sn-flush` 包住 `.sn-tbl-wrap.sn-plain`（无外框的表格），不要卡片里再套一圈边框。

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
