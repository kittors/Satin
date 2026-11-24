<script setup lang="ts">
import { ref } from "vue";
import { Button, Field, Input } from "satin-ui/vue";

const name = ref("");
const error = ref("");
const submit = () => {
  if (!name.value.trim()) return (error.value = "请填写项目名称");
  name.value = "";
};
</script>

<template>
  <form class="sn-stack sn-gap-12" novalidate @submit.prevent="submit">
    <!-- error 给了字（空字符串也算）就有错误区：有字时展开、输入框抖两下，清空时收起 -->
    <Field label="项目名称" :error="error" for="new-name">
      <Input id="new-name" v-model="name" placeholder="比如：雨夜车站" :invalid="!!error" @input="error = ''" />
    </Field>
    <div><Button variant="primary" type="submit">创建</Button></div>
  </form>
</template>
