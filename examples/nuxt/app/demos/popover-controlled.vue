<script setup lang="ts">
import { ref } from "vue";
import { Button, Popover, Radio } from "satin-ui/vue";

const RATES = [["16:9", "16:9 横屏"], ["9:16", "9:16 竖屏"], ["1:1", "1:1 方形"]];
const open = ref(false);
const rate = ref("16:9");
// 受控：v-model:open，选了就关上（改动立即生效，不需要"保存"）
const pick = (v: string) => { rate.value = v; open.value = false; };
</script>

<template>
  <Popover v-model:open="open" title="画面比例">
    <Button>画面比例：{{ rate }}</Button>
    <template #content>
      <div class="sn-stack sn-gap-8" role="radiogroup" aria-label="画面比例">
        <Radio v-for="[v, label] in RATES" :key="v" :model-value="rate" name="pop-rate" :value="v" :label="label" @update:model-value="pick" />
      </div>
    </template>
  </Popover>
</template>
