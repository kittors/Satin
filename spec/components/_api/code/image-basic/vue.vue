<script setup>
import { onMounted, reactive, ref } from "vue";
import { Lightbox } from "satin-ui/vue";

const ITEMS = [
  { src: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "夜里停在站台边的电车" },
  { src: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "雨天街上走路的人" },
  { src: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1600&h=1200&q=72", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=320&h=240&q=72", ratio: 4 / 3, alt: "积水映着街景" },
];
const state = reactive({}), index = ref(null), thumbs = [];
// 先占位再淡入：缩略图加载好了加 sn-loaded（模糊淡入），失败加 sn-failed
const load = (i) => {
  const img = new Image(), fail = () => (state[i] = "sn-failed");
  img.onload = () => (state[i] = "sn-loaded");
  img.onerror = fail;
  img.src = ITEMS[i].thumb;
};
onMounted(() => ITEMS.forEach((_, i) => load(i)));
const ok = (i) => state[i] === "sn-loaded";
const open = (i) => { if (ok(i)) index.value = i; };
</script>

<template>
  <!-- 点缩略图：图片从缩略图的位置长到铺满窗口；滚轮、捏合、双击缩放，左右键翻页，Esc 关上沿原路缩回；v-model:index（数字打开到那一张，关上时回写 null） -->
  <div class="sn-row">
    <div v-for="(it, i) in ITEMS" :key="it.src" :ref="(el) => (thumbs[i] = el)" :class="['sn-im', state[i]]" role="button" tabindex="0" :aria-label="'看大图：' + it.alt"
      :style="{ height: '120px', aspectRatio: '4 / 3', '--sn-g': `url(${it.thumb}) center` }" @click="open(i)" @keydown.enter.space.self.prevent="open(i)">
      <span class="sn-ph sn-sk"></span>
      <span class="sn-pic"></span>
    </div>
    <Lightbox v-model:index="index" :items="ITEMS" :thumb-of="(i) => thumbs[i]" :enabled="ok" />
  </div>
</template>
