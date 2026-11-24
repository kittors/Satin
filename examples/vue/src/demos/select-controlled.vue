<script setup lang="ts">
import { ref } from "vue";
import { Select } from "satin-ui/vue";

const ratios = ["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"];
const ratio = ref("9:16 · 竖屏");
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Select v-model="ratio" :items="ratios" label="画面比例" />
    <span class="sn-help">当前：{{ ratio }}</span>
  </div>
</template>
