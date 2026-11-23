// 数据图表与 3D 视觉演示（#charts + #icons 中的 3D 立体图标）
import { createAreaChart, createBarChart, createDonutChart, createChart3D, createSparkline, icon3DHTML, bindIcons3D } from "../../packages/satin-ui/src/charts.js";

export function initCharts({ $, $$, initSeg }) {
  // 1. 图标区附加的 3D 立体质感图标演示（如果页面存在 #icons3dDemo）
  const ic3dHost = $("#icons3dDemo");
  if (ic3dHost) {
    const ITEMS = [
      { name: "clapperboard", tone: "obsidian", label: "分镜创作" },
      { name: "chart-column", tone: "cobalt", label: "效能分析" },
      { name: "layers", tone: "violet", label: "渲染管线" },
      { name: "cpu", tone: "emerald", label: "算力集群" },
      { name: "box", tone: "amber", label: "三维资产" },
      { name: "compass", tone: "glass", label: "空间预览" },
    ];
    ic3dHost.innerHTML = `<div class="sn-ico3d-grid">${ITEMS.map((it) => `<div class="sn-ico3d-tile">${icon3DHTML({ name: it.name, tone: it.tone, size: "lg", label: it.label })}<span>${it.label}</span></div>`).join("")}</div>`;
    bindIcons3D(ic3dHost);
  }

  const sec = $("#charts");
  if (!sec) return;

  // ———— 演示 1：平滑趋势面积图 + 周期切换 Morph ————
  const areaEl = $("#chArea");
  if (areaEl) {
    const DATA = {
      week: {
        labels: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        series: [
          { name: "生成镜头", color: "accent", values: [168, 214, 196, 268, 312, 284, 342] },
          { name: "一次通过", color: "success", values: [134, 178, 162, 224, 266, 241, 298] },
        ],
      },
      month: {
        labels: ["第 1 周", "第 2 周", "第 3 周", "第 4 周"],
        series: [
          { name: "生成镜头", color: "accent", values: [1120, 1480, 1690, 1940] },
          { name: "一次通过", color: "success", values: [890, 1210, 1420, 1685] },
        ],
      },
      quarter: {
        labels: ["9 月", "10 月", "11 月", "12 月"],
        series: [
          { name: "生成镜头", color: "accent", values: [4280, 5610, 6230, 7480] },
          { name: "一次通过", color: "success", values: [3310, 4620, 5290, 6510] },
        ],
      },
    };
    const chart = createAreaChart(areaEl, { ...DATA.week, height: 244, unit: " 镜" });
    const seg = $('[data-seg="charea"]', sec);
    if (seg) initSeg(seg, (v) => chart.update(DATA[v] || DATA.week), 0);
    $("[data-ch-area-replay]", sec)?.addEventListener("click", () => chart.replay());
  }

  // ———— 演示 2：分组柱状对比图 + 环形占比联动 ————
  const barEl = $("#chBar");
  const donutEl = $("#chDonut");
  const noteEl = $("#chLinkNote");
  if (barEl && donutEl) {
    const GENRES = ["纪录", "电影感", "动画", "MV", "短剧"];
    const barChart = createBarChart(barEl, {
      labels: GENRES,
      unit: " 镜",
      height: 236,
      series: [
        { name: "本周交付", color: "blue", values: [420, 580, 360, 290, 470] },
        { name: "上周交付", color: "muted", values: [350, 490, 310, 260, 390] },
      ],
      onSelect(label) {
        if (noteEl) noteEl.textContent = label ? `已聚焦「${label}」题材（再次点击取消筛选）` : "点击柱组或环段可聚焦联动查看";
      },
    });
    createDonutChart(donutEl, {
      size: 164,
      centerLabel: "项目总数",
      unit: " 个",
      items: [
        { label: "已完成", value: 64, color: "success" },
        { label: "生成中", value: 32, color: "blue" },
        { label: "待审核", value: 24, color: "warning" },
        { label: "重试队列", value: 8, color: "danger" },
      ],
      onSelect(item) {
        if (noteEl) noteEl.textContent = item ? `已筛选「${item.label}」状态：共 ${item.value} 个项目` : "点击柱组或环段可聚焦联动查看";
      },
    });
    $("[data-ch-bar-replay]", sec)?.addEventListener("click", () => barChart.replay());
  }

  // ———— 演示 3：真交互 3D 立体柱阵图表（拖拽 360° 旋转 + 视角飞行 + 悬停抬升） ————
  const c3dEl = $("#ch3d");
  if (c3dEl) {
    const SETS = {
      gpu: {
        rows: ["上海集群", "杭州集群", "深圳集群"],
        cols: ["周一", "周二", "周三", "周四", "周五", "周六"],
        rowColors: ["blue", "violet", "success"],
        metricLabel: "渲染吞吐",
        unit: " 镜/h",
        values: [
          [72, 94, 88, 126, 148, 112],
          [56, 78, 108, 118, 134, 96],
          [42, 64, 74, 92, 106, 84],
        ],
      },
      cost: {
        rows: ["视频生成", "语音配乐", "超分精修"],
        cols: ["周一", "周二", "周三", "周四", "周五", "周六"],
        rowColors: ["accent", "warning", "blue"],
        metricLabel: "算力消耗",
        unit: " 卡时",
        values: [
          [110, 142, 135, 168, 192, 154],
          [48, 52, 61, 74, 82, 66],
          [64, 86, 79, 104, 118, 92],
        ],
      },
    };
    const chart3d = createChart3D(c3dEl, { ...SETS.gpu, height: 340 });
    const seg3d = $('[data-seg="ch3d"]', sec);
    if (seg3d) initSeg(seg3d, (v) => chart3d.update(SETS[v] || SETS.gpu), 0);
  }

  // ———— 演示 4：3D 立体质感图标矩阵 + 迷你 KPI 火花线 ————
  const i3dEl = $("#chIcons3d");
  if (i3dEl) {
    const SHOW = [
      { name: "clapperboard", tone: "obsidian", label: "分镜脚本" },
      { name: "chart-column", tone: "cobalt", label: "数据洞察" },
      { name: "layers", tone: "violet", label: "工作流引擎" },
      { name: "cpu", tone: "emerald", label: "GPU 集群" },
      { name: "box", tone: "amber", label: "3D 资产" },
      { name: "compass", tone: "glass", label: "空间预览" },
    ];
    i3dEl.innerHTML = `<div class="sn-ico3d-grid">${SHOW.map((it) => `<div class="sn-ico3d-tile">${icon3DHTML({ name: it.name, tone: it.tone, size: "lg", label: it.label })}<span>${it.label}</span></div>`).join("")}</div>`;
    bindIcons3D(i3dEl);
  }

  const spkRow = $("#chSparks");
  if (spkRow) {
    const SPKS = [
      { id: "spk1", vals: [32, 41, 38, 52, 64, 58, 76, 84], color: "accent" },
      { id: "spk2", vals: [74, 78, 81, 79, 85, 88, 91, 93], color: "success" },
      { id: "spk3", vals: [48, 44, 51, 39, 36, 31, 29, 24], color: "blue" },
    ];
    for (const s of SPKS) {
      const el = $(`#${s.id}`, spkRow);
      if (el) createSparkline(el, { values: s.vals, color: s.color, height: 34 });
    }
  }
}
