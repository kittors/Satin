<script setup>
import { nextTick, ref } from "vue";
import { flipSnapshot, removeWithFlip } from "satin-ui";
import { Button } from "satin-ui/vue";

const rows = ref([{ id: 1, name: "镜头 07 · 车站外，雨刚停" }, { id: 2, name: "镜头 08 · 林夏走进候车厅" }, { id: 3, name: "镜头 09 · 站台上的最后一班车" }]), list = ref(null), els = new Map();
let seq = 0;
// 新建的一行插在最前面，下面的往下让：改数据之前记下位置，DOM 更新以后播
const add = async () => {
  const row = { id: `new-${++seq}`, name: `新镜头 ${seq}` };
  const play = flipSnapshot(list.value);
  rows.value.unshift(row);
  await nextTick();
  play(els.get(row.id));
};
// 删一行：先脱离布局淡出，下面的用弹簧补位（keep：节点留给 Vue 删），播完再从数据里删
const remove = async (id) => {
  await removeWithFlip(els.get(id), { keep: true });
  rows.value = rows.value.filter((x) => x.id !== id);
};
</script>

<template>
  <div class="sn-stack sn-gap-12">
    <div class="sn-row"><Button @click="add">新建镜头</Button></div>
    <div ref="list" class="sn-stack sn-gap-8">
      <div v-for="r in rows" :key="r.id" :ref="(el) => (el ? els.set(r.id, el) : els.delete(r.id))" class="sn-opt-row">
        <span class="sn-nm">{{ r.name }}</span>
        <Button variant="ghost" size="sm" icon="trash-2" :aria-label="'删除 ' + r.name" @click="remove(r.id)" />
      </div>
    </div>
  </div>
</template>
