<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";
import { createChat } from "satin-ui/chat";

const root = ref<HTMLDivElement | null>(null);
let off = () => {};
onMounted(() => {
  if (!root.value) return;
  const unsetup = setup();
  const done = enhance(root.value, (root: any) => {
    (async () => {
      // 空容器：createChat 按选项填好标记（顶栏、消息区、底部输入框都接好了）。respond 返回异步迭代的文字片段（流式），或者直接返回一整段
      createChat(root.querySelector("#chat"), {
        title: "分镜助手", placeholder: "和分镜助手一起改这一集",
        menu: true, newChat: true, // 顶栏左边"会话列表"、右边"新对话"（单色细线图标）
        onMenu() { /* 自己接：打开会话列表（手机上用 openDrawer 从左边拉出来） */ },
        onNewChat() { /* 自己接：开一段新对话（换一个会话、清空消息） */ },
        async *respond(text) {
          const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ text }) });
          if (!res.body) return;
          const reader = res.body.getReader(), dec = new TextDecoder();
          for (;;) { const { value, done } = await reader.read(); if (done) break; yield dec.decode(value); }
        },
      });
    })();
  });
  off = () => { done(); unsetup(); };
});
onBeforeUnmount(() => off());
</script>

<template>
  <div ref="root">
    <div class="sn-page sn-wide sn-screen">
      <div id="chat"></div>
    </div>
  </div>
</template>
