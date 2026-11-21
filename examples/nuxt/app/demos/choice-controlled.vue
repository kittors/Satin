<script setup>
import { ref, computed } from "vue";
import { Checkbox } from "satin-ui/vue";

const SHOTS = ["开场", "车站", "雨夜"];
const picked = ref(["开场"]);
const all = computed(() => picked.value.length === SHOTS.length);
const toggle = (s, on) => { picked.value = on ? [...picked.value, s] : picked.value.filter((x) => x !== s); };
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Checkbox label="全选" :model-value="all" :indeterminate="picked.length > 0 && !all" @update:model-value="(on) => (picked = on ? [...SHOTS] : [])" />
    <Checkbox v-for="s in SHOTS" :key="s" :label="s" :model-value="picked.includes(s)" @update:model-value="(on) => toggle(s, on)" />
  </div>
</template>
