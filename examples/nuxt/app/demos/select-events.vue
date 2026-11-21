<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import { Select as SnSelect } from "satin-ui/vue";

const root = ref(null);
let off = () => {};
onMounted(() => {
  const unsetup = setup();
  const done = enhance(root.value, (root) => {
    const box = root.querySelector('[data-ex="ratio"]');
    box.addEventListener("sn-change", (e) => {
      box.querySelector("[data-out]").textContent = "当前：" + e.detail;
    });
  });
  off = () => { done(); unsetup(); };
});
onBeforeUnmount(() => off());
</script>

<template>
  <div ref="root">
    <div class="sn-stack sn-gap-8" data-ex="ratio">
      <SnSelect :items='["16:9 · 横屏","9:16 · 竖屏","1:1 · 方形"]' value="16:9 · 横屏" label="画面比例" />
      <span class="sn-help" data-out="">当前：16:9 · 横屏</span>
    </div>
  </div>
</template>
