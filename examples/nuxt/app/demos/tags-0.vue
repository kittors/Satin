<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import { Avatar as SnAvatar } from "satin-ui/vue";
import "./tags-0.css";

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
    <div class="grid-m lc">
      <span class="sn-cap">状态标签</span>
      <div class="row">
        <span class="sn-tag"><i></i>草稿</span>
        <span class="sn-tag sn-run"><i></i>生成中</span>
        <span class="sn-tag sn-ok"><i></i>已完成</span>
        <span class="sn-tag sn-warn"><i></i>待审核</span>
        <span class="sn-tag sn-bad"><i></i>失败</span>
        <span class="sn-tag sn-sm sn-ok"><i></i>小号</span>
      </div>
      <span class="sn-cap">数量与圆点</span>
      <div class="row" style="gap:20px">
        <span class="sn-badge">3</span>
        <span class="sn-badge">99+</span>
        <span class="sn-badge sn-soft">12</span>
        <button class="sn-btn sn-ghost sn-ibtn" data-tip="通知" data-i="bell">
          <span class="sn-dot"></span>
        </button>
        <span class="sn-t-callout">素材库<span class="sn-badge sn-soft" style="margin-left:6px">新</span></span>
      </div>
      <span class="sn-cap">头像</span>
      <div class="row" style="gap:14px">
        <SnAvatar seed="u3" name="林夏" :size='20' />
        <SnAvatar seed="u4" name="周屿" :size='24' />
        <SnAvatar seed="u8" name="陈默" />
        <SnAvatar seed="u11" name="许诺" :size='40' />
        <SnAvatar seed="u5" name="李然" :size='40' online />
      </div>
      <span class="sn-cap">头像组</span>
      <div class="row">
        <div class="sn-av-group" tabindex="0" data-tip="林夏、周屿、陈默、许诺 等 7 人">
          <SnAvatar seed="u3" name="林夏" :size='24' decorative />
          <SnAvatar seed="u4" name="周屿" :size='24' decorative />
          <SnAvatar seed="u8" name="陈默" :size='24' decorative />
          <SnAvatar seed="u11" name="许诺" :size='24' decorative />
          <span class="sn-av sn-sm sn-more">+3</span>
        </div>
        <span class="sn-note">悬停时散开，能看清每一个</span>
      </div>
    </div>
  </div>
</template>
