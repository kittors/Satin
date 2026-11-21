<script setup>
import { Button, Menu, toast } from "satin-ui/vue";

const ITEMS = [
  { key: "open", label: "打开", icon: "external-link" },
  { key: "copy", label: "复制一份", icon: "copy", kbd: "⌘D" },
  { type: "divider" },
  { key: "trash", label: "移到回收站", icon: "trash-2", danger: true },
];
</script>

<template>
  <!-- @select(key, 那一项)：点开贴着按钮弹出，↓ 键也能打开 -->
  <Menu :items="ITEMS" @select="(key, it) => toast({ text: '选了：' + it.label })">
    <Button variant="ghost" icon="ellipsis" tip="更多操作" />
  </Menu>
</template>
