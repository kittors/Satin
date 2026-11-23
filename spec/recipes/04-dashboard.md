# 数据分析仪表盘

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
