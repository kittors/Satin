<script setup lang="ts">
import { ref } from "vue";
import { Select } from "satin-ui/vue";

const statuses = [
  { value: "draft", label: "草稿" },
  { value: "review", label: "待审核" },
  { value: "done", label: "已完成", disabled: true },
];
const status = ref("draft");
</script>

<template>
  <Select v-model="status" :items="statuses" label="状态" />
</template>
