<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "satin-ui/vue";

const IMG = "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=1200&h=675&q=84";
const pos = ref(52);
const anim = ref(false);
const drag = ref(false);
const boxRef = ref<HTMLDivElement | null>(null);

const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v * 10) / 10));
const at = (cx: number) => {
  const r = boxRef.value?.getBoundingClientRect();
  return r && r.width ? clamp(((cx - r.left) / r.width) * 100) : 52;
};
const jump = (v: number) => { anim.value = true; pos.value = clamp(v); };
const onDown = (e: PointerEvent) => {
  drag.value = true; anim.value = false;
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  pos.value = at(e.clientX);
};
const onMove = (e: PointerEvent) => { if (drag.value) pos.value = at(e.clientX); };
const onUp = () => { drag.value = false; };
const onKey = (e: KeyboardEvent) => {
  const step = e.shiftKey ? 15 : 5;
  if (e.key === "ArrowLeft") { e.preventDefault(); jump(pos.value - step); }
  else if (e.key === "ArrowRight") { e.preventDefault(); jump(pos.value + step); }
  else if (e.key === "Home") { e.preventDefault(); jump(0); }
  else if (e.key === "End") { e.preventDefault(); jump(100); }
};
</script>

<template>
  <section class="sn-ed-stage" aria-label="电影调色前后对比">
    <div class="sn-ed-stage-bar">
      <span class="sn-ed-stage-meta"><b>图 01 · 站前广场雨后倒影</b><span>35mm · f/1.8 · 5200K</span></span>
      <div class="sn-ed-stage-ctrl">
        <button type="button" class="sn-btn sn-ghost sn-sm" data-preset="96" @click="jump(96)">Log 原片</button>
        <button type="button" class="sn-btn sn-ghost sn-sm" data-preset="52" @click="jump(52)">居中对比</button>
        <button type="button" class="sn-btn sn-ghost sn-sm" data-preset="4" @click="jump(4)">5200K 定调</button>
      </div>
    </div>
    <div ref="boxRef" class="sn-ed-compare" :class="{ 'sn-ed-anim': anim, 'sn-ed-drag': drag }" :style="{ '--sn-pos': pos + '%' }" @pointerdown="onDown" @pointermove="onMove" @pointerup="onUp" @pointercancel="onUp">
      <div class="sn-ed-compare-layer sn-ed-compare-after"><img :src="IMG" alt="雨夜车站广场 5200K 电影冷调定调帧" decoding="async" /></div>
      <div class="sn-ed-compare-layer sn-ed-compare-before"><img :src="IMG" alt="雨夜车站广场 Log 灰片原帧" decoding="async" /></div>
      <span class="sn-ed-divider" aria-hidden="true"></span>
      <button type="button" class="sn-ed-handle" role="slider" aria-label="拖动对比 Log 原片与 5200K 定调画面" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="Math.round(pos)" @keydown="onKey">
        <Icon name="chevron-left" /><Icon name="chevron-right" />
      </button>
      <span class="sn-ed-tag sn-ed-tag-l" :class="{ 'sn-ed-dim': pos < 16 }">Log 原片</span>
      <span class="sn-ed-tag sn-ed-tag-r" :class="{ 'sn-ed-dim': pos > 84 }">5200K 定调</span>
    </div>
  </section>
</template>
