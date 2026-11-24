<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import "./loading-1.css";

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
    <div class="row" style="margin-bottom:16px">
      <button class="sn-btn sn-secondary" data-load="200">加载（快，200ms）</button>
      <button class="sn-btn sn-secondary" data-load="1600">加载（慢，1.6 秒）</button>
      <span class="sn-note" id="loadNote">快的那次不会闪出骨架</span>
    </div>
    <div class="sn-sk-list" id="skList">
      <div class="sn-sk-row">
        <span class="sn-thumb"></span>
        <div class="sn-meta">
          <b>镜头 07 · 车站外，雨刚停</b>
          <span>远景 · 4 秒</span>
        </div>
      </div>
      <div class="sn-sk-row">
        <span class="sn-thumb"></span>
        <div class="sn-meta">
          <b>镜头 08 · 林夏走进候车厅</b>
          <span>全景 · 6 秒</span>
        </div>
      </div>
      <div class="sn-sk-row">
        <span class="sn-thumb"></span>
        <div class="sn-meta">
          <b>镜头 09 · 站台上的最后一班车</b>
          <span>中景 · 5 秒</span>
        </div>
      </div>
      <div class="sn-sk-row">
        <span class="sn-thumb"></span>
        <div class="sn-meta">
          <b>镜头 10 · 车窗里的倒影</b>
          <span>特写 · 3 秒</span>
        </div>
      </div>
    </div>
  </div>
</template>
