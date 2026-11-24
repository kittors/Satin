<script setup lang="ts">
import { Avatar } from "satin-ui/vue";

const sizes = [16, 20, 24, 32, 40, 64];
</script>

<template>
  <div class="sn-row">
    <Avatar v-for="size in sizes" :key="size" name="张伟" :size="size" />
  </div>
</template>
