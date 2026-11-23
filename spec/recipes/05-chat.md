# AI 对话

全屏 AI 对话界面：顶栏会话切换、流式消息区与底部提示词输入框。

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

用 `satin-ui/chat` 的 `createChat`（React `<Chat>` / Vue `<SnChat>`）自动处理匀速流式输出、贴底跟随、历史分页、Markdown/公式渲染与安全区留白，无需手写气泡和滚动。
外层 `.sn-page.sn-screen` + `viewport-fit=cover`：桌面四周留白填满一屏，手机自动贴边铺满全屏；嵌入侧栏主区或弹窗时只给容器 `flex: 1` 或 `height: 100%`。
顶栏自带标题、左侧会话菜单（`menu: true`）与右侧新对话（`newChat: true`），外面不再重复放同名页头。
只需底部输入框时可用 `createComposer(el, { placeholder, onSend })`。
