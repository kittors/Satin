<script lang="ts">
  import Satin from "satin-ui/svelte/Satin.svelte";
  import { createComposer, toast } from "satin-ui";
  // 发送以后返回 Promise：按钮变成"停止"、外圈转动；Promise 结束回到可发送
  const generate = ({ text }: { text: string }) => new Promise<void>((done) => setTimeout(() => { toast({ text: "已生成 4 张画面" }); done(); }, 2000));

  // 有内容时发送按钮才亮；⌘↵ 也能发送
  const options = {
    placeholder: "描述你想要的画面，比如：雨夜，林夏站在空荡的站台上",
    max: 300,
    send: "生成",
    onSend: generate,
  };
</script>

<!-- 这个组件没有单独的 Svelte 封装：用 Satin 包 createComposer，选项写在 options 里 -->
<Satin create={createComposer} {options} />
