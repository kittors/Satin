<script setup>
import { ref } from "vue";
import { Button, NumberFlow } from "satin-ui/vue";

const n = ref(128);
</script>

<template>
  <div class="sn-row">
    <!-- value 变了只动变了的那几位 -->
    <NumberFlow :value="n" />
    <Button size="sm" @click="n += 1">+1</Button>
    <Button size="sm" @click="n -= 12">-12</Button>
  </div>
</template>
