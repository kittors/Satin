<script setup>
import { ref } from "vue";
import { Select as SnSelect } from "satin-ui/vue";
const ratio = ref("9:16 · 竖屏");
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <SnSelect v-model="ratio" :items='["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"]' label="画面比例" />
    <span class="sn-help">当前：{{ ratio }}</span>
  </div>
</template>
