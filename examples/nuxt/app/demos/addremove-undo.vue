<script setup lang="ts">
import { nextTick, ref } from "vue";
import { flipSnapshot, toast } from "satin-ui";
import { Button, Chip, Input } from "satin-ui/vue";

const tags = ref<string[]>(["雨夜", "车站", "第三集", "悬疑", "长镜头", "暖色调"]), text = ref(""), box = ref<HTMLDivElement | null>(null), els = new Map<string, HTMLElement>();
// 新的一项从它该在的位置出现，其余让位：改数据之前记下位置，DOM 更新以后播
const add = async (t: string, at = tags.value.length) => {
  if (!t || tags.value.includes(t)) return;
  const play = flipSnapshot(box.value);
  tags.value.splice(at, 0, t);
  await nextTick();
  play(els.get(t));
};
const submit = () => { add(text.value.trim()); text.value = ""; };
const remove = (t: string) => {
  const at = tags.value.indexOf(t);
  tags.value = tags.value.filter((x) => x !== t);
  // 删掉的能撤销：撤销后按"新增"的方式回到原来的位置
  toast({ kind: "action", text: `已移除标签"${t}"`, action: { label: "撤销", run: (h) => { add(t, at); h.update({ kind: "status", text: `已恢复"${t}"`, done: true, duration: 2000 }); } } });
};
</script>

<template>
  <div>
    <div class="sn-add-row">
      <Input v-model="text" placeholder="添加一个标签，回车确认" aria-label="添加标签" @keydown.enter="(e) => !e.isComposing && submit()" />
      <Button @click="submit">添加</Button>
    </div>
    <div ref="box" class="sn-chips-box">
      <!-- 删除：先脱离布局淡出，剩下的用弹簧补位：Chip 自己播动画，播完发 remove，这时再从数据里删 -->
      <Chip v-for="t in tags" :key="t" :ref="(c) => (c ? els.set(t, c.$el) : els.delete(t))" removable selected @remove="remove(t)">{{ t }}</Chip>
    </div>
  </div>
</template>
