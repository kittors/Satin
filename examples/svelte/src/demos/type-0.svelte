<script lang="ts">
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import "./type-0.css";

  let root!: HTMLDivElement;
  onMount(() => {
    if (!root) return;
    const unsetup = setup();
    const off = enhance(root);
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div class="type-list" id="typeList">
    <div>
      <span class="sn-t-display sn-truncate">把故事，拍成画面</span>
      <span class="sn-meta">display</span>
      <span class="sn-meta">28 / 36 / 600</span>
    </div>
    <div>
      <span class="sn-t-title1 sn-truncate">页面标题：全部项目</span>
      <span class="sn-meta">title1</span>
      <span class="sn-meta">22 / 30 / 600</span>
    </div>
    <div>
      <span class="sn-t-title2 sn-truncate">区块标题：最近打开</span>
      <span class="sn-meta">title2</span>
      <span class="sn-meta">17 / 24 / 600</span>
    </div>
    <div>
      <span class="sn-t-title3 sn-truncate">卡片标题：雨夜车站</span>
      <span class="sn-meta">title3</span>
      <span class="sn-meta">15 / 22 / 600</span>
    </div>
    <div>
      <span class="sn-t-body sn-truncate">正文：从小说、剧本到成片，都在这台电脑上完成。</span>
      <span class="sn-meta">body</span>
      <span class="sn-meta">14 / 22 / 400</span>
    </div>
    <div>
      <span class="sn-t-body-strong sn-truncate">强调正文、按钮文字</span>
      <span class="sn-meta">bodyStrong</span>
      <span class="sn-meta">14 / 22 / 500</span>
    </div>
    <div>
      <span class="sn-t-callout sn-truncate">列表行、导航、表格</span>
      <span class="sn-meta">callout</span>
      <span class="sn-meta">13 / 20 / 400</span>
    </div>
    <div>
      <span class="sn-t-caption sn-truncate">副信息：3 分钟前 · 12 个镜头</span>
      <span class="sn-meta">caption</span>
      <span class="sn-meta">12 / 18 / 400</span>
    </div>
    <div>
      <span class="sn-t-micro sn-truncate">分组标题</span>
      <span class="sn-meta">micro</span>
      <span class="sn-meta">11 / 16 / 500</span>
    </div>
    <div>
      <span class="sn-t-code sn-truncate">project_7f3k2 · v1.4.0</span>
      <span class="sn-meta">code</span>
      <span class="sn-meta">12 / 18 / 400 等宽</span>
    </div>
  </div>
</div>
