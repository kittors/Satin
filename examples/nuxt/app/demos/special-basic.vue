<script setup>
import { Search } from "satin-ui/vue";

const SHOTS = ["站台远景", "雨里的车灯", "推门进候车厅", "站台告别", "末班列车"];
// search(q) 返回结果数：右边淡入"N 个结果"；返回 Promise 时等超过 300ms 放大镜换成转圈
const count = (q) => SHOTS.filter((s) => s.includes(q)).length;
</script>

<template>
  <Search placeholder="搜索镜头" label="搜索镜头" :search="count" />
</template>
