<script setup lang="ts">
import { ref } from "vue";
import { Otp } from "satin-ui/vue";

const note = ref("输入 6 位验证码");
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <!-- 填满就拿整串数字去校验（换成真实的请求） -->
    <Otp :length="6" @complete="(code) => (note = `正在校验 ${code}…`)" />
    <span class="sn-help">{{ note }}</span>
  </div>
</template>
