<script setup>
import { ref } from "vue";
import { Button, CommandPalette, toast } from "satin-ui/vue";

const GROUPS = [
  { name: "最近打开", items: [{ name: "雨夜车站", icon: "folder", sub: "第三集 · 3 分钟前" }, { name: "候车厅", icon: "folder", sub: "第一集 · 昨天" }] },
];
const open = ref(false);
</script>

<template>
  <Button icon="clock" @click="open = true">最近打开</Button>
  <!-- :hotkey="false"：页面里 ⌘K 已经有别的用处时关掉快捷键，只从按钮打开；sub 写在每条右边 -->
  <CommandPalette v-model:open="open" :groups="GROUPS" :hotkey="false" placeholder="搜索最近打开的项目" @run="(it) => toast({ text: '打开：' + it.name })" />
</template>
