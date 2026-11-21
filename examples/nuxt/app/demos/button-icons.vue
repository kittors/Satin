<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";

const root = ref(null);
let off = () => {};
onMounted(() => {
  const unsetup = setup();
  const done = enhance(root.value);
  off = () => { done(); unsetup(); };
});
onBeforeUnmount(() => off());
</script>

<template>
  <div ref="root">
    <div class="sn-row">
      <button type="button" class="sn-btn sn-primary" data-i="plus:before">新建项目</button>
      <button type="button" class="sn-btn sn-secondary" data-i="arrow-right:after">下一步</button>
      <button type="button" class="sn-btn sn-ghost sn-ibtn" data-i="settings" data-tip="设置" aria-label="设置"></button>
      <button type="button" class="sn-btn sn-ghost sn-ibtn sn-selected" data-i="layout-grid" data-tip="网格视图" aria-label="网格视图"></button>
    </div>
  </div>
</template>
