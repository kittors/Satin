<script setup>
import { Composer, toast } from "satin-ui/vue";

// upload(file, progress)：真上传在这里做，progress(0～1) 更新附件上的进度环；返回 Promise
const upload = (file, progress) => new Promise((done) => { let p = 0; const t = setInterval(() => { p += 0.25; progress(Math.min(1, p)); if (p >= 1) { clearInterval(t); done(); } }, 200); });
</script>

<template>
  <Composer placeholder="描述画面，可以附上参考图" send="生成" :upload="upload" @send="({ files }) => { toast({ text: `带着 ${files.length} 个附件发送` }); }" />
</template>
