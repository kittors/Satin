<script setup>
import { ref } from "vue";
import { CountInput, Field } from "satin-ui/vue";

const title = ref("");
</script>

<template>
  <!-- 聚焦或有内容时右边淡入"已写 / 上限"；写到 90% 变成提醒色，写满再敲时计数抖一下 -->
  <Field label="镜头标题" for="shot-title">
    <CountInput v-model="title" :max="20" placeholder="一句话说清这个镜头" id="shot-title" size="lg" />
  </Field>
</template>
