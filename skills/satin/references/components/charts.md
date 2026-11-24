# 数据图表与 3D 视觉 · Charts · 3D

> 组件 id：`charts`　分组：数据展示

零第三方依赖 Canvas 微动效图表与 3D 立体视觉套件：平滑曲线描边入场、数据切换形变插值、阻尼跟手准星、分组柱状聚焦、环形联动、可 360° 拖拽旋转的真 3D 立体柱阵，以及带陀螺仪视差高光的 3D 立体质感图标。颜色全读 `--sn-*` 令牌，深浅主题即时重绘。

## 验收要点

- 全部图表基于高分屏 Canvas 2D（2x DPR）绘制，入场与切换使用非线性缓动（`ease.outStrong` / `ease.overshoot`），静止时零额外渲染开销。
- 3D 立体柱阵严格按 Painter's Algorithm 深度排序、动态法线背向剔除与受光面渐变着色；仅在需要呈现「双维度 × 指标高度」空间热力结构时引入 3D，日常趋势和对比优先使用 2D 折线/柱状图。
- 3D 立体图标采用 CSS 透视分层 + 指针倾角视差 + 动态镜面高光，仅用于产品导航入口、专题页头或空状态，绝不堆在表格正文或按钮栏里。

## 写法

### createAreaChart(容器, 选项)

| 选项 | 类型 | 默认 | 说明 |
|---|---|---|---|
| labels | string[] | [] | X 轴时间或类目刻度标签 |
| series | { name, values, color? }[] | [] | 多系列折线/面积数据；color 支持 accent / blue / success / warning / danger / violet / muted 或 CSS 色值 |
| height | number \| string | 248 | 绘图区高度，随容器宽度自适应并自动按 2x DPR 重绘 |
| unit | string | "" | 悬浮提示中的数值后缀单位 |
| legend | boolean | true | 是否显示可点击开关的交互图例 |
| area | boolean | true | 是否填充曲线下方柔和梯度面积 |

### createBarChart(容器, 选项)

| 选项 | 类型 | 默认 | 说明 |
|---|---|---|---|
| labels | string[] | [] | 柱组 X 轴类目名称 |
| series | { name, values, color? }[] | [] | 分组对比系列，支持入场交错弹簧生长与数据切换 Morph |
| onSelect | (label, index) => void | — | 点击柱组时回调，用于联动下方明细表或状态过滤 |

### createDonutChart(容器, 选项)

| 选项 | 类型 | 默认 | 说明 |
|---|---|---|---|
| items | { label, value, color? }[] | [] | 环形分片数据；悬停或点击自动外扩并更新中心汇总数字 |
| centerLabel | string | "总计" | 环心副标签文字 |
| size | number | 168 | 圆环直径（px） |
| onSelect | (item, index) => void | — | 点击分片或图例项时回调，返回当前选中项或 null |

### createChart3D(容器, 选项)

| 选项 | 类型 | 默认 | 说明 |
|---|---|---|---|
| rows / cols | string[] | [] | 三维矩阵的纵深行维度与横向列维度名称 |
| values | number[][] | [] | 二维数值矩阵 values[row][col]，决定每根 3D 柱体高度 |
| rowColors | string[] | null | 各行对应的语义色调，自动按受光面计算明暗渐变与棱线高光 |
| interactive | boolean | true | 开启 360° 拖拽惯性旋转、等轴测/俯视/正面视角飞行与悬停抬升 |

### createSparkline / icon3DHTML / bindIcons3D

| 函数 | 参数 | 说明 |
|---|---|---|
| createSparkline(容器, 选项) | { values, color, height } | KPI 指标卡迷你平滑趋势线与末端发光脉冲点 |
| icon3DHTML(选项) | { name, tone, size, label } | 生成带实体底座、棱边高光与悬浮投影的 3D 质感图标 HTML（tone：obsidian / cobalt / emerald / amber / crimson / violet / glass） |
| bindIcons3D(scope) | HTMLElement \| Document | 绑定指针陀螺仪倾角视差与动态镜面高光跟踪 |

## 用法

```html
<div class="ch-demo-bar">
  <div class="sn-seg sn-sm" data-seg="charea"><span class="sn-thumb"></span><button data-v="week">本周</button><button data-v="month">本月</button><button data-v="quarter">季度</button></div>
  <button type="button" class="sn-btn sn-ghost sn-sm" data-ch-area-replay data-i="refresh-cw:before">重播入场</button>
</div>
<div id="chArea"></div>
```

