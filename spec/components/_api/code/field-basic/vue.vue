<script setup>
import { Field, Input } from "satin-ui/vue";
</script>

<template>
  <Field label="项目名称" help="会显示在项目列表和导出的文件名里" for="project-name">
    <Input id="project-name" placeholder="比如：雨夜车站" />
  </Field>
</template>
