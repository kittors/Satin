<script setup>
import { Stepper } from "satin-ui/vue";
</script>

<template>
  <Stepper :value="4" :min="1" :max="60" unit="秒" label="镜头时长" />
</template>
