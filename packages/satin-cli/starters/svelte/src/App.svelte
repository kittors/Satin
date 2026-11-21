<script>
  import { toast } from "satin-ui/components";

  const VIEWS = ["网格", "列表", "时间线"];
  let name = $state("");
  let view = $state(VIEWS[0]);
  const create = () => toast({ text: `已创建「${name.trim() || "未命名项目"}」，默认视图：${view}` });
</script>

<!-- 起步页：页头 + 一张面板（名称、默认视图、创建按钮）。自定义元素的数组属性写成 JSON -->
<main class="sn-page sn-narrow">
  <header class="sn-page-hd">
    <div>
      <h1>新建项目</h1>
      <p>起个名字、选一种默认视图，就能开始。</p>
    </div>
  </header>
  <section class="sn-panel sn-stack sn-gap-20">
    <div class="sn-field">
      <label class="sn-lbl" for="p-name">项目名称</label>
      <input class="sn-input" id="p-name" placeholder="比如：春季新品发布" bind:value={name}>
      <div class="sn-help">之后在项目设置里还能改。</div>
    </div>
    <div class="sn-field">
      <span class="sn-lbl">默认视图</span>
      <sn-segmented items={JSON.stringify(VIEWS)} value={view} label="默认视图" onsn-change={(e) => (view = e.detail)}></sn-segmented>
    </div>
    <div class="sn-row">
      <button class="sn-btn sn-primary" type="button" onclick={create}>创建项目</button>
    </div>
  </section>
</main>
