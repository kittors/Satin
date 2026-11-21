<script setup>
import { ref } from "vue";
import { Button } from "satin-ui/vue";

const on = ref(true);
</script>

<template>
  <div class="sn-row">
    <Button variant="ghost" icon="layout-grid" :selected="on" :aria-pressed="on" :tip="on ? '网格（已打开）' : '网格（已关上）'" @click="on = !on" />
  </div>
</template>
