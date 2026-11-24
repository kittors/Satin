<script setup lang="ts">
import { Button, Icon, vEnhance } from "satin-ui/vue";

const sorts = ["最近更新", "名称", "创建时间"];
</script>

<template>
  <!-- 菜单按钮：标记照设计稿写，v-enhance 接上交互（选了就收起，按钮文字换成 前缀 + 选中项） -->
  <div v-enhance>
    <div class="sn-select">
      <Button data-menubtn data-prefix="排序：">排序：最近更新<Icon name="chevron-down" class="sn-caret" /></Button>
      <div class="sn-menu" role="menu">
        <div v-for="(s, i) in sorts" :key="s" :class="['sn-item', { 'sn-sel': i === 0 }]">{{ s }}<span class="sn-chk"><Icon name="check" /></span></div>
      </div>
    </div>
  </div>
</template>
