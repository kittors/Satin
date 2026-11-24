<script setup lang="ts">
import { Composer, toast } from "satin-ui/vue";

// 发送以后返回 Promise：按钮变成"停止"、外圈转动；Promise 结束回到可发送
const generate = ({ text }: { text: string }) => new Promise<void>((done) => setTimeout(() => { toast({ text: "已生成 4 张画面" }); done(); }, 2000));
</script>

<template>
  <!-- @send 返回 Promise：发送后按钮变成"停止"，结束回到可发送 -->
  <Composer placeholder="描述你想要的画面，比如：雨夜，林夏站在空荡的站台上" :max="300" send="生成" @send="generate" />
</template>
