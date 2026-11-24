<script setup lang="ts">
import { ref } from "vue";
import { Pager } from "satin-ui/vue";

const page = ref(1);
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Pager v-model="page" :total="13" :count="128" />
    <span class="sn-help">第 {{ page }} 页</span>
  </div>
</template>
