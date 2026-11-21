<script setup>
import { Button, Popconfirm, toast } from "satin-ui/vue";
</script>

<template>
  <!-- 只给单条、属于自己、不能撤销的操作；确认按钮写清楚做什么 -->
  <Popconfirm title="永久删除这个镜头？" description="删除后无法恢复。" confirm-text="永久删除" @confirm="toast({ text: '已永久删除镜头' })">
    <Button variant="danger-soft">永久删除</Button>
  </Popconfirm>
</template>
