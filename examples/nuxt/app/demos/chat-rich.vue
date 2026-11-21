<script setup>
import { Chat } from "satin-ui/vue/chat";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
// 演示用：一段文字几个字一组流出（换成模型的流式输出）
async function* words(text, ctx) { for (let i = 0; i < text.length && !ctx.stopped; i += 3) { await wait(40); yield text.slice(i, i + 3); } }
const CARDS = [["03", "远景 · 4 秒", "雨刚停，积水里的路灯", "url(https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=640&q=72) center / cover"], ["04", "全景 · 6 秒", "她收起伞走进候车厅", "url(https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=640&q=72) center / cover"]];
// 先思考（灰字流出，正文一来就收起），再列步骤，再出正文、镜头卡片和生成的画面；ctx.stopped 变成 true 就尽快结束
async function* respond(question, ctx) {
  for await (const t of words("先看开头几个镜头的色调，再按雨夜的冷色调。", ctx)) yield { think: t };
  yield { step: { t: "读取第三集的 48 个镜头", s: "run" } };
  await wait(600);
  if (ctx.stopped) return;
  yield { stepUpdate: { index: 0, s: "done" } };
  yield* words("改好了：开头两个镜头的色温都降了，雨夜更冷一些。", ctx);
  for (const card of CARDS) { await wait(150); if (ctx.stopped) return; yield { card }; }
  yield { image: { g: "url(https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=640&q=72) center / cover" } };
  for (let p = 0.1; p <= 1 && !ctx.stopped; p += 0.1) { await wait(120); yield { imageProgress: p }; }
  if (!ctx.stopped) yield { imageDone: true };
}
</script>

<template>
  <!-- respond 除了文字还能 yield { think }、{ step }、{ stepUpdate }、{ card }、{ image } / { imageProgress } / { imageDone } -->
  <Chat title="分镜助手" placeholder="比如：把开头调冷一点" :respond="respond" />
</template>
