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
      <button type="button" class="sn-btn sn-secondary">取消</button>
      <button type="button" class="sn-btn sn-primary">保存修改</button>
    </div>
  </div>
</template>
