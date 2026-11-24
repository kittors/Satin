<script lang="ts">
  import Satin from "satin-ui/svelte/Satin.svelte";
  import { createComposer, toast } from "satin-ui";
  // upload(file, progress)：真上传在这里做，progress(0～1) 更新附件上的进度环；返回 Promise
  const upload = (_file: File, progress: (p: number) => void) => new Promise<void>((done) => { let p = 0; const t = setInterval(() => { p += 0.25; progress(Math.min(1, p)); if (p >= 1) { clearInterval(t); done(); } }, 200); });

  // 拖进来、粘贴截图、点 + 都能加附件
  const options = { placeholder: "描述画面，可以附上参考图", send: "生成", upload, onSend: ({ files }) => { toast({ text: `带着 ${files.length} 个附件发送` }); } };
</script>

<!-- 这个组件没有单独的 Svelte 封装：用 Satin 包 createComposer，选项写在 options 里 -->
<Satin create={createComposer} {options} />
