<script setup lang="ts">
import { Button, Segmented } from "satin-ui/vue";
</script>

<template>
  <div class="sn-row">
    <Segmented :items='["全部", "进行中", "已完成"]' value="全部" size="sm" label="状态" />
    <Button size="sm">导出</Button>
  </div>
</template>
