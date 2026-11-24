<script setup lang="ts">
import { Button } from "satin-ui/vue";
</script>

<template>
  <div class="sn-row">
    <Button variant="ghost" icon="settings" tip="设置" />
    <Button variant="tertiary" icon="settings" tip="设置" />
    <Button variant="secondary" icon="settings" tip="设置" />
    <Button variant="primary" round icon="play" tip="播放" />
    <Button variant="tertiary" round icon="rotate-ccw" tip="重播" />
  </div>
</template>
