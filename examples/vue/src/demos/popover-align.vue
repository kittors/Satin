<script setup lang="ts">
import { Button, Popover } from "satin-ui/vue";
</script>

<template>
  <!-- align="end"：面板和按钮右边对齐（按钮靠右时用，面板不会伸出窗口） -->
  <Popover align="end" title="画面比例说明">
    <Button variant="ghost" icon="info" tip="画面比例说明" />
    <template #content>
      <p>导出的成片按这个比例裁切；竖屏适合手机上看。</p>
    </template>
  </Popover>
</template>
