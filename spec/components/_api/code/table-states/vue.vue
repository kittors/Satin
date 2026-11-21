<script setup>
import { ref, onMounted } from "vue";
import { Table } from "satin-ui/vue";

const COLUMNS = [
  { key: "name", title: "镜头", sortable: true },
  { key: "type", title: "景别" },
  { key: "dur", title: "时长", align: "right", sortable: true, format: (v) => `${v} 秒` },
  { key: "owner", title: "负责人" },
];
// 加载中给 loading（骨架行，300ms 内回来不出）；加载完是空数组就显示 empty
const rows = ref(null);
onMounted(() => setTimeout(() => (rows.value = []), 1200));
</script>

<template>
  <Table :columns="COLUMNS" :data="rows ?? []" :loading="rows === null" empty="还没有镜头，先导入原文" label="镜头清单" compact />
</template>
