<script lang="ts">
  import { onMount } from "svelte";
  import { setup, enhance, initSeg } from "satin-ui";
  import { createChart3D } from "satin-ui/charts";
  import "satin-ui/css/charts.css";
  import "./charts-2.css";

  let root!: HTMLDivElement;
  onMount(() => {
    if (!root) return;
    const unsetup = setup();
    const off = enhance(root, (root: any) => {
      // 真交互 3D 立体柱阵：支持 360° 拖拽惯性旋转、等轴测/俯视/正面视角飞行与悬停抬升
      const SETS = new Map([
        ["gpu", {
          rows: ["上海集群", "杭州集群", "深圳集群"],
          cols: ["周一", "周二", "周三", "周四", "周五", "周六"],
          rowColors: ["blue", "violet", "success"],
          metricLabel: "渲染吞吐",
          unit: " 镜/h",
          values: [[72, 94, 88, 126, 148, 112], [56, 78, 108, 118, 134, 96], [42, 64, 74, 92, 106, 84]],
        }],
        ["cost", {
          rows: ["视频生成", "语音配乐", "超分精修"],
          cols: ["周一", "周二", "周三", "周四", "周五", "周六"],
          rowColors: ["accent", "warning", "blue"],
          metricLabel: "算力消耗",
          unit: " 卡时",
          values: [[110, 142, 135, 168, 192, 154], [48, 52, 61, 74, 82, 66], [64, 86, 79, 104, 118, 92]],
        }],
      ]);
      const c3dEl = root.querySelector("#ch3d");
      const init = SETS.get("gpu");
      if (c3dEl && init) {
        const chart3d = createChart3D(c3dEl, { ...init, height: 340 });
        const seg3d = root.querySelector('[data-seg="ch3d"]');
        if (seg3d) initSeg(seg3d, (v?: any) => chart3d.update(SETS.get(v) || init), 0);
      }
    });
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div class="ch-demo-bar">
    <div class="sn-seg sn-sm" data-seg="ch3d">
      <span class="sn-thumb"></span>
      <button data-v="gpu">集群渲染吞吐</button>
      <button data-v="cost">任务算力分布</button>
    </div>
    <span class="sn-note">支持鼠标左键拖拽旋转 · 惯性阻尼</span>
  </div>
  <div id="ch3d"></div>
</div>
