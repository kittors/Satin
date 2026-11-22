<script setup>
import { ref } from "vue";
import { Sidebar } from "satin-ui/vue";

const NAV = [
  { key: "all", label: "全部项目", icon: "layout-grid" },
  { key: "assets", label: "素材库", icon: "image", badge: 12 },
  { type: "group", label: "最近打开" },
  { key: "p1", label: "雨夜车站", icon: "folder" },
  { key: "p2", label: "候车厅", icon: "folder" },
];
const FOOTER = [{ key: "settings", label: "设置", icon: "settings" }];
const TITLE = { all: "全部项目", assets: "素材库", p1: "雨夜车站", p2: "候车厅", settings: "设置" };
// v-model 绑选中的 key
const page = ref("all");
</script>

<template>
  <div style="height: 320px">
    <Sidebar style="height: 100%" v-model="page" title="Satin" :items="NAV" :footer="FOOTER">
      <div class="sn-app-head"><b>{{ TITLE[page] }}</b></div>
    </Sidebar>
  </div>
</template>
