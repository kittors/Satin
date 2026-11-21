<script setup>
import { Sidebar } from "satin-ui/vue";

const NAV = [
  { key: "all", label: "全部项目", icon: "layout-grid" },
  { key: "assets", label: "素材库", icon: "image", badge: 12 },
  { type: "group", label: "最近打开" },
  { key: "p1", label: "雨夜车站", icon: "folder" },
  { key: "p2", label: "候车厅", icon: "folder" },
];
const FOOTER = [{ key: "settings", label: "设置", icon: "settings" }];
</script>

<template>
  <!-- fx 选中的切换样子：slide 底色滑过去（默认）/ bar 左边指示条 / fade 原地淡入 / text 只换文字颜色 -->
  <div style="height: 320px">
    <Sidebar title="Satin" :items="NAV" :footer="FOOTER" model-value="assets" fx="bar">
      <div class="sn-app-head"><b>素材库</b></div>
    </Sidebar>
  </div>
</template>
