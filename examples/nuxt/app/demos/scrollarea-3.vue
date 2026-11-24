<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import { createScrollArea } from "satin-ui/components";

const root = ref<HTMLDivElement | null>(null);
let off = () => {};
onMounted(() => {
  if (!root.value) return;
  const unsetup = setup();
  const done = enhance(root.value, (root: any) => {
    // 写在标记上的滚动区域：data-sa="y | x | both | none | top bottom…" 是渐隐方向，其余选项写成 data-sa-*（size、bar、bar-size、inset、over、wheel）
    const num = (v?: any) => (v == null || v === "" ? undefined : Number(v));
    for (const el of root.querySelectorAll("[data-sa]")) {
      const d = el.dataset;
      createScrollArea(el, { fade: d.sa || "y", wheel: d.saWheel || "auto", bar: d.saBar || "auto", overscroll: d.saOver || "auto", size: num(d.saSize), barSize: num(d.saBarSize), barInset: num(d.saInset) });
    }
    // barSize：平时多粗（px，默认 5），悬停、拖动时再粗 3px；barInset：离边多远（px，默认 1）。颜色跟主题走，要改就覆盖 --sn-sa-thumb、--sn-sa-thumb-hover
  });
  off = () => { done(); unsetup(); };
});
onBeforeUnmount(() => off());
</script>

<template>
  <div ref="root">
    <div class="sn-sa-panes">
      <div class="sn-sa-pane-f">
        <b>barSize: 3 · barInset: 1</b>
        <span>细一点，贴着边</span>
        <div class="sn-sa-card">
          <div class="sn-sa-pane" data-sa="y" data-sa-bar="always" data-sa-bar-size="3" data-sa-inset="1">
            <div class="sn-row-i">
              <b>镜头 01 · 车站外，雨刚停</b>
              <span>远景 · 3 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 02 · 林夏走进候车厅</b>
              <span>全景 · 4 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 03 · 站台上的最后一班车</b>
              <span>中景 · 5 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 04 · 车窗里的倒影</b>
              <span>近景 · 6 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 05 · 雨夜里的公交站</b>
              <span>特写 · 7 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 06 · 空荡的候车厅</b>
              <span>远景 · 3 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 07 · 天台上的风</b>
              <span>全景 · 4 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 08 · 便利店的灯</b>
              <span>中景 · 5 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 09 · 地铁口</b>
              <span>近景 · 6 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 10 · 旧城区的巷子</b>
              <span>特写 · 7 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 11 · 海边的清晨</b>
              <span>远景 · 3 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 12 · 回忆里的教室</b>
              <span>全景 · 4 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 13 · 告别</b>
              <span>中景 · 5 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 14 · 清晨的站台</b>
              <span>近景 · 6 秒</span>
            </div>
          </div>
        </div>
      </div>
      <div class="sn-sa-pane-f">
        <b>barSize: 5 · barInset: 1</b>
        <span>默认：平时 5px，悬停、拖动时再粗 3px</span>
        <div class="sn-sa-card">
          <div class="sn-sa-pane" data-sa="y" data-sa-bar="always">
            <div class="sn-row-i">
              <b>镜头 01 · 车站外，雨刚停</b>
              <span>远景 · 3 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 02 · 林夏走进候车厅</b>
              <span>全景 · 4 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 03 · 站台上的最后一班车</b>
              <span>中景 · 5 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 04 · 车窗里的倒影</b>
              <span>近景 · 6 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 05 · 雨夜里的公交站</b>
              <span>特写 · 7 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 06 · 空荡的候车厅</b>
              <span>远景 · 3 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 07 · 天台上的风</b>
              <span>全景 · 4 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 08 · 便利店的灯</b>
              <span>中景 · 5 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 09 · 地铁口</b>
              <span>近景 · 6 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 10 · 旧城区的巷子</b>
              <span>特写 · 7 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 11 · 海边的清晨</b>
              <span>远景 · 3 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 12 · 回忆里的教室</b>
              <span>全景 · 4 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 13 · 告别</b>
              <span>中景 · 5 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 14 · 清晨的站台</b>
              <span>近景 · 6 秒</span>
            </div>
          </div>
        </div>
      </div>
      <div class="sn-sa-pane-f">
        <b>barSize: 8 · barInset: 4</b>
        <span>粗一点，离边远一点（触屏、大面板）</span>
        <div class="sn-sa-card">
          <div class="sn-sa-pane" data-sa="y" data-sa-bar="always" data-sa-bar-size="8" data-sa-inset="4">
            <div class="sn-row-i">
              <b>镜头 01 · 车站外，雨刚停</b>
              <span>远景 · 3 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 02 · 林夏走进候车厅</b>
              <span>全景 · 4 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 03 · 站台上的最后一班车</b>
              <span>中景 · 5 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 04 · 车窗里的倒影</b>
              <span>近景 · 6 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 05 · 雨夜里的公交站</b>
              <span>特写 · 7 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 06 · 空荡的候车厅</b>
              <span>远景 · 3 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 07 · 天台上的风</b>
              <span>全景 · 4 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 08 · 便利店的灯</b>
              <span>中景 · 5 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 09 · 地铁口</b>
              <span>近景 · 6 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 10 · 旧城区的巷子</b>
              <span>特写 · 7 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 11 · 海边的清晨</b>
              <span>远景 · 3 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 12 · 回忆里的教室</b>
              <span>全景 · 4 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 13 · 告别</b>
              <span>中景 · 5 秒</span>
            </div>
            <div class="sn-row-i">
              <b>镜头 14 · 清晨的站台</b>
              <span>近景 · 6 秒</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
