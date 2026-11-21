<script setup>
import { ref } from "vue";
import { Table } from "satin-ui/vue";

const COLUMNS = [
  { key: "name", title: "项目" },
  { key: "owner", title: "负责人" },
  { key: "shots", title: "镜头", align: "right" },
];
// 行里的 children 是下级：项目 → 分集 → 场
const DATA = [
  { id: "p1", name: "雨夜车站", owner: "林夏", shots: 48, children: [
    { id: "p1-e1", name: "第 1 集", owner: "林夏", shots: 20, children: [
      { id: "p1-e1-s1", name: "第 1 场 · 车站外", owner: "林夏", shots: 12 },
      { id: "p1-e1-s2", name: "第 2 场 · 候车厅", owner: "周屿", shots: 8 },
    ] },
    { id: "p1-e2", name: "第 2 集", owner: "林夏", shots: 28 },
  ] },
  { id: "p2", name: "海边的第七天", owner: "周屿", shots: 32, children: [
    { id: "p2-e1", name: "第 1 集", owner: "周屿", shots: 32 },
  ] },
  { id: "p3", name: "长夜", owner: "陈默", shots: 20 },
];
// v-model:expanded 绑展开着的行的 rowKey（默认 id）
const open = ref(["p1"]);
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Table v-model:expanded="open" :columns="COLUMNS" :data="DATA" label="项目和分集" />
    <span class="sn-help">展开着 {{ open.length }} 行</span>
  </div>
</template>
