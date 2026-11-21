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
    <div class="sn-field">
      <span class="sn-lbl">每天提醒</span>
      <div class="sn-pk" data-pk="time" style="min-width:140px">
        <button class="sn-pk-trigger" type="button" aria-haspopup="dialog">
          <span class="sn-val sn-ph" data-ph="选择时间">选择时间</span>
          <span class="sn-end sn-swap">
            <span class="sn-a" data-i="clock"></span>
            <span class="sn-b" data-i="x" role="button" aria-label="清除"></span>
          </span>
        </button>
        <div class="sn-pk-panel" role="dialog" aria-label="选择时间">
          <div class="sn-tc-slot"></div>
          <div class="sn-pk-foot">
            <button class="sn-btn sn-ghost sn-sm" type="button" data-now="">此刻</button>
            <span class="sn-grow"></span>
            <button class="sn-btn sn-primary sn-sm" type="button" data-ok="">确定</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
