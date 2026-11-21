<script setup>
import { ref, computed } from "vue";
import { Segmented } from "satin-ui/vue";

const RANGES = ["7 天","30 天","全部"];
const range = ref("30 天");
const note = computed(() => (range.value === "全部" ? "显示全部数据" : `显示最近 ${range.value}的数据`));
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Segmented v-model="range" :items="RANGES" label="时间范围" />
    <span class="sn-help">{{ note }}</span>
  </div>
</template>
