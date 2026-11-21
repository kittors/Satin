<script setup>
import { ref } from "vue";
import { Chip } from "satin-ui/vue";

const tags = ref(["雨夜", "车站", "列车"]);
</script>

<template>
  <div class="sn-row">
    <!-- remove 在收起动画放完以后发，这时再从列表里删 -->
    <Chip v-for="t in tags" :key="t" selected removable :remove-label="`移除 ${t}`" @remove="tags = tags.filter((x) => x !== t)">{{ t }}</Chip>
  </div>
</template>
