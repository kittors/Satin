# AI 对话

结构：对话框占满一屏：顶栏（左边会话列表、中间标题、右边新对话）→ 消息区（虚拟列表、流式输出、跳到最新）→ 底部提示词输入框（附件、用量环、发送 / 停止）。对话框的顶栏就是页面标题，外面不再放同名的页头；顶栏不写"在线"这类状态，思考、步骤、正文在消息里自己会显示。
用 `satin-ui/chat` 的 `createChat`，不要自己写消息气泡和滚动：它已经处理了流式输出匀速放字、贴底跟随、往上翻加载历史、发送动画、减少动态效果。
外面一层 `.sn-page.sn-screen`（整屏页面）：桌面上四周留白，对话填满一屏，整页不滚；手机上（窄于 640）页面没有边距，html、body 的底色跟对话一样，对话铺满整个屏幕——顶栏紧贴状态栏、输入框在底部横条上面，左右贴边，四周不露灰。

```html
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<!-- 对话框自己带顶栏（会话列表、标题、新对话）：外面不要再放一个写着同样名字的页头 -->
<div class="sn-page sn-wide sn-screen">
  <div id="chat"></div>
</div>
<script type="module">
  import { setup } from "satin-ui";
  import { createChat } from "satin-ui/chat";
  setup();
  // 空容器：createChat 按选项填好标记（顶栏、消息区、底部输入框都接好了）。respond 返回异步迭代的文字片段（流式），或者直接返回一整段
  createChat(document.getElementById("chat"), {
    title: "分镜助手", placeholder: "和分镜助手一起改这一集",
    menu: true, newChat: true, // 顶栏左边"会话列表"、右边"新对话"（单色细线图标）
    onMenu() { /* 自己接：打开会话列表（手机上用 openDrawer 从左边拉出来） */ },
    onNewChat() { /* 自己接：开一段新对话（换一个会话、清空消息） */ },
    async *respond(text) {
      const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ text }) });
      const reader = res.body.getReader(), dec = new TextDecoder();
      for (;;) { const { value, done } = await reader.read(); if (done) break; yield dec.decode(value); }
    },
  });
</script>
```

`viewport-fit=cover` 一定要写：不写的话 iPhone 上页面不延伸到状态栏和底部横条后面，上下各露一条浏览器的底色。状态栏、横条让出来的高度由对话自己加（`env(safe-area-inset-*)`），外面不要再垫内边距。
对话放在别的布局里（侧栏右边的主区、弹窗里）时，给它的容器一个高度（`flex: 1` 或者 `height: 100%`）就行，对话填满容器，不写死高度。
顶栏两侧的按钮：`menu: true` 左边出"会话列表"、`newChat: true` 右边出"新对话"，点了发 `menu` / `newChat` 事件（选项里写 `onMenu` / `onNewChat`）；手机上三栏、标题居中，按钮 40×40。不要的话不写这两项，顶栏只剩标题。
React：`import { Chat } from "satin-ui/react/chat"`，然后 `<Chat title="分镜助手" menu newChat onMenu={openList} onNewChat={startNew} respond={respond} />`，挂载、卸载都处理好了。
Vue：`import { Chat } from "satin-ui/vue/chat"`，然后 `<Chat title="分镜助手" menu new-chat @menu="openList" @new-chat="startNew" :respond="respond" />`。
自己在 `useEffect` / `onMounted` 里调 `createChat(空 div, 选项)` 也行，卸载时一定调返回值的 `destroy()`。
只要一个输入框（不要对话列表）：`createComposer(空容器, { placeholder, onSend({ text, files }) })`（React 里同样在 effect 里调）。
消息里有 Markdown：助手回复按 Markdown 渲染（代码块、表格、公式），不用自己处理。
回复直接给结果：不复述用户的话，不用"好的！""当然可以！"开头；演示用的假回复也一样。
