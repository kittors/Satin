<script setup lang="ts">
import { Button, Menu, toast } from "satin-ui/vue";

const ITEMS = [
  { label: "移动到", icon: "folder", children: [{ key: "ep1", label: "第一集" }, { key: "ep2", label: "第二集" }, { key: "ep3", label: "第三集" }] },
  { type: "divider" },
  { key: "trash", label: "移到回收站", icon: "trash-2", danger: true },
];
const DONE: Record<string, string> = { ep1: "已移到第一集", ep2: "已移到第二集", ep3: "已移到第三集", trash: "已移到回收站" }; // 每一项做完的提示（演示用轻提示代替真的操作）
</script>

<template>
  <!-- @select(key, 那一项)：子菜单里的项也走这里；斜着移向子菜单时，途经的行不抢高亮 -->
  <Menu :items="ITEMS" @select="(key) => toast({ text: DONE[key] })">
    <Button caret>整理</Button>
  </Menu>
</template>
