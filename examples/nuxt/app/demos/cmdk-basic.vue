<script setup lang="ts">
import { ref } from "vue";
import { Button, CommandPalette, toast } from "satin-ui/vue";

const GROUPS = [
  { name: "动作", items: [{ name: "新建项目", icon: "plus", keys: "⌘N" }, { name: "导出成片", icon: "film", keys: "⌘E" }] },
  { name: "跳转", items: [{ name: "素材库", icon: "image" }, { name: "设置", icon: "settings", keys: "⌘," }] },
];
// v-model:open：⌘K、Esc、点外面开关都会同步
const open = ref(false);
</script>

<template>
  <Button icon="search" @click="open = true">搜索或执行命令<span class="sn-key">⌘K</span></Button>
  <CommandPalette v-model:open="open" :groups="GROUPS" @run="(it) => toast({ text: '执行：' + it.name })" />
</template>
