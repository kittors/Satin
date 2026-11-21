<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import { createDataGrid } from "satin-ui/grid";

const root = ref(null);
let off = () => {};
onMounted(() => {
  const unsetup = setup();
  const done = enhance(root.value, (root) => {
    createDataGrid(root.querySelector('[data-ex="grid2"]'), { rows: 2000, seed: 7, label: "镜头清单，2000 行" });
  });
  off = () => { done(); unsetup(); };
});
onBeforeUnmount(() => off());
</script>

<template>
  <div ref="root">
    <div data-ex="grid2"></div>
  </div>
</template>
