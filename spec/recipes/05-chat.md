# AI 对话

结构：对话框占满主区高度：顶栏（助手名字、状态）→ 消息区（虚拟列表、流式输出、跳到最新）→ 底部提示词输入框（附件、用量环、发送 / 停止）。
用 `satin-ui/chat` 的 `mountChat`，不要自己写消息气泡和滚动：它已经处理了流式输出匀速放字、贴底跟随、往上翻加载历史、发送动画、减少动态效果。

```html
<div class="sn-page sn-wide" style="height: 100dvh; display: grid; grid-template-rows: auto minmax(0, 1fr)">
  <header class="sn-page-hd"><div><h1>分镜助手</h1><p>改剧本、拆镜头、写画面描述</p></div></header>
  <div id="chat" style="min-height: 0"></div>
</div>
<script type="module">
  import { setup } from "satin-ui";
  import { mountChat } from "satin-ui/chat";
  setup();
  // 空容器：mountChat 按选项填好标记。respond 返回异步迭代的文字片段（流式），或者直接返回一整段
  mountChat(document.getElementById("chat"), {
    title: "分镜助手", placeholder: "和分镜助手一起改这一集",
    async *respond(text) {
      const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ text }) });
      const reader = res.body.getReader(), dec = new TextDecoder();
      for (;;) { const { value, done } = await reader.read(); if (done) break; yield dec.decode(value); }
    },
  });
</script>
```

React / Vue：在 `useEffect` / `onMounted` 里对一个空 `<div>` 调 `mountChat`，返回的实例在卸载时不用管（容器移除后监听会跟着失效）；或者整块用纯 HTML 写在一个组件里。
只要一个输入框（不要对话列表）：`createComposer(空容器, { placeholder, onSend({ text, files }) })`（React 里同样在 effect 里调）。
消息里有 Markdown：助手回复按 Markdown 渲染（代码块、表格、公式），不用自己处理。
