<script setup lang="ts">
import { Button } from "satin-ui/vue";
</script>

<template>
  <div class="sn-row">
    <Button variant="primary" icon="plus">新建项目</Button>
    <Button icon-after="arrow-right">下一步</Button>
    <!-- 只有图标：tip 同时写成 aria-label -->
    <Button variant="ghost" icon="settings" tip="设置" />
    <Button variant="ghost" icon="layout-grid" tip="网格视图" selected />
  </div>
</template>
