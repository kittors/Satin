<script setup lang="ts">
import { InfiniteList } from "satin-ui/vue";

const THUMBS = ["https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=112&h=68&q=72", "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=112&h=68&q=72"];
// loadPage(offset, size) 返回一页数据（Promise）；返回空数组就是到底了，reject 时末尾那一行变成"重试"
const loadPage = (offset: number, size: number) => new Promise<{ id: number; title: string; sub: string; thumb: string }[]>((ok) => setTimeout(() => ok(offset >= 300 ? [] : Array.from({ length: Math.min(size, 300 - offset) }, (_, i) => ({ id: offset + i, title: `第 ${offset + i + 1} 个镜头`, sub: "远景 · 6 秒", thumb: THUMBS[(offset + i) % 3] }))), 400));
</script>

<template>
  <!-- 只画看得见的几十行（上万条照样流畅）；滚到离底部 400px 自动要下一页，等待超过 300ms 末尾才出骨架行；#row 插槽画一行（行元素复用，滚动时只改位置） -->
  <div class="sn-vl-wrap">
    <InfiniteList style="height: 320px" :load-page="loadPage" :row-height="56">
      <template #row="{ item }">
        <span class="sn-th" :style="{ '--sn-g': `url(${item.thumb}) center / cover` }"></span>
        <span class="sn-tx"><b>{{ item.title }}</b><span>{{ item.sub }}</span></span>
      </template>
    </InfiniteList>
  </div>
</template>
