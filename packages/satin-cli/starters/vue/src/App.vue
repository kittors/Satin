<script setup>
import { ref } from "vue";
import { toast } from "satin-ui/vue";

const VIEWS = ["网格", "列表", "时间线"];
const name = ref("");
const view = ref(VIEWS[0]);
const create = () => toast({ text: `已创建「${name.value.trim() || "未命名项目"}」，默认视图：${view.value}` });
</script>

<!-- 起步页：页头 + 一张面板（名称、默认视图、创建按钮） -->
<template>
  <main class="sn-page sn-narrow">
    <header class="sn-page-hd">
      <div>
        <h1>新建项目</h1>
        <p>起个名字、选一种默认视图，就能开始。</p>
      </div>
    </header>
    <section class="sn-panel sn-stack sn-gap-20">
      <SnField label="项目名称" for="p-name" help="之后在项目设置里还能改。">
        <SnInput id="p-name" v-model="name" placeholder="比如：春季新品发布" />
      </SnField>
      <div class="sn-field">
        <span class="sn-lbl">默认视图</span>
        <SnSegmented v-model="view" :items="VIEWS" label="默认视图" />
      </div>
      <div class="sn-row">
        <SnButton variant="primary" @click="create">创建项目</SnButton>
      </div>
    </section>
  </main>
</template>
