<script setup>
import { ref } from "vue";
import { Button, Steps } from "satin-ui/vue";

const STEPS = ["导入原文", "拆分章节", "生成分镜", "配音"];
const cur = ref(1);
</script>

<template>
  <div class="sn-stack sn-gap-12">
    <Steps :steps="STEPS" :current="cur" />
    <div class="sn-row">
      <Button size="sm" :disabled="cur === 0" @click="cur--">上一步</Button>
      <Button size="sm" variant="primary" :disabled="cur === STEPS.length - 1" @click="cur++">下一步</Button>
    </div>
  </div>
</template>
