<script setup lang="ts">
import { Button, EmptyArt } from "satin-ui/vue";
</script>

<template>
  <div class="sn-empty-state">
    <EmptyArt name="error" />
    <h4>暂时无法加载</h4>
    <p>连接已中断，网络恢复后自动重试。</p>
    <div class="sn-acts">
      <Button variant="secondary">重试</Button>
    </div>
  </div>
</template>
