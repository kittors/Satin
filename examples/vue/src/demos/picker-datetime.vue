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
      <span class="sn-lbl">定时发布</span>
      <div class="sn-pk" data-pk="datetime" style="min-width:250px">
        <button class="sn-pk-trigger" type="button" aria-haspopup="dialog">
          <span class="sn-val sn-ph" data-ph="选择发布时间">选择发布时间</span>
          <span class="sn-end sn-swap">
            <span class="sn-a" data-i="calendar"></span>
            <span class="sn-b" data-i="x" role="button" aria-label="清除"></span>
          </span>
        </button>
        <div class="sn-pk-panel" role="dialog" aria-label="选择发布时间">
          <div class="sn-pk-dt">
            <div class="sn-cal-slot"></div>
            <div class="sn-tside">
              <span class="sn-cap">时间</span>
              <div class="sn-tc-slot"></div>
            </div>
          </div>
          <div class="sn-pk-foot">
            <span class="sn-note"></span>
            <span class="sn-grow"></span>
            <button class="sn-btn sn-primary sn-sm" type="button" data-ok="">确定</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
