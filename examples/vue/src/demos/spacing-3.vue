<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import "./spacing-3.css";

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
    <div class="sn-sa" data-bar="auto" data-over="auto" style="--sn-sa-bar: 5px; --sn-sa-inset: 1px;">
      <div data-sa="x" class="sn-sa-vp sn-fx" style="overscroll-behavior: auto;">
        <table class="sp-ctl">
          <thead>
            <tr>
              <th>尺寸</th>
              <th>高度</th>
              <th>左右内边距</th>
              <th>胶囊形</th>
              <th>图标和字</th>
              <th>用在哪里</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>sm</td>
              <td class="sn-num">28</td>
              <td class="sn-num">10</td>
              <td class="sn-num">12</td>
              <td class="sn-num">6</td>
              <td>表格里、工具条、紧凑的筛选</td>
            </tr>
            <tr>
              <td>md</td>
              <td class="sn-num">32</td>
              <td class="sn-num">12</td>
              <td class="sn-num">14</td>
              <td class="sn-num">8</td>
              <td>默认</td>
            </tr>
            <tr>
              <td>lg</td>
              <td class="sn-num">36～40</td>
              <td class="sn-num">16</td>
              <td class="sn-num">16</td>
              <td class="sn-num">8</td>
              <td>主要表单、主要按钮</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="sn-sa-bar sn-y" hidden aria-hidden="true">
        <i class="sn-sa-thumb"></i>
      </div>
      <div class="sn-sa-bar sn-x" hidden aria-hidden="true">
        <i class="sn-sa-thumb"></i>
      </div>
    </div>
  </div>
</template>
