<script setup>
import { ref } from "vue";
import { Button } from "satin-ui/vue";

const saving = ref(false), saved = ref(false);
// 换成真实的请求，比如 fetch("/api/projects/42", { method: "PUT" })
const request = () => new Promise((done) => setTimeout(done, 1200));
async function save() {
  saving.value = true;
  try {
    await request();
    saved.value = true;
    setTimeout(() => (saved.value = false), 1500); // 对勾留 1.5 秒
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <!-- loading：300ms 内回来不转圈，转圈出现后至少留 500ms；done：转圈收起以后原地打勾 -->
  <Button variant="primary" :loading="saving" :done="saved" @click="save">保存修改</Button>
</template>
