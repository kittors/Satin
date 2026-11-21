<script setup>
import { ref } from "vue";
import { Input } from "satin-ui/vue";

const name = ref("雨夜车站");
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Input v-model="name" :invalid="name.length > 12" aria-label="项目名称" />
    <span class="sn-help">{{ name.length }} / 12 个字</span>
  </div>
</template>
