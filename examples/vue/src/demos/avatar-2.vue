<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import { Avatar as SnAvatar } from "satin-ui/vue";

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
    <div class="sn-set-list" style="max-width:420px">
      <div class="sn-set-row">
        <SnAvatar name="何慧" decorative online />
        <div class="sn-tx">
          <b>何慧</b>
          <span>前端开发</span>
        </div>
      </div>
      <div class="sn-set-row">
        <SnAvatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&amp;fit=crop&amp;w=128&amp;h=128&amp;q=80" name="黄磊" decorative />
        <div class="sn-tx">
          <b>黄磊</b>
          <span>产品设计</span>
        </div>
      </div>
      <div class="sn-set-row">
        <SnAvatar name="徐丽" decorative />
        <div class="sn-tx">
          <b>徐丽</b>
          <span>财务顾问</span>
        </div>
      </div>
    </div>
  </div>
</template>
