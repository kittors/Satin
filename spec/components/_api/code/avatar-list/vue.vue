<script setup>
import { Avatar } from "satin-ui/vue";

const people = [
  { name: "何慧", role: "前端开发", online: true },
  { name: "黄磊", role: "产品设计", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128&q=80" },
  { name: "徐丽", role: "财务顾问" },
];
</script>

<template>
  <div class="sn-set-list">
    <div v-for="p in people" :key="p.name" class="sn-set-row">
      <Avatar :name="p.name" :src="p.src" :online="p.online" decorative />
      <div class="sn-tx"><b>{{ p.name }}</b><span>{{ p.role }}</span></div>
    </div>
  </div>
</template>
