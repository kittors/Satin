<script setup lang="ts">
import { ref } from "vue";
import { Select } from "satin-ui/vue";

const ratios = ["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"];
const ratio = ref();
</script>

<template>
  <Select v-model="ratio" :items="ratios" placeholder="选择画面比例" label="画面比例" />
</template>
