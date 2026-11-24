<script setup lang="ts">
import { ref } from "vue";
import { optimistic } from "satin-ui";
import { Switch } from "satin-ui/vue";

// 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
let n = 0;
const save = () => new Promise<void>((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));
const on = ref(false), row = ref<HTMLDivElement | null>(null);
const change = (next: boolean) => {
  // 开关已经拨过去了，apply 只是把数据对上；保存失败：拨回去、这一行抖两下、给"重试"
  optimistic({ shake: row.value, apply: () => (on.value = next), revert: () => (on.value = !next), save });
};
</script>

<template>
  <div ref="row" class="sn-opt-row">
    <Switch label="自动保存草稿" :model-value="on" @update:model-value="change" />
  </div>
</template>
