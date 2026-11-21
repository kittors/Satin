<script setup>
import { ref } from "vue";
import { Select } from "satin-ui/vue";

const ratios = ["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"];
const ratio = ref("16:9 · 横屏");
</script>

<template>
  <Select v-model="ratio" :items="ratios" label="画面比例" />
</template>
