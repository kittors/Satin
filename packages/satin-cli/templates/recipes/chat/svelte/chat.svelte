<script>
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import { createChat } from "satin-ui/chat";

  let root;
  onMount(() => {
    const unsetup = setup();
    const off = enhance(root, (root) => {
      (async () => {
        // 空容器：createChat 按选项填好标记（顶栏、消息区、底部输入框都接好了）。respond 返回异步迭代的文字片段（流式），或者直接返回一整段
        createChat(root.querySelector("#chat"), {
          title: "分镜助手", placeholder: "和分镜助手一起改这一集",
          async *respond(text) {
            const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ text }) });
            const reader = res.body.getReader(), dec = new TextDecoder();
            for (;;) { const { value, done } = await reader.read(); if (done) break; yield dec.decode(value); }
          },
        });
      })();
    });
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div class="sn-page sn-wide" style="height: 100dvh; padding-block: var(--sn-sp-16)">
    <div id="chat" style="height: 100%"></div>
  </div>
</div>
