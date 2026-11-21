<script setup>
import { Upload } from "satin-ui/vue";
</script>

<template>
  <!-- 支持的格式和大小写在框里；格式不对、太大的当场标红 -->
  <Upload accept=".txt,.docx" :max-size="5e6" hint="支持 txt、docx，单个不超过 5 MB" />
</template>
