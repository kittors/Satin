<script setup>
import { ref, onBeforeUnmount } from "vue";
import { Button, Progress } from "satin-ui/vue";

const p = ref(0), running = ref(false);
let t = 0;
const stop = () => { clearInterval(t); running.value = false; };
const toggle = () => {
  p.value = 0;
  if (running.value) return stop();
  running.value = true;
  t = setInterval(() => { p.value = Math.min(1, p.value + 0.1); if (p.value >= 1) stop(); }, 300);
};
onBeforeUnmount(stop);
</script>

<template>
  <div class="sn-stack sn-gap-8" style="max-width: 420px">
    <Progress :value="p" label="导出进度" />
    <div class="sn-row">
      <span class="sn-help sn-num">{{ p >= 1 ? "已导出" : running ? `已导出 ${Math.round(p * 100)}%` : "还没开始" }}</span>
      <Button size="sm" @click="toggle">{{ running ? "取消" : p >= 1 ? "再导一次" : "开始导出" }}</Button>
    </div>
  </div>
</template>
