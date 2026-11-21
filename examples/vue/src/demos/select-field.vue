<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import { Select as SnSelect } from "satin-ui/vue";

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
    <div class="sn-field">
      <span class="sn-lbl">画面比例</span>
      <SnSelect :items='["16:9 · 横屏","9:16 · 竖屏","1:1 · 方形"]' value="16:9 · 横屏" label="画面比例" />
      <div class="sn-help">导出成片时用这个比例。</div>
    </div>
  </div>
</template>
