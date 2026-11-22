<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import { Avatar as SnAvatar } from "satin-ui/vue";
import "./avatar-0.css";

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
    <div class="row" style="gap:14px">
      <SnAvatar seed="u4" name="周屿" :size='16' />
      <SnAvatar seed="u4" name="周屿" :size='20' />
      <SnAvatar seed="u4" name="周屿" :size='24' />
      <SnAvatar seed="u4" name="周屿" />
      <SnAvatar seed="u4" name="周屿" :size='40' />
      <SnAvatar seed="u4" name="周屿" :size='64' />
    </div>
  </div>
</template>
