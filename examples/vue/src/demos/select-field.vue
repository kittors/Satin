<script setup>
import { ref } from "vue";
import { Select } from "satin-ui/vue";

const ratios = ["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"];
const ratio = ref("16:9 · 横屏");
</script>

<template>
  <div class="sn-field">
    <span class="sn-lbl">画面比例</span>
    <Select v-model="ratio" :items="ratios" label="画面比例" />
    <div class="sn-help">导出成片时用这个比例。</div>
  </div>
</template>
