<script setup lang="ts">
import { ref } from "vue";
import { Input } from "satin-ui/vue";

const name = ref("");
</script>

<template>
  <Input v-model="name" placeholder="比如：雨夜车站" aria-label="项目名称" />
</template>
