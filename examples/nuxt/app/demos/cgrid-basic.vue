<script setup lang="ts">
import { CanvasGrid, type GridColumn } from "satin-ui/vue/canvas-grid";

// 列和数据的写法和数据表格一样；画布上只能画文字：格子的文字用 format 改（没有 render）
const columns: GridColumn[] = [
  { key: "name", title: "名称", width: 180 },
  { key: "status", title: "状态", type: "status", width: 120, options: ["待开始", "进行中", "审核中", "已完成"] },
  { key: "owner", title: "负责人", type: "owner", width: 120 },
  { key: "shots", title: "镜头", type: "int", width: 96 },
  { key: "dur", title: "时长", type: "dur", width: 96 },
];
const rows = [
  { id: 1, name: "雨夜车站", status: "进行中", owner: "林夏", shots: 12, dur: 154 },
  { id: 2, name: "候车厅", status: "已完成", owner: "周屿", shots: 4, dur: 48 },
  { id: 3, name: "站台告别", status: "待开始", owner: "林夏", shots: 9, dur: 131 },
  { id: 4, name: "末班列车", status: "审核中", owner: "陈默", shots: 16, dur: 212 },
  { id: 5, name: "出站口", status: "已完成", owner: "周屿", shots: 6, dur: 75 },
  { id: 6, name: "天桥", status: "进行中", owner: "许棠", shots: 8, dur: 96 },
];
</script>

<template>
  <CanvasGrid :columns="columns" :data="rows" :height="260" label="镜头清单" />
</template>
