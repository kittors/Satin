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
      <button type="button" class="sn-btn sn-primary">新建项目</button>
      <button type="button" class="sn-btn sn-secondary">导入原文</button>
      <button type="button" class="sn-btn sn-tertiary">预览</button>
      <button type="button" class="sn-btn sn-ghost">跳过</button>
      <button type="button" class="sn-btn sn-danger">删除项目</button>
      <button type="button" class="sn-btn sn-danger-soft">移出团队</button>
    </div>
  </div>
</template>
