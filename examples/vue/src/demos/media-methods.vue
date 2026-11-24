<script setup lang="ts">
import { ref } from "vue";
import { Player } from "satin-ui/vue";

// 实例上有 play()、pause()、toggle()，video 是里面的 <video>：自己的按钮直接控制播放；模板 ref 拿到组件，.instance 是实例
const player = ref<{ instance?: { video: HTMLVideoElement; play(): void; pause(): void } } | null>(null);
const restart = () => { const p = player.value.instance; p.video.currentTime = 0; p.play(); };
</script>

<template>
  <div>
    <Player ref="player" src="https://assets.mixkit.co/videos/4451/4451-720.mp4" poster="https://assets.mixkit.co/videos/4451/4451-thumb-720-0.jpg" label="雨夜样片" />
    <div class="sn-row" style="margin-top: 12px">
      <button type="button" class="sn-btn sn-secondary sn-sm" @click="restart">从头播放</button>
      <button type="button" class="sn-btn sn-secondary sn-sm" @click="player.instance.pause()">暂停</button>
    </div>
  </div>
</template>
