<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import { createAreaChart, createBarChart, createDonutChart, createChart3D, createSparkline, icon3DHTML, bindIcons3D } from "satin-ui/charts";
import "satin-ui/css/charts.css";
import "./charts-0.css";

const root = ref(null);
let off = () => {};
onMounted(() => {
  const unsetup = setup();
  const done = enhance(root.value, (root) => {
    // 1. 趋势面积图（周期切换平滑 Morph）
    const area = createAreaChart(root.querySelector("#chArea"), {
      labels: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      series: [
        { name: "生成镜头", color: "accent", values: [168, 214, 196, 268, 312, 284, 342] },
        { name: "一次通过", color: "success", values: [134, 178, 162, 224, 266, 241, 298] },
      ],
      unit: " 镜",
    });

    // 2. 真交互 3D 立体柱阵（可 360° 拖拽旋转、预设视角飞行、悬停立体抬升）
    const c3d = createChart3D(root.querySelector("#ch3d"), {
      rows: ["上海集群", "杭州集群", "深圳集群"],
      cols: ["周一", "周二", "周三", "周四", "周五", "周六"],
      rowColors: ["blue", "violet", "success"],
      metricLabel: "渲染吞吐",
      unit: " 镜/h",
      values: [[72, 94, 88, 126, 148, 112], [56, 78, 108, 118, 134, 96], [42, 64, 74, 92, 106, 84]],
    });

    // 3. 3D 立体质感图标（陀螺仪倾角视差 + 动态高光）
    el.innerHTML = icon3DHTML({ name: "clapperboard", tone: "obsidian", size: "lg", label: "分镜创作" });
    bindIcons3D(el);
  });
  off = () => { done(); unsetup(); };
});
onBeforeUnmount(() => off());
</script>

<template>
  <div ref="root">
    <div class="ch-demo-bar">
      <div class="sn-seg sn-sm" data-seg="charea">
        <span class="sn-thumb"></span>
        <button data-v="week">本周</button>
        <button data-v="month">本月</button>
        <button data-v="quarter">季度</button>
      </div>
      <button type="button" class="sn-btn sn-ghost sn-sm" data-ch-area-replay="" data-i="refresh-cw:before">重播入场</button>
    </div>
    <div id="chArea">
      <div class="sn-ch-top">
        <div class="sn-ch-legend">
          <button type="button" class="sn-ch-leg" data-si="0" aria-pressed="true">
            <i class="sn-ch-leg-dot"></i>
            <span class="sn-ch-leg-lbl">生成镜头</span>
          </button>
          <button type="button" class="sn-ch-leg" data-si="1" aria-pressed="true">
            <i class="sn-ch-leg-dot"></i>
            <span class="sn-ch-leg-lbl">一次通过</span>
          </button>
        </div>
      </div>
      <div class="sn-ch-stage">
        <canvas class="sn-ch-cv" width="724" height="244"></canvas>
        <div class="sn-ch-tip" role="status" aria-live="polite"></div>
      </div>
      <i></i>
    </div>
  </div>
</template>
