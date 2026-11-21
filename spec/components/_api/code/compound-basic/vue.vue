<script setup>
import { Button } from "satin-ui/vue";
</script>

<template>
  <!-- .sn-group：相关的几个按钮连成一组（共用圆角、中间不留缝） -->
  <div class="sn-row">
    <div class="sn-group" role="group" aria-label="切换镜头">
      <Button icon="chevron-left" tip="上一个" />
      <Button icon="chevron-right" tip="下一个" />
    </div>
    <div class="sn-group" role="group" aria-label="缩放">
      <Button size="sm" icon="minus" tip="缩小" />
      <Button size="sm" class="sn-num" style="width: 56px">100%</Button>
      <Button size="sm" icon="plus" tip="放大" />
    </div>
  </div>
</template>
