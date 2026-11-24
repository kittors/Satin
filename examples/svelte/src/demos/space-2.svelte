<script lang="ts">
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import "./space-2.css";

  let root!: HTMLDivElement;
  onMount(() => {
    if (!root) return;
    const unsetup = setup();
    const off = enhance(root);
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div class="sf-grid">
    <div class="sf-card">
      <span class="sn-cap">线条粗细 · --sn-bw-*</span>
      <div class="sf-lines">
        <div>
          <i style="height:var(--sn-bw-hairline);background:var(--sn-line-control)"></i>
          <span>1px 细线 / 控件</span>
          <code>--sn-bw-hairline</code>
        </div>
        <div>
          <i style="height:var(--sn-bw-accent);background:var(--sn-label2)"></i>
          <span>2px 导引 / 拉引线</span>
          <code>--sn-bw-accent</code>
        </div>
        <div>
          <i style="height:var(--sn-bw-focus);background:var(--sn-focus)"></i>
          <span>2px 焦点环</span>
          <code>--sn-bw-focus</code>
        </div>
      </div>
    </div>
    <div class="sf-card">
      <span class="sn-cap">毛玻璃虚化 · 仅限浮层</span>
      <div class="sf-blur-stage">
        <span class="sf-glass" style="backdrop-filter:blur(var(--sn-blur-sm));-webkit-backdrop-filter:blur(var(--sn-blur-sm))">8px · sm</span>
        <span class="sf-glass" style="backdrop-filter:blur(var(--sn-blur-md));-webkit-backdrop-filter:blur(var(--sn-blur-md))">16px · md</span>
        <span class="sf-glass" style="backdrop-filter:blur(var(--sn-blur-lg));-webkit-backdrop-filter:blur(var(--sn-blur-lg))">24px · lg</span>
      </div>
    </div>
    <div class="sf-card">
      <span class="sn-cap">克制功能渐变 · 严禁装饰</span>
      <div class="sf-grads">
        <div class="sf-grad-scrim">
          <span>--sn-grad-scrim</span>
          <small>照片压字护读底罩</small>
        </div>
        <div class="sf-grad-fade">
          <span>--sn-grad-fade</span>
          <small>列表边界融合渐隐</small>
        </div>
      </div>
    </div>
  </div>
</div>
