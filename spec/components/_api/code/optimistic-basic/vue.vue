<script setup lang="ts">
import { reactive, ref } from "vue";
import { optimistic } from "satin-ui";
import { Icon } from "satin-ui/vue";

// 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
let n = 0;
const save = () => new Promise<void>((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));
const star = reactive({ on: false, count: 24 }), row = ref<HTMLDivElement | null>(null);
const toggle = () => {
  const next = !star.on, d = next ? 1 : -1;
  // 先显示结果再保存；保存失败：改回去、这一行抖两下、弹出带"重试"的提示
  optimistic({
    shake: row.value,
    apply: () => { star.on = next; star.count += d; },
    revert: () => { star.on = !next; star.count -= d; },
    save,
  });
};
</script>

<template>
  <div ref="row" class="sn-opt-row">
    <span class="sn-nm">雨夜车站</span>
    <button type="button" :class="['sn-star', { 'sn-on': star.on }]" :aria-pressed="String(star.on)" aria-label="收藏" @click="toggle">
      <Icon name="star" />
      <span class="sn-n">{{ star.count }}</span>
    </button>
  </div>
</template>
