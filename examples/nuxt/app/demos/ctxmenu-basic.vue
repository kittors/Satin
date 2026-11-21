<script setup>
import { Button, Menu, toast } from "satin-ui/vue";

const ITEMS = [
  { key: "open", label: "打开", icon: "external-link" },
  { key: "copy", label: "复制一份", icon: "copy", kbd: "⌘D" },
  { type: "divider" },
  { key: "trash", label: "移到回收站", icon: "trash-2", danger: true },
];
const DONE = { open: "已打开", copy: "已复制一份", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）
</script>

<template>
  <!-- @select(key, 那一项)：点开贴着按钮弹出，↓ 键也能打开 -->
  <Menu :items="ITEMS" @select="(key) => toast({ text: DONE[key] })">
    <Button variant="ghost" icon="ellipsis" tip="更多操作" />
  </Menu>
</template>
