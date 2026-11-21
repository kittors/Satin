<script setup>
import { Upload } from "satin-ui/vue";
</script>

<template>
  <!-- 一次一个：:multiple="false"；title、pick 换掉框里的字 -->
  <Upload accept=".jpg,.png" :max-size="2e6" :multiple="false" title="把封面拖到这里，或者" pick="选择图片" hint="一次一张，JPG 或 PNG" />
</template>
