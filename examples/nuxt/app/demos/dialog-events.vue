<script setup lang="ts">
import { ref } from "vue";
import { Button, Dialog } from "satin-ui/vue";

const open = ref(false), status = ref("还没打开过");
// 关完（Esc、取消、程序关）都会发 close：在这里同步自己的状态（v-model:open 已经改回 false）
function closed() {
  status.value = "关上了：" + new Date().toLocaleTimeString("zh-CN");
}
</script>

<template>
  <div class="sn-row">
    <Button @click="open = true">导出设置</Button>
    <span class="sn-help">{{ status }}</span>
  </div>
  <Dialog v-model:open="open" title="导出设置" description='按 Esc 或点"关闭"，看下面那行字怎么变。' @close="closed">
    <template #footer>
      <Button variant="primary" data-cancel>关闭</Button>
    </template>
  </Dialog>
</template>
