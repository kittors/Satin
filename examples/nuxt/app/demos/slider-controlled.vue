<script setup lang="ts">
import { ref } from "vue";
import { Slider } from "satin-ui/vue";

const value = ref(72);
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Slider v-model="value" :max="100" label="不透明度" />
    <span class="sn-help">不透明度 {{ value }}%</span>
  </div>
</template>
