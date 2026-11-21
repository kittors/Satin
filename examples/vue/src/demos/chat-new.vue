<script setup>
import { ref } from "vue";
import { Chat } from "satin-ui/vue/chat";

// 接模型：异步生成器一段段 yield 文字（演示用：假装是模型一点点回）
async function* respond(question, ctx) {
  const answer = `收到：“${question}”。第三集可以先拆成车站外、候车厅、站台三段，要我再细分成镜头吗？`;
  for (let i = 0; i < answer.length && !ctx.stopped; i += 2) {
    await new Promise((r) => setTimeout(r, 40));
    yield answer.slice(i, i + 2);
  }
}

// 新对话：还没有消息时正中的图标、标题、说明、建议（点了填进输入框，不直接发）
const EMPTY = { icon: "clapperboard", title: "今天拍哪一段？", subtitle: "说说这一集的想法，或者从下面挑一个开始。", suggestions: ["把第三集拆成镜头", "开头的雨夜再冷一点", "给结尾配一段钢琴"] };
// 输入框顶上的上下文栏：带 options 的那项点开是菜单
const CONTEXT = [
  { icon: "folder", text: "雨夜车站" },
  { icon: "monitor", text: "本地", options: [{ value: "local", label: "本地" }, { value: "cloud", label: "云端" }], value: "local" },
  { icon: "git-branch", text: "第三集", options: [{ value: "ep3", label: "第三集" }, { value: "ep4", label: "第四集" }], value: "ep3" },
];
// 权限：小圆点的颜色表示风险（ok 绿、need 主色、warn 橙）
const MODE = { options: [{ value: "read", label: "只读", tone: "ok" }, { value: "auto", label: "自动", tone: "need" }, { value: "full", label: "完全访问", tone: "warn" }], value: "auto" };
const MODELS = [{ value: "fine", label: "分镜模型 · 精细" }, { value: "fast", label: "分镜模型 · 快速" }];
const model = ref("fine");
</script>

<template>
  <!-- 发出第一条以后空状态淡出，输入框原地不动；换了模型、权限、上下文都有事件 -->
  <Chat title="新对话" placeholder="随心输入" :respond="respond" :empty="EMPTY"
    :context="CONTEXT" :mode="MODE" :models="MODELS" v-model:model="model" @mode-change="(v) => console.log('换了权限', v)" />
</template>
