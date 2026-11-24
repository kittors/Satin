<script setup lang="ts">
import { EmptyArt } from "satin-ui/vue";

const presets = [
  { name: "projects", title: "首次使用" },
  { name: "search", title: "筛选无结果" },
  { name: "error", title: "加载失败" },
  { name: "inbox", title: "空收件箱" },
  { name: "folder", title: "空文件夹" },
  { name: "lock", title: "暂无权限" },
];
</script>

<template>
  <div class="sn-empty-presets">
    <div class="sn-empty-preset" v-for="p in presets" :key="p.name">
      <EmptyArt :name="p.name" />
      <b>{{ p.title }}</b>
      <code>{{ p.name }}</code>
    </div>
  </div>
</template>
