<script setup>
import { Icon } from "satin-ui/vue";
import { copied } from "satin-ui";

const LINK = "https://example.com/s/7f3k2q";
// 复制成功：copied(按钮) 让图标原地变成对勾 1.2 秒、提示换成"已复制"，不另弹轻提示
const copy = async (e) => { const b = e.currentTarget; await navigator.clipboard.writeText(LINK); copied(b); };
</script>

<template>
  <button type="button" class="sn-btn sn-ghost sn-ibtn" data-tip="复制链接" aria-label="复制链接" data-kbd="⌘C" @click="copy">
    <span class="sn-swap"><span class="sn-a"><Icon name="copy" /></span><span class="sn-b"><Icon name="check" /></span></span>
  </button>
</template>
