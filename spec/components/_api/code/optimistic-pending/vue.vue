<script setup lang="ts">
import { ref } from "vue";
import { toast } from "satin-ui";
import { Button } from "satin-ui/vue";

// 演示用的付款：1.2 秒后成功；换成真实的请求
const pay = () => new Promise((done) => setTimeout(done, 1200));
const paying = ref(false), paid = ref(false);
async function onPay() {
  // 付款、永久删除、发给别人的操作不用乐观更新：等服务器确认，按钮转圈、不能连点
  paying.value = true;
  try {
    await pay();
    paid.value = true;
    setTimeout(() => (paid.value = false), 1500); // 对勾留 1.5 秒
    toast({ text: "已支付 ¥68" });
  } finally {
    paying.value = false;
  }
}
</script>

<template>
  <!-- loading：300ms 内回来不转圈，转圈出现后至少留 500ms；done：转圈收起以后原地打勾 -->
  <Button variant="primary" :loading="paying" :done="paid" @click="onPay">支付 ¥68</Button>
</template>
