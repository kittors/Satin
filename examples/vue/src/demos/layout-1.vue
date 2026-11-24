<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import "./layout-1.css";

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
              <th>断点</th>
              <th>容器宽度</th>
              <th>栅格</th>
              <th>列间距</th>
              <th>主区边距</th>
              <th>侧栏</th>
              <th>二级栏</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>compact</td>
              <td class="sn-num">&lt; 720</td>
              <td class="sn-num">4 列</td>
              <td class="sn-num">16</td>
              <td class="sn-num">16</td>
              <td>收进抽屉，顶栏左边出菜单按钮</td>
              <td>只剩列表，点开详情盖上来</td>
            </tr>
            <tr>
              <td>regular</td>
              <td class="sn-num">720～1199</td>
              <td class="sn-num">8 列</td>
              <td class="sn-num">24</td>
              <td class="sn-num">24（1100 起 32）</td>
              <td>图标栏 64（1100 起展开 232）</td>
              <td class="sn-num">240</td>
            </tr>
            <tr>
              <td>wide</td>
              <td class="sn-num">≥ 1200</td>
              <td class="sn-num">12 列</td>
              <td class="sn-num">24</td>
              <td class="sn-num">32（1440 起 40）</td>
              <td class="sn-num">232</td>
              <td class="sn-num">240（1280 起 280）</td>
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
