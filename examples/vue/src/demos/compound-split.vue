<script setup>
import { Button, Menu, toast } from "satin-ui/vue";

const FORMATS = [
  { type: "group", label: "导出为" },
  { key: "1080p", label: "MP4（1080p）", icon: "film" },
  { key: "4k", label: "MP4（4K）", icon: "film" },
  { key: "frames", label: "逐帧图片", icon: "image" },
];
</script>

<template>
  <!-- 分裂按钮：主按钮做最常用的那一种，右边的箭头打开别的选项 -->
  <div class="sn-group sn-split">
    <Button variant="primary" @click="toast({ text: '开始导出 1080p' })">导出成片</Button>
    <Menu :items="FORMATS" align="end" label="导出为" @select="(key, it) => toast({ text: '开始导出 ' + it.label })">
      <Button variant="primary" class="sn-more" icon="chevron-down" tip="更多导出方式" />
    </Menu>
  </div>
</template>
