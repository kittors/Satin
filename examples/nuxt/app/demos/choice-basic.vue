<script setup>
import { ref } from "vue";
import { Checkbox, Switch } from "satin-ui/vue";

const autosave = ref(true);
const remind = ref(false);
</script>

<template>
  <div class="sn-stack sn-gap-8">
    <Checkbox v-model="autosave" label="自动保存草稿" />
    <Switch v-model="remind" label="生成完成后提醒我" />
  </div>
</template>
