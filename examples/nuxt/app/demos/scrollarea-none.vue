<script setup lang="ts">
import { ScrollArea } from "satin-ui/vue";

const SCENES = ["车站外", "候车厅", "站台", "车厢里", "雨夜", "回忆", "告别", "清晨", "天台", "便利店", "隧道", "海边", "旧书店", "医院走廊", "末班地铁", "屋檐下", "桥上", "片尾"];
</script>

<template>
  <!-- fade="none" 不要渐隐；overscroll="contain" 滚到头不带着外面的页面一起滚 -->
  <ScrollArea fade="none" overscroll="contain" style="max-height: 160px">
    <p v-for="(s, i) in SCENES" :key="s">第 {{ i + 1 }} 场 · {{ s }}</p>
  </ScrollArea>
</template>
