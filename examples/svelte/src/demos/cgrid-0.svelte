<script>
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import { createCanvasGrid } from "satin-ui/canvas-grid";
  import "satin-ui/css/grid.css";
  import "satin-ui/css/data.css";

  let root;
  onMount(() => {
    const unsetup = setup();
    const off = enhance(root, (root) => {
      // 整张表画在一块画布上：百万行照样流畅；交互和 DOM 版一致
      const grid = createCanvasGrid(root.querySelector("#grid"), { rows: 1000000 }); // 卸载时 grid.destroy()
    });
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div class="sn-grid cgrid" id="gridCanvas">
    <div class="sn-g-bar">
      <span class="sn-ib sn-has-pre" style="width:220px">
        <span class="sn-pre" data-i="search"></span>
        <input class="sn-input sn-sm" data-g-q="" placeholder="搜索名称，比如 书店 9" aria-label="搜索名称">
      </span>
      <div class="sn-seg sn-sm" data-seg="cgtree">
        <span class="sn-thumb"></span>
        <button data-v="flat">平铺</button>
        <button data-v="tree">树形</button>
      </div>
      <button class="sn-btn sn-ghost sn-sm" data-g-expand="" hidden data-i="chevrons-up-down:before">全部展开</button>
      <div class="sn-seg sn-sm" data-seg="cgmode">
        <span class="sn-thumb"></span>
        <button data-v="known">按需加载</button>
        <button data-v="append">滚到底再加载</button>
      </div>
      <div class="sn-seg sn-sm" data-seg="cgsb">
        <span class="sn-thumb"></span>
        <button data-v="gutter">常驻滚动条</button>
        <button data-v="auto">自动隐藏</button>
      </div>
      <div class="sn-seg sn-sm" data-seg="cglines">
        <span class="sn-thumb"></span>
        <button data-v="row">行线</button>
        <button data-v="grid">网格</button>
      </div>
      <span class="sn-g-filters" data-g-filters=""></span>
      <span class="sn-g-info" data-g-info=""></span>
    </div>
    <div class="sn-g-frame">
      <div class="sn-g-vp" tabindex="0" role="grid" aria-label="数据表格，一百万行，画布绘制">
        <div class="sn-g-head" role="row"></div>
        <canvas class="sn-cg-cv" aria-hidden="true"></canvas>
        <div class="sn-cg-sizer"></div>
      </div>
      <i class="sn-g-shade sn-l" aria-hidden="true"></i>
      <i class="sn-g-shade sn-r" aria-hidden="true"></i>
      <div class="sn-cg-sr" aria-live="polite"></div>
    </div>
  </div>
</div>
