<script setup lang="ts">
import { ref, onMounted } from "vue";
import { loadWithSkeleton } from "satin-ui";

// 容器交给 loadWithSkeleton 填（骨架和数据都是它写进去的 HTML），模板里留空
const box = ref<HTMLDivElement | null>(null);
onMounted(() => loadWithSkeleton(box.value, {
  // 300ms 内回来就不显示骨架；显示了就至少留 500ms；数据到了逐行替换（每行晚 40ms 淡入）
  load: () => new Promise((ok) => setTimeout(() => ok([["1", "站台远景", "广角 · 6 秒"], ["2", "雨里的车灯", "近景 · 3 秒"], ["3", "推门进候车厅", "中景 · 5 秒"]]), 1200)),
  skeleton: [46, 38, 52].map((w) => `<div class="sn-sk-row"><span class="sn-sk" style="width:64px;height:40px;border-radius:6px"></span><div class="sn-meta"><span class="sn-sk" style="width:${w}%;height:12px"></span><span class="sn-sk" style="width:22%;height:10px"></span></div></div>`).join(""),
  render: (rows) => rows.map(([n, t, m]) => `<div class="sn-sk-row"><span class="sn-thumb"></span><div class="sn-meta" style="gap:2px"><b>镜头 ${n} · ${t}</b><span>${m}</span></div></div>`).join(""),
}));
</script>

<template>
  <div ref="box" class="sn-sk-list" aria-live="polite"></div>
</template>
