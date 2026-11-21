<script setup>
import { ref, computed } from "vue";
import { DataGrid } from "satin-ui/vue/grid";

// sortable 的列点表头排序：升序 → 降序 → 不排
const columns = [
  { key: "name", title: "名称", width: 180, sortable: true },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "shots", title: "镜头", type: "int", width: 96, sortable: true },
  { key: "dur", title: "时长", type: "dur", width: 96, sortable: true },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
const TITLES = { name: "名称", shots: "镜头", dur: "时长" };
const describe = (s) => (s ? `按${TITLES[s.key]}${s.dir > 0 ? "从小到大" : "从大到小"}排` : "没有排序：按原来的顺序");
// v-model:sort：{ key, dir }（dir 1 升序、-1 降序）或 null
const sort = ref({ key: "shots", dir: -1 });
const note = computed(() => describe(sort.value));
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <DataGrid v-model:sort="sort" :columns="columns" :data="rows" :height="280" label="镜头清单" />
    <span class="sn-help">{{ note }}</span>
  </div>
</template>
