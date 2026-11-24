<script setup lang="ts">
import { Button, EmptyArt } from "satin-ui/vue";
</script>

<template>
  <div class="sn-empty-state">
    <EmptyArt name="projects" />
    <h4>还没有项目</h4>
    <p>新建或导入原文即可开始。</p>
    <div class="sn-acts">
      <Button variant="primary" icon="plus">新建项目</Button>
      <Button variant="secondary">导入原文</Button>
    </div>
  </div>
</template>
