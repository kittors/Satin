<script setup lang="ts">
import { Input } from "satin-ui/vue";
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Input size="sm" placeholder="小号 sm" aria-label="小号" />
    <Input placeholder="默认 md" aria-label="默认" />
    <Input size="lg" placeholder="大号 lg" aria-label="大号" />
    <Input size="xl" placeholder="特大 xl" aria-label="特大" />
  </div>
</template>
