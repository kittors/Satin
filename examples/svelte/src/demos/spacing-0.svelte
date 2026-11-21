<script>
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import "./spacing-0.css";

  let root;
  onMount(() => {
    const unsetup = setup();
    const off = enhance(root);
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div class="sp-scale" id="spScale">
    <div class="sp-row">
      <code class="k">--sp-0</code>
      <span class="sn-num">0</span>
      <span class="sp-bar">
        <i style="width:1px"></i>
      </span>
      <span class="sn-note">不留</span>
    </div>
    <div class="sp-row">
      <code class="k">--sp-2</code>
      <span class="sn-num">2</span>
      <span class="sp-bar">
        <i style="width:2px"></i>
      </span>
      <span class="sn-note">控件里的细缝：列表行之间、图标微调</span>
    </div>
    <div class="sp-row">
      <code class="k">--sp-4</code>
      <span class="sn-num">4</span>
      <span class="sp-bar">
        <i style="width:4px"></i>
      </span>
      <span class="sn-note">紧挨着的：标题和副标题、数字和单位</span>
    </div>
    <div class="sp-row">
      <code class="k">--sp-6</code>
      <span class="sn-num">6</span>
      <span class="sp-bar">
        <i style="width:6px"></i>
      </span>
      <span class="sn-note">小号控件里图标和字</span>
    </div>
    <div class="sp-row">
      <code class="k">--sp-8</code>
      <span class="sn-num">8</span>
      <span class="sp-bar">
        <i style="width:8px"></i>
      </span>
      <span class="sn-note">中号控件里图标和字；同一组元素之间</span>
    </div>
    <div class="sp-row">
      <code class="k">--sp-10</code>
      <span class="sn-num">10</span>
      <span class="sp-bar">
        <i style="width:10px"></i>
      </span>
      <span class="sn-note">小号控件左右内边距</span>
    </div>
    <div class="sp-row">
      <code class="k">--sp-12</code>
      <span class="sn-num">12</span>
      <span class="sp-bar">
        <i style="width:12px"></i>
      </span>
      <span class="sn-note">中号控件左右内边距</span>
    </div>
    <div class="sp-row">
      <code class="k">--sp-14</code>
      <span class="sn-num">14</span>
      <span class="sp-bar">
        <i style="width:14px"></i>
      </span>
      <span class="sn-note">胶囊形中号控件左右内边距</span>
    </div>
    <div class="sp-row">
      <code class="k">--sp-16</code>
      <span class="sn-num">16</span>
      <span class="sp-bar">
        <i style="width:16px"></i>
      </span>
      <span class="sn-note">组和组之间；卡片内边距</span>
    </div>
    <div class="sp-row">
      <code class="k">--sp-20</code>
      <span class="sn-num">20</span>
      <span class="sp-bar">
        <i style="width:20px"></i>
      </span>
      <span class="sn-note">大卡片内边距</span>
    </div>
    <div class="sp-row">
      <code class="k">--sp-24</code>
      <span class="sn-num">24</span>
      <span class="sp-bar">
        <i style="width:24px"></i>
      </span>
      <span class="sn-note">面板内边距；区块里的小节之间</span>
    </div>
    <div class="sp-row">
      <code class="k">--sp-28</code>
      <span class="sn-num">28</span>
      <span class="sp-bar">
        <i style="width:28px"></i>
      </span>
      <span class="sn-note">对齐用：图标列加间距</span>
    </div>
    <div class="sp-row">
      <code class="k">--sp-32</code>
      <span class="sn-num">32</span>
      <span class="sp-bar">
        <i style="width:32px"></i>
      </span>
      <span class="sn-note">页面里的区块之间；主区左右边距</span>
    </div>
    <div class="sp-row">
      <code class="k">--sp-40</code>
      <span class="sn-num">40</span>
      <span class="sp-bar">
        <i style="width:40px"></i>
      </span>
      <span class="sn-note">宽屏主区左右边距</span>
    </div>
    <div class="sp-row">
      <code class="k">--sp-48</code>
      <span class="sn-num">48</span>
      <span class="sp-bar">
        <i style="width:48px"></i>
      </span>
      <span class="sn-note">宽松密度的区块之间</span>
    </div>
    <div class="sp-row">
      <code class="k">--sp-64</code>
      <span class="sn-num">64</span>
      <span class="sp-bar">
        <i style="width:64px"></i>
      </span>
      <span class="sn-note">大段之间：欢迎页、空状态</span>
    </div>
    <div class="sp-row">
      <code class="k">--sp-80</code>
      <span class="sn-num">80</span>
      <span class="sp-bar">
        <i style="width:80px"></i>
      </span>
      <span class="sn-note">页面级留白</span>
    </div>
  </div>
</div>
