<script setup>
import { Composer, toast } from "satin-ui/vue";

// 点"停止"：onStop 里取消请求；onSend 返回的 Promise 结束（这里 reject）就回到可发送
let cancel = null;
const generate = () => new Promise((done, fail) => { const t = setTimeout(done, 5000); cancel = () => { clearTimeout(t); fail(new Error("已停止")); }; });
const stop = () => { cancel?.(); toast({ text: "已停止生成" }); };
</script>

<template>
  <Composer placeholder="描述你想要的画面" send="生成" @send="generate" @stop="stop" />
</template>
