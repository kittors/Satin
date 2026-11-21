<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import { createDataGrid } from "satin-ui/grid";

const root = ref(null);
let off = () => {};
onMounted(() => {
  const unsetup = setup();
  const done = enhance(root.value, (root) => {
    const grid = createDataGrid(root.querySelector('[data-ex="grid"]'), { rows: 100000 });
    // 不用了（换页、卸载）记得：grid.destroy();
    void grid;
  });
  off = () => { done(); unsetup(); };
});
onBeforeUnmount(() => off());
</script>

<template>
  <div ref="root">
    <div data-ex="grid"></div>
  </div>
</template>
