<script>
import { wrapSatin } from "satin-ui/vue";
import { createDataGrid } from "satin-ui/grid";

// 包一次，放在模块里（不放进 setup，免得每次挂载都包一遍）
const SnDataGrid = wrapSatin(createDataGrid, { name: "SnDataGrid", props: ["rows", "seed", "label"], events: [] });
export default { components: { SnDataGrid } };
</script>

<template>
  <SnDataGrid :rows="100000" :seed="11" />
</template>
