<script setup lang="ts">
import { ref } from "vue";
import { Button, Drawer, Field, Input } from "satin-ui/vue";

const open = ref(false);
const name = ref("站台 · 远景");
</script>

<template>
  <Button @click="open = true">编辑镜头</Button>
  <!-- Esc、点外面、右上角的关闭都会把 open 改回 false；焦点回到"编辑镜头" -->
  <Drawer v-model:open="open" title="编辑镜头">
    <Field label="镜头名称" for="drw-shot-name">
      <Input id="drw-shot-name" v-model="name" />
    </Field>
  </Drawer>
</template>
