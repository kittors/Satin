<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { setup, enhance } from "satin-ui";

const root = ref<HTMLDivElement | null>(null);
let off = () => {};
onMounted(() => {
  if (!root.value) return;
  const unsetup = setup();
  const done = enhance(root.value);
  off = () => { done(); unsetup(); };
});
onBeforeUnmount(() => off());
</script>

<template>
  <div ref="root">
    <header class="sn-page sn-wide" style="padding-block: var(--sn-sp-16)">
      <div class="sn-row sn-between">
        <b class="sn-t-title3">分镜工作台</b>
        <nav class="sn-row sn-gap-4 sn-hide-phone" aria-label="页面导航">
          <a class="sn-btn sn-ghost sn-sm" href="#features">功能</a>
          <a class="sn-btn sn-ghost sn-sm" href="/pricing">价格</a>
          <a class="sn-btn sn-ghost sn-sm" href="/docs">文档</a>
        </nav>
        <div class="sn-row sn-gap-8">
          <a class="sn-btn sn-ghost" href="/login">登录</a>
          <a class="sn-btn sn-primary" href="/signup">免费试用</a>
        </div>
      </div>
    </header>
    <main>
      <section class="sn-page sn-wide" style="padding-block: var(--sn-sp-48) var(--sn-sp-32)">
        <div class="sn-stack sn-gap-16" style="max-width: 640px">
          <h1 class="sn-t-display">把剧本变成可以拍的分镜</h1>
          <p class="sn-t-body sn-c-secondary">导入一集剧本，几分钟得到每个镜头的景别、时长和画面描述；导演改一句，后面的镜头跟着调整。</p>
          <div class="sn-row sn-gap-12">
            <a class="sn-btn sn-primary sn-lg" href="/signup">免费试用 14&nbsp;天</a>
            <a class="sn-btn sn-secondary sn-lg" href="/demo">看 2&nbsp;分钟演示</a>
          </div>
        </div>
        <img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&amp;fit=crop&amp;w=1600&amp;h=700&amp;q=80" alt="片场里举起的场记板" style="margin-top: var(--sn-sp-40); width: 100%; aspect-ratio: 16 / 7; object-fit: cover; border-radius: var(--sn-r-xl); border: 1px solid var(--sn-line)">
      </section>
      <section id="features" class="sn-page sn-wide" style="padding-block: var(--sn-sp-32) var(--sn-sp-64)">
        <div class="sn-cols sn-gap-32" style="--sn-min: max(200px, 30%)">
          <div class="sn-stack sn-gap-8">
            <span data-i="clapperboard"></span>
            <h2 class="sn-t-title3">按镜头拆好</h2>
            <p class="sn-t-callout sn-c-secondary">每场戏拆成镜头，标好景别、时长和机位，导出给摄影直接用。</p>
          </div>
          <div class="sn-stack sn-gap-8">
            <span data-i="users"></span>
            <h2 class="sn-t-title3">多人一起改</h2>
            <p class="sn-t-callout sn-c-secondary">导演、编剧、美术在同一份分镜上批注，谁改了什么都留着记录。</p>
          </div>
          <div class="sn-stack sn-gap-8">
            <span data-i="download"></span>
            <h2 class="sn-t-title3">导出成片脚本</h2>
            <p class="sn-t-callout sn-c-secondary">导出 PDF 分镜本、Excel 拍摄表，或者直接生成 30&nbsp;秒的样片。</p>
          </div>
        </div>
      </section>
    </main>
    <footer class="sn-page sn-wide sn-t-caption sn-c-tertiary" style="padding-block: var(--sn-sp-24) var(--sn-sp-40)">© 2026 分镜工作台 · <a class="sn-link" href="/pricing">价格</a> · <a class="sn-link" href="/docs">文档</a> · <a class="sn-link" href="/privacy">隐私</a> · <a class="sn-link" href="/terms">条款</a></footer>
  </div>
</template>
