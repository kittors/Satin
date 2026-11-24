<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import "./space-1.css";

const root = ref<HTMLDivElement | null>(null);
let off = () => {};
onMounted(() => {
  if (!root.value) return;
  const unsetup = setup();
  const done = enhance(root.value);
  off = () => { done(); unsetup(); };
});
onBeforeUnmount(() => off());
</script>

<template>
  <div ref="root">
    <div class="row" style="gap:32px">
      <div class="nest" style="--R:16px;--sn-p:8px">
        <div></div>
        <span class="sn-cap">外 16，内边距 8 → 内 8</span>
      </div>
      <div class="nest" style="--R:12px;--sn-p:4px">
        <div></div>
        <span class="sn-cap">外 12，内边距 4 → 内 8（菜单与菜单项）</span>
      </div>
      <div class="nest bad-nest" style="--R:16px;--sn-p:8px">
        <div></div>
        <span class="sn-cap sn-c-danger">错误：内外同为 16，四周间距不均</span>
      </div>
    </div>
  </div>
</template>
