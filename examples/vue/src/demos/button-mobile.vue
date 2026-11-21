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
    <div class="sn-bottom-bar">
      <span class="sn-grow sn-num">合计 ¥ 1,280</span>
      <button type="button" class="sn-btn sn-primary sn-lg">提交订单</button>
    </div>
  </div>
</template>
