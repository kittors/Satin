<script setup>
import { ref } from "vue";
import { Button, Drawer, Field, Input } from "satin-ui/vue";

const open = ref(false);
const name = ref("站台 · 远景");
</script>

<template>
  <div class="sn-row">
    <b>{{ name || "未命名镜头" }}</b>
    <Button size="sm" @click="open = true">编辑</Button>
  </div>
  <!-- 抽屉不做确认：边改边反映到背后的页面 -->
  <Drawer v-model:open="open" title="编辑镜头">
    <Field label="镜头名称" for="drw-live-name">
      <Input id="drw-live-name" v-model="name" />
    </Field>
  </Drawer>
</template>
