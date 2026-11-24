<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import { Avatar as SnAvatar } from "satin-ui/vue";
import "./avatar-1.css";

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
    <div class="row" style="gap:12px">
      <SnAvatar name="张伟" :size='40' />
      <SnAvatar name="何慧" :size='40' />
      <SnAvatar name="徐丽" :size='40' />
      <SnAvatar name="梁静" :size='40' />
      <SnAvatar name="冯磊" :size='40' />
      <SnAvatar name="赵敏" :size='40' />
      <SnAvatar name="陈静" :size='40' />
      <SnAvatar name="罗军" :size='40' />
      <SnAvatar name="潘涛" :size='40' />
      <SnAvatar name="赵启航" :size='40' />
      <SnAvatar name="沈念" :size='40' />
      <SnAvatar name="黄磊" :size='40' />
    </div>
  </div>
</template>
