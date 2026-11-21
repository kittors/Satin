<script setup>
import { ref, watch, nextTick } from "vue";
import { Button, Dialog } from "satin-ui/vue";

const open = ref(false), note = ref(""), asking = ref(false);
const noteEl = ref(null), keepBtn = ref(null);
// 底栏两组按钮原地切换：问的时候焦点到"继续填写"，回去接着填时回到输入框
watch(asking, async (on) => {
  await nextTick();
  (on ? keepBtn.value?.$el : noteEl.value)?.focus();
});
// Esc、取消都先走 guard：在问的时候再按一次就回去接着填；填了内容就问；空的直接关
const guard = (close) => (asking.value ? (asking.value = false) : note.value.trim() ? (asking.value = true) : close());
function discard() {
  open.value = false;
  note.value = "";
  asking.value = false;
}
</script>

<template>
  <Button @click="open = true">写备注</Button>
  <Dialog v-model:open="open" title="给第 3 场写备注" :guard="guard" :footer-class="asking ? 'sn-two sn-asking' : 'sn-two'" @submit="open = false">
    <textarea ref="noteEl" v-model="note" class="sn-input" rows="3" aria-label="备注" placeholder="比如：雨再大一点，站台的灯偏冷"></textarea>
    <template #footer>
      <div class="sn-g sn-a" :inert="asking"><Button variant="ghost" data-cancel>取消</Button><Button variant="primary" type="submit">保存</Button></div>
      <div class="sn-g sn-b" :inert="!asking"><span>放弃填写的内容？</span><Button ref="keepBtn" variant="ghost" @click="asking = false">继续填写</Button><Button variant="danger-soft" @click="discard">放弃</Button></div>
    </template>
  </Dialog>
</template>
