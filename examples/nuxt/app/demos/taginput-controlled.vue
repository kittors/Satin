<script setup>
import { ref } from "vue";
import { TagInput } from "satin-ui/vue";

const tags = ref(["悬疑", "长镜头"]);
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <TagInput v-model="tags" :max="5" placeholder="输入关键词，回车确认" />
    <span class="sn-help">已添加 {{ tags.length }} / 5 个</span>
  </div>
</template>
