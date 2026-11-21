<script setup>
import { ref } from "vue";
import { Email } from "satin-ui/vue";

const mail = ref("");
</script>

<template>
  <!-- v-model；格式对了右边的对勾一笔画出来 -->
  <Email v-model="mail" label="通知邮箱" placeholder="name@example.com" id="notify-email" />
</template>
