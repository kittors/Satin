<script setup>
import { ContextMenu, toast } from "satin-ui/vue";

const ITEMS = [
  { key: "open", label: "打开", icon: "external-link" },
  { key: "copy", label: "复制一份", icon: "copy", kbd: "⌘D" },
  { type: "divider" },
  { key: "trash", label: "移到回收站", icon: "trash-2", danger: true },
];
const DONE = { open: "已打开", copy: "已复制一份", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）
</script>

<template>
  <!-- @select(key, 那一项)：右键、触屏长按、Shift+F10 在指针处弹出 -->
  <ContextMenu :items="ITEMS" @select="(key) => toast({ text: DONE[key] })">
    <div class="sn-ctx-zone" tabindex="0" aria-label="镜头卡片，按 Shift+F10 打开菜单">在这里点右键</div>
  </ContextMenu>
</template>
