<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import { createSlider } from "satin-ui/components";
import "./slider-0.css";

const root = ref<HTMLDivElement | null>(null);
let off = () => {};
onMounted(() => {
  if (!root.value) return;
  const unsetup = setup();
  const done = enhance(root.value, (root: any) => {
    const slider = createSlider(root.querySelector("[data-slider]"), {
      onChange: (value?: any) => console.log("当前值", value),
    });
    slider.update({ value: 60 }); // 从外面改值
  });
  off = () => { done(); unsetup(); };
});
onBeforeUnmount(() => off());
</script>

<template>
  <div ref="root">
    <div class="row" style="gap:40px">
      <div class="sn-field">
        <span class="sn-lbl">画面强度</span>
        <div class="sn-slider" data-slider="" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="100" aria-valuenow="52">
          <span class="sn-rail"></span>
          <span class="sn-fillbar"></span>
          <span class="sn-knob"></span>
          <span class="sn-bubble"></span>
        </div>
      </div>
      <div class="sn-field">
        <span class="sn-lbl">镜头时长（秒）</span>
        <div class="sn-slider" data-slider="" data-max="12" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="12" aria-valuenow="4">
          <span class="sn-rail"></span>
          <span class="sn-fillbar"></span>
          <span class="sn-knob"></span>
          <span class="sn-bubble"></span>
        </div>
      </div>
    </div>
  </div>
</template>
