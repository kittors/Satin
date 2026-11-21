<script setup>
import { Button, Menu, toast } from "satin-ui/vue";

const ITEMS = [
  { label: "移动到", icon: "folder", children: [{ key: "ep1", label: "第一集" }, { key: "ep2", label: "第二集" }, { key: "ep3", label: "第三集" }] },
  { type: "divider" },
  { key: "trash", label: "移到回收站", icon: "trash-2", danger: true },
];
</script>

<template>
  <!-- @select(key, 那一项)：子菜单里的项也走这里；斜着移向子菜单时，途经的行不抢高亮 -->
  <Menu :items="ITEMS" @select="(key, it) => toast({ text: '选了：' + it.label })">
    <Button caret>整理</Button>
  </Menu>
</template>
