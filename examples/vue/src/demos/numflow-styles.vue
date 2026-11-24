<script setup lang="ts">
import { ref } from "vue";
import { Button, NumberFlow } from "satin-ui/vue";

const n = ref(2026);
</script>

<template>
  <div class="sn-row">
    <!-- value 变了只动变了的那几位；effect 换变化的样子：roll 滚动（默认）/ blur 模糊 / push 推入 / fade 淡入 -->
    <NumberFlow :value="n" effect="blur" />
    <Button size="sm" @click="n += 137">+137</Button>
  </div>
</template>
