<script setup lang="ts">
import { Markdown } from "satin-ui/vue/markdown";

const MD = [
  "### 分镜脚本",
  "",
  "```ts title=storyboard.ts maxh=120",
  "scene(7, \"镜头 07\", { size: \"远景\", sec: 6 });",
  "scene(8, \"镜头 08\", { size: \"全景\", sec: 3 });",
  "scene(9, \"镜头 09\", { size: \"中景\", sec: 4 });",
  "scene(10, \"镜头 10\", { size: \"特写\", sec: 5 });",
  "scene(11, \"镜头 11\", { size: \"近景\", sec: 6 });",
  "scene(12, \"镜头 12\", { size: \"远景\", sec: 3 });",
  "scene(13, \"镜头 13\", { size: \"全景\", sec: 4 });",
  "scene(14, \"镜头 14\", { size: \"中景\", sec: 5 });",
  "scene(15, \"镜头 15\", { size: \"特写\", sec: 6 });",
  "scene(16, \"镜头 16\", { size: \"近景\", sec: 3 });",
  "scene(17, \"镜头 17\", { size: \"远景\", sec: 4 });",
  "scene(18, \"镜头 18\", { size: \"全景\", sec: 5 });",
  "```",
  "",
  "![雨夜里的电车](https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=960&q=72)",
  "",
  "| 镜头 | 景别 | 时长 |",
  "| --- | --- | ---: |",
  "| 07 | 远景 | 6 秒 |",
  "| 08 | 全景 | 3 秒 |",
  "| 09 | 中景 | 4 秒 |",
  "| 10 | 特写 | 5 秒 |",
  "| 11 | 近景 | 6 秒 |",
  "| 12 | 远景 | 3 秒 |",
  "| 13 | 全景 | 4 秒 |",
  "| 14 | 中景 | 5 秒 |",
  "| 15 | 特写 | 6 秒 |",
  "| 16 | 近景 | 3 秒 |",
  "| 17 | 远景 | 4 秒 |",
  "| 18 | 全景 | 5 秒 |",
].join("\n");
</script>

<template>
  <!-- 代码超过上限折叠（这一块在信息行写了 maxh=120），图片统一 160px 高，表格最高 160px、超出在框里滚 -->
  <Markdown :source="MD" :code-max="240" :img-h="160" :table-max="160" />
</template>
