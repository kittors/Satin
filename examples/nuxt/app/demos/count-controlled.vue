<script setup>
import { ref } from "vue";
import { Button, CountInput } from "satin-ui/vue";

// v-model；父组件改值，计数跟着滚
const name = ref("林夏");
</script>

<template>
  <div class="sn-row">
    <CountInput v-model="name" :max="8" id="role-name" />
    <Button size="sm" @click="name = '林夏和周屿'">换一个</Button>
  </div>
</template>
