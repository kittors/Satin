<script setup>
import { ref } from "vue";
import { Stepper } from "satin-ui/vue";

const value = ref(3);
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Stepper v-model="value" :min="1" :max="12" unit="集" label="集数" />
    <span class="sn-help">预计生成 {{ value * 24 }} 个镜头</span>
  </div>
</template>
