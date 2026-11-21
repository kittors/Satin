<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import "./type-1.css";

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
    <div class="row" id="tones">
      <span class="sn-t-body sn-c-primary">主文字</span>
      <span class="sn-t-body sn-c-secondary">副信息</span>
      <span class="sn-t-body sn-c-tertiary">时间、占位</span>
      <span class="sn-t-body sn-c-off">禁用</span>
      <span class="sn-t-body sn-c-danger">失败、删除</span>
      <span class="sn-t-body sn-c-success">成功（瞬时反馈）</span>
      <span class="sn-t-body sn-c-warning">系统警告</span>
    </div>
  </div>
</template>
