<script setup>
import { ref } from "vue";
import { Button as SnButton, Dialog as SnDialog, toast } from "satin-ui/vue";
const open = ref(false), name = ref("");
const create = () => { open.value = false; toast({ text: "已创建：" + (name.value.trim() || "未命名项目") }); };
</script>

<template>
  <SnButton variant="primary" @click="open = true">新建项目</SnButton>
  <SnDialog v-model:open="open" title="新建项目" description="名称之后随时可以改。">
    <div class="sn-field">
      <label class="sn-lbl" for="new-name">项目名称</label>
      <input class="sn-input" id="new-name" placeholder="比如：雨夜车站" autocomplete="off" v-model="name" />
    </div>
    <template #footer>
      <SnButton variant="ghost" @click="open = false">取消</SnButton>
      <SnButton variant="primary" @click="create">创建项目</SnButton>
    </template>
  </SnDialog>
</template>
