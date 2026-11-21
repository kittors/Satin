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
    <div class="sn-row sn-between">
      <button type="button" class="sn-btn sn-ghost">不保存</button>
      <div class="sn-row sn-gap-8">
        <button type="button" class="sn-btn sn-secondary">取消</button>
        <button type="button" class="sn-btn sn-primary">保存</button>
      </div>
    </div>
  </div>
</template>
