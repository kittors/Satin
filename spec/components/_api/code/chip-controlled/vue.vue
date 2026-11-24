<script setup lang="ts">
import { ref } from "vue";
import { Chip } from "satin-ui/vue";

const STATUS = ["进行中", "已完成", "失败", "已归档"];
const picked = ref(["进行中"]);
const toggle = (s: string, on: boolean) => { picked.value = on ? [...picked.value, s] : picked.value.filter((x) => x !== s); };
</script>

<template>
  <div class="sn-row">
    <Chip v-for="s in STATUS" :key="s" :model-value="picked.includes(s)" @update:model-value="(on) => toggle(s, on)">{{ s }}</Chip>
  </div>
</template>
