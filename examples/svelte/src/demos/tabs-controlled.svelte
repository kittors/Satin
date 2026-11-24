<script lang="ts">
  import Tabs from "satin-ui/svelte/Tabs.svelte";

  const TABS = [
    { label: "概览", content: "项目概览：48 个镜头，12 分 36 秒，最后更新 3 分钟前。" },
    { label: "镜头", badge: 48, content: "镜头列表：按集分组，可以拖动排序。" },
    { label: "配音", content: "配音：林夏、周屿两个角色，6 段。" },
  ];
  let tab = $state(1);
</script>

<div class="sn-stack sn-gap-8">
  <Tabs tabs={TABS} bind:value={tab} />
  <div class="sn-row">
    <span class="sn-help">现在看的是：{TABS[tab].label}</span>
    <button type="button" class="sn-btn sn-secondary sn-sm" onclick={() => (tab = 2)}>去配音</button>
  </div>
</div>
