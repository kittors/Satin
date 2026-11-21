<script setup>
import { Button, toast } from "satin-ui/vue";

const run = () => {
  // 进度提示：先出进度环和百分比，做完了原地换成结果
  const t = toast({ kind: "progress", text: "正在导出 第三集.mp4", progress: 0 });
  let p = 0;
  const timer = setInterval(() => {
    p = Math.min(1, p + 0.2);
    if (p < 1) return t.update({ progress: p });
    clearInterval(timer);
    t.update({ kind: "status", text: "已导出到“下载”", done: true, duration: 3000 });
  }, 400);
};
</script>

<template>
  <Button variant="primary" @click="run">导出成片</Button>
</template>
