<script setup>
import { Button, toast } from "satin-ui/vue";

// 状态提示：底部中间出现，3 秒后自己消失
const run = () => {
  toast({ text: "已保存到草稿箱" });
};
</script>

<template>
  <Button @click="run">存草稿</Button>
</template>
