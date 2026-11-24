<script setup lang="ts">
import { Chat } from "satin-ui/vue/chat";

// 接模型：异步生成器一段段 yield 文字；用户点"停止"时 ctx.stopped 变成 true（每次读都是现在的值）
async function* respond(question: string, ctx: { readonly stopped: boolean }) {
  const answer = "第三集可以拆成三段：车站外用远景交代雨夜，候车厅放慢节奏，站台留给最后一班车。"; // 演示用的固定回答；接真模型时把 question 发过去，回来一段 yield 一段
  for (let i = 0; i < answer.length && !ctx.stopped; i += 2) {
    await new Promise((r) => setTimeout(r, 40)); // 演示用：假装是模型一点点回
    yield answer.slice(i, i + 2);
  }
}
</script>

<template>
  <!-- 输入框里的字原地变成气泡飞进列表；回答先进缓冲、匀速流出，随时能点"停止" -->
  <Chat title="分镜助手" placeholder="问点什么…" :respond="respond" />
</template>
