<script setup>
import { ref, useId } from "vue";
import { Button, Dialog, toast } from "satin-ui/vue";

const open = ref(false), name = ref(""), nameId = useId();
function create() {
  open.value = false;
  toast({ text: "已创建：" + (name.value.trim() || "未命名项目") });
}
</script>

<template>
  <Button variant="primary" @click="open = true">新建项目</Button>
  <!-- 开关放在自己的状态里：v-model:open，关上（Esc、取消、程序关）以后自动改回 false -->
  <Dialog v-model:open="open" title="新建项目" description="名称之后随时可以改。" @submit="create">
    <div class="sn-field">
      <label class="sn-lbl" :for="nameId">项目名称</label>
      <input class="sn-input" :id="nameId" placeholder="比如：雨夜车站" autocomplete="off" v-model="name" />
    </div>
    <template #footer>
      <Button variant="ghost" data-cancel>取消</Button>
      <Button variant="primary" type="submit">创建项目</Button>
    </template>
  </Dialog>
</template>
