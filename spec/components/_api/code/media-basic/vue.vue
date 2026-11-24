<script setup lang="ts">
import { Player } from "satin-ui/vue";
</script>

<template>
  <!-- 控制条叠在画面上；播放时指针停 2 秒不动，控制条和指针一起淡出，一动就回来 -->
  <Player src="https://assets.mixkit.co/videos/4451/4451-720.mp4" poster="https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg" label="雨夜样片" />
</template>
