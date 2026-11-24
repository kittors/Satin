<script setup lang="ts">
import { DataGrid, type GridColumn } from "satin-ui/vue/grid";

const SCENES = ["雨夜车站", "候车厅", "站台", "末班列车", "出站口", "天桥", "售票处", "广场"];
// 假的服务端（真的项目里换成 fetch）：按 sort、搜索词排好、筛好，切出 [start, end) 这一段
type ShotRow = { id: number; name: string; shots: number; dur: number; [k: string]: string | number };
let all: ShotRow[] | null = null, last = "", list: ShotRow[] = [];
function query(sort: { key: string; dir: number } | null | undefined, q?: string) {
  all ??= Array.from({ length: 100000 }, (_, i) => ({ id: i + 1, name: `${SCENES[i % 8]} ${Math.floor(i / 8) + 1}`, shots: (i * 37) % 90 + 1, dur: (i * 53) % 600 + 30 }));
  const key = JSON.stringify([sort, q]);
  if (key !== last) {
    last = key;
    list = q ? all.filter((r) => r.name.includes(q)) : all.slice();
    if (sort) list.sort((a, b) => (a[sort.key] < b[sort.key] ? -1 : a[sort.key] > b[sort.key] ? 1 : 0) * sort.dir);
  }
  return list;
}
// 表格按块要：滚到哪要到哪（一块 100 行），排序、搜索变了从头要；还没到的行显示占位条
const dataSource = {
  total: 100000,
  async load({ start, end, sort, filter }) {
    // 换成：return (await fetch(`/api/shots?start=${start}&end=${end}&sort=…&q=…`)).json() —— 返回 { rows, total }
    await new Promise((r) => setTimeout(r, 300));
    const found = query(sort, filter.q?.trim());
    return { rows: found.slice(start, end), total: found.length };
  },
};
const columns: GridColumn[] = [
  { key: "name", title: "名称", width: 200, sortable: true },
  { key: "shots", title: "镜头", type: "int", width: 96, sortable: true },
  { key: "dur", title: "时长", type: "dur", width: 96, sortable: true },
];
</script>

<template>
  <DataGrid :columns="columns" :data-source="dataSource" label="十万个镜头" />
</template>
