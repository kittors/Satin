<script setup lang="ts">
import { ref } from "vue";
import type { TableColumn } from "satin-ui/vue";
const rows = [{ id: 1, name: "雨夜车站", shots: 48 }, { id: 2, name: "长夜", shots: 20 }, { id: 3, name: "海边的第七天", shots: 32 }];
const cols: TableColumn[] = [{ key: "name", title: "项目", sortable: true }, { key: "shots", title: "镜头", align: "right", sortable: true }];
const open = ref(true), page = ref(1), picked = ref<string[]>([]);
</script>

<template>
  <main class="sink">
    <SnTable v-model="picked" :columns="cols" :rows="rows" selectable />
    <SnTabs :tabs="[{ label: '概览', content: '概览' }, { label: '镜头', content: '镜头' }]" :value="0" />
    <SnPager v-model="page" :total="5" />
    <SnButton variant="primary" @click="open = true">打开弹窗</SnButton>
    <SnDialog :open="open" title="新建项目" @close="open = false">弹窗里的内容</SnDialog>
  </main>
</template>
