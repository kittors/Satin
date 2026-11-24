<script setup lang="ts">
import { ref } from "vue";
import { Radio } from "satin-ui/vue";

const quality = ref("standard");
</script>

<template>
  <div class="sn-stack sn-gap-8" role="radiogroup" aria-label="画质">
    <Radio v-model="quality" name="quality" value="standard" label="标准画质" />
    <Radio v-model="quality" name="quality" value="high" label="高画质" />
    <Radio v-model="quality" name="quality" value="max" label="最高画质（更慢）" />
  </div>
</template>
