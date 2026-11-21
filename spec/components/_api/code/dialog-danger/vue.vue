<script setup>
import { ref } from "vue";
import { Button, Dialog, toast } from "satin-ui/vue";

const open = ref(false);
function remove() {
  open.value = false;
  toast({ text: '已删除"雨夜车站"' });
}
</script>

<template>
  <Button variant="danger-soft" icon="trash-2" @click="open = true">删除项目…</Button>
  <Dialog v-model:open="open" icon="trash-2" title='删除"雨夜车站"？' description="删除后无法恢复，协作者也会失去访问权限。" @submit="remove">
    <!-- 写清会一起删掉什么 -->
    <div class="sn-impact"><b>将一起删除</b><ul><li>12 个镜头和全部画面版本</li><li>3 段配音、2 个已导出的成片</li></ul></div>
    <template #footer>
      <Button variant="ghost" data-cancel>取消</Button>
      <Button variant="danger" type="submit">删除项目</Button>
    </template>
  </Dialog>
</template>
