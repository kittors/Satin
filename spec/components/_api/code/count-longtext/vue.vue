<script setup lang="ts">
import { ref } from "vue";
import { LongText, toast } from "satin-ui/vue";

const desc = ref("");
</script>

<template>
  <!-- 随内容长高，到 max-lines 后在里面滚；右下角用量环，快满时显示"还剩几字"，超出时整个框变红；⌘↵ 发 submit -->
  <LongText
    v-model="desc"
    :max="120"
    :max-lines="7"
    placeholder="写清楚人物、动作和光线，生成会更准。"
    label="画面描述"
    @submit="toast({ text: '已保存画面描述' })"
  />
</template>
