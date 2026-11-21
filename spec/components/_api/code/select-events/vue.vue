<script setup>
import { ref } from "vue";
import { Select } from "satin-ui/vue";

const ratios = ["16:9 · 横屏", "9:16 · 竖屏", "1:1 · 方形"];
const current = ref("16:9 · 横屏");
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <!-- 只给 value：组件自己管选中；@change 拿到选中的值 -->
    <Select :items="ratios" value="16:9 · 横屏" label="画面比例" @change="(v) => (current = v)" />
    <span class="sn-help">当前：{{ current }}</span>
  </div>
</template>
