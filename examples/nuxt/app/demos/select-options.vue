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
    <SnSelect :items='[{"value":"draft","label":"草稿"},{"value":"review","label":"待审核"},{"value":"done","label":"已完成","disabled":true}]' value="draft" label="状态" />
  </div>
</template>
