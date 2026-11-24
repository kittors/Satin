<script setup lang="ts">
import { ref } from "vue";
import { Button, Icon } from "satin-ui/vue";

const closed = ref(false);
</script>

<template>
  <!-- 关掉：外层加 sn-closing，高度收起、下面的内容跟着上来 -->
  <div class="sn-banner-wrap" :class="{ 'sn-closing': closed }">
    <div class="sn-banner" role="status">
      <Icon name="download" />
      <div class="sn-msg">新版本 1.5 已经下载好，重启后生效。</div>
      <Button size="sm">重启</Button>
      <Button variant="ghost" size="sm" icon="x" tip="关闭" @click="closed = true" />
    </div>
  </div>
</template>
