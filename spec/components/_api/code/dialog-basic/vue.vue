<script setup>
import { ref, useId } from "vue";
import { Button, Dialog, toast } from "satin-ui/vue";

const open = ref(false), name = ref("雨夜车站"), nameId = useId();
// 弹窗不会因为提交自己关：在这里保存，成功了再关
function save() {
  open.value = false;
  toast({ text: "已改名为：" + name.value.trim() });
}
</script>

<template>
  <Button variant="primary" @click="open = true">重命名</Button>
  <Dialog v-model:open="open" title="重命名项目" description="新名称会同步给所有协作者。" @submit="save">
    <div class="sn-field">
      <label class="sn-lbl" :for="nameId">项目名称</label>
      <input class="sn-input" :id="nameId" v-model="name" autocomplete="off" />
    </div>
    <template #footer>
      <!-- data-cancel：和 Esc 一样关上 -->
      <Button variant="ghost" data-cancel>取消</Button>
      <Button variant="primary" type="submit">保存</Button>
    </template>
  </Dialog>
</template>
