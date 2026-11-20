# AI 对话

结构：对话框占满主区高度：顶栏（助手名字、状态）→ 消息区（虚拟列表、流式输出、跳到最新）→ 底部提示词输入框（附件、用量环、发送 / 停止）。对话框的顶栏就是页面标题，外面不再放同名的页头。
用 `satin-ui/chat` 的 `createChat`，不要自己写消息气泡和滚动：它已经处理了流式输出匀速放字、贴底跟随、往上翻加载历史、发送动画、减少动态效果。

```html
<!-- 对话框自己带顶栏（名字、状态、条数）：外面不要再放一个写着同样名字的页头 -->
<div class="sn-page sn-wide" style="height: 100dvh; padding-block: var(--sn-sp-16)">
  <div id="chat" style="height: 100%"></div>
</div>
<script type="module">
  import { setup } from "satin-ui";
  import { createChat } from "satin-ui/chat";
  setup();
  // 空容器：createChat 按选项填好标记（顶栏、消息区、底部输入框都接好了）。respond 返回异步迭代的文字片段（流式），或者直接返回一整段
  createChat(document.getElementById("chat"), {
    title: "分镜助手", placeholder: "和分镜助手一起改这一集",
    async *respond(text) {
      const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ text }) });
      const reader = res.body.getReader(), dec = new TextDecoder();
      for (;;) { const { value, done } = await reader.read(); if (done) break; yield dec.decode(value); }
    },
  });
</script>
```

React：`const Chat = wrapSatin(createChat, { events: [] })`（`satin-ui/react`），然后 `<Chat title="分镜助手" respond={respond} />`，挂载、卸载都处理好了。
Vue：`const SnChat = wrapSatin(createChat, { name: "SnChat", props: ["title", "placeholder", "respond"], events: [] })`（`satin-ui/vue`）。
自己在 `useEffect` / `onMounted` 里调 `createChat(空 div, 选项)` 也行，卸载时一定调返回值的 `destroy()`。
只要一个输入框（不要对话列表）：`createComposer(空容器, { placeholder, onSend({ text, files }) })`（React 里同样在 effect 里调）。
消息里有 Markdown：助手回复按 Markdown 渲染（代码块、表格、公式），不用自己处理。