```js
import { initSeg } from "satin-ui";
import { createAreaChart } from "satin-ui/charts";
import "satin-ui/css/charts.css";

// 平滑趋势面积图：周期切换自动平滑 Morph 形变，悬停带阻尼准星
const DATA = new Map([
  ["week", {
    labels: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    series: [
      { name: "生成镜头", color: "accent", values: [168, 214, 196, 268, 312, 284, 342] },
      { name: "一次通过", color: "success", values: [134, 178, 162, 224, 266, 241, 298] },
    ],
  }],
  ["month", {
    labels: ["第 1 周", "第 2 周", "第 3 周", "第 4 周"],
    series: [
      { name: "生成镜头", color: "accent", values: [1120, 1480, 1690, 1940] },
      { name: "一次通过", color: "success", values: [890, 1210, 1420, 1685] },
    ],
  }],
  ["quarter", {
    labels: ["9 月", "10 月", "11 月", "12 月"],
    series: [
      { name: "生成镜头", color: "accent", values: [4280, 5610, 6230, 7480] },
      { name: "一次通过", color: "success", values: [3310, 4620, 5290, 6510] },
    ],
  }],
]);
const areaEl = document.querySelector("#chArea");
const init = DATA.get("week");
if (areaEl && init) {
  const chart = createAreaChart(areaEl, { ...init, height: 244, unit: " 镜" });
  const seg = document.querySelector('[data-seg="charea"]');
  if (seg) initSeg(seg, (v) => chart.update(DATA.get(v) || init), 0);
  document.querySelector("[data-ch-area-replay]")?.addEventListener("click", () => chart.replay());
}
```

## 设计稿里的标记（照抄即可；`data-i` 的图标要调 `injectIcons()`，交互组件还要接 JS，见上面的写法）

### 平滑趋势面积图（切换周期体验曲线 Morph 形变，悬停体验阻尼准星与多系列对比）

```html
<div>
<div class="sn-seg sn-sm" data-seg="charea"><span class="sn-thumb"></span><button data-v="week">本周</button><button data-v="month">本月</button><button data-v="quarter">季度</button></div>
<button type="button" class="sn-btn sn-ghost sn-sm" data-ch-area-replay="" data-i="refresh-cw:before">重播入场</button>
</div>
<div id="chArea"></div>
```

### 分组对比柱状图 & 环形占比图（悬停压暗非焦点、点击柱组或环段可联动筛选）

```html
<div>
<span class="sn-note" id="chLinkNote">点击柱组或环段可聚焦联动查看</span>
<button type="button" class="sn-btn sn-ghost sn-sm" data-ch-bar-replay="" data-i="refresh-cw:before">重播生长</button>
</div>
<div>
<div id="chBar"></div>
<div id="chDonut"></div>
</div>
```

### 3D 立体柱阵图表（拖拽 360° 自由旋转、切预设视角飞行、悬停单柱立体抬升）

```html
<div>
<div class="sn-seg sn-sm" data-seg="ch3d"><span class="sn-thumb"></span><button data-v="gpu">集群渲染吞吐</button><button data-v="cost">任务算力分布</button></div>
<span class="sn-note">支持鼠标左键拖拽旋转 · 惯性阻尼</span>
</div>
<div id="ch3d"></div>
```

### 3D 立体质感图标 & KPI 迷你趋势火花线

```html
<div id="chIcons3d"></div>
<div id="chSparks">
<div><div><span>日均生成镜头</span><b class="sn-num">254 镜</b><small class="sn-up">+14.2%</small></div><div id="spk1"></div></div>
<div><div><span>首镜通过率</span><b class="sn-num">93.4%</b><small class="sn-up">+4.8%</small></div><div id="spk2"></div></div>
<div><div><span>单镜渲染耗时</span><b class="sn-num">1 分 48 秒</b><small class="sn-up">-22 秒</small></div><div id="spk3"></div></div>
</div>
```

## 规则

- 全部图表基于高分屏 Canvas 2D（2x DPR）绘制，入场与切换使用非线性缓动（`ease.outStrong` / `ease.overshoot`），静止时零额外渲染开销。
- 3D 立体柱阵严格按 Painter's Algorithm 深度排序、动态法线背向剔除与受光面渐变着色；仅在需要呈现「双维度 × 指标高度」空间热力结构时引入 3D，日常趋势和对比优先使用 2D 折线/柱状图。
- 3D 立体图标采用 CSS 透视分层 + 指针倾角视差 + 动态镜面高光，仅用于产品导航入口、专题页头或空状态，绝不堆在表格正文或按钮栏里。

