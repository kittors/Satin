<script setup>
import { ref } from "vue";
import { Button } from "satin-ui/vue";
import { DataGrid } from "satin-ui/vue/grid";

const seed = ref(11);
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <div class="sn-row">
      <Button size="sm" @click="seed++">换一批数据</Button>
      <span class="sn-help">种子 {{ seed }}</span>
    </div>
    <!-- rows、seed 只在创建时用（数据在后台线程里按它们生成）：变了组件自己换一张新表 -->
    <DataGrid :rows="2000" :seed="seed" label="镜头清单" />
  </div>
</template>
