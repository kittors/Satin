<script setup lang="ts">
import { ref } from "vue";
import { Button, Drawer, Field, toast } from "satin-ui/vue";

const open = ref(false);
const note = ref("雨要下得再大一点");
const remove = () => { open.value = false; toast({ text: "已删除镜头" }); };
</script>

<template>
  <Button @click="open = true">镜头设置</Button>
  <Drawer v-model:open="open" title="镜头设置">
    <Field label="备注" for="drw-more-note">
      <textarea id="drw-more-note" v-model="note" class="sn-input" rows="3"></textarea>
    </Field>
    <!-- #footer：底栏放这一项的其他操作（不放"保存"：抽屉里的改动随改随存） -->
    <template #footer>
      <Button variant="danger-soft" @click="remove">删除镜头</Button>
    </template>
  </Drawer>
</template>
