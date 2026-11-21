<script setup>
import { Field, Input } from "satin-ui/vue";
</script>

<template>
  <!-- 只标"可选"，不标必填；标签里要放标记时不用 label 属性，直接手写字段 -->
  <div class="sn-field">
    <label class="sn-lbl" for="notify-mail">通知邮箱 <span class="sn-opt">可选</span></label>
    <Input id="notify-mail" type="email" placeholder="name@example.com" />
    <div class="sn-help">生成完成后发一封邮件</div>
  </div>
</template>
