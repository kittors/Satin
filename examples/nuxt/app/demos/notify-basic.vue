<script setup>
import { Button, notify } from "satin-ui/vue";

// 通知：右上角滑进来，不自己消失，点 × 关
const run = () => {
  notify({ title: "第三集导出完成", body: "已保存到“下载”文件夹，1080p，12 分 36 秒。", tone: "ok", time: "刚刚" });
};
</script>

<template>
  <Button @click="run">模拟导出完成</Button>
</template>
