<script>
  import Satin from "satin-ui/svelte/Satin.svelte";
  import { createComposer, toast } from "satin-ui";
  // 点"停止"：onStop 里取消请求；onSend 返回的 Promise 结束（这里 reject）就回到可发送
  let cancel = null;
  const generate = () => new Promise((done, fail) => { const t = setTimeout(done, 5000); cancel = () => { clearTimeout(t); fail(new Error("已停止")); }; });
  const stop = () => { cancel?.(); toast({ text: "已停止生成" }); };

  // 生成中点停止，onStop 里取消
  const options = { placeholder: "描述你想要的画面", send: "生成", onSend: generate, onStop: stop };
</script>

<!-- 这个组件没有单独的 Svelte 封装：用 Satin 包 createComposer，选项写在 options 里 -->
<Satin create={createComposer} {options} />
