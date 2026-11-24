<script setup lang="ts">
import { Icon } from "satin-ui/vue";
</script>

<template>
  <div class="sn-banner-wrap"><div class="sn-banner sn-warn" role="status"><Icon name="triangle-alert" /><div class="sn-msg"><b>额度只剩 10%</b>，用完后新的生成会排队，不会丢失。</div><button type="button" class="sn-btn sn-secondary sn-sm">查看额度</button></div></div>
</template>
