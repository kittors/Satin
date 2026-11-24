<script lang="ts">
  import { onMount } from "svelte";
  import { setup, enhance, injectIcons } from "satin-ui";
  import { bindSelects, copied } from "satin-ui/components";
  import "satin-ui/css/buttons.css";
  import "satin-ui/css/overlay.css";

  let root!: HTMLDivElement;
  onMount(() => {
    if (!root) return;
    const unsetup = setup();
    const off = enhance(root, (root: any) => {
      bindSelects(document); // 分裂按钮的备选菜单

      // 复制按钮：写入剪贴板，成功后图标换成对勾 1.2 秒
      for (const b of root.querySelectorAll("[data-copy]")) {
        b.addEventListener("click", async () => {
          await navigator.clipboard.writeText(b.dataset.copy);
          copied(b);
        });
      }
    });
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div class="sn-group">
    <button class="sn-btn sn-secondary sn-ibtn" data-tip="上一个" data-i="chevron-left"></button>
    <button class="sn-btn sn-secondary sn-ibtn" data-tip="下一个" data-i="chevron-right"></button>
  </div>
  <div class="sn-group sn-split sn-select sn-inline-menu">
    <button class="sn-btn sn-primary">导出成片</button>
    <button class="sn-btn sn-primary sn-more" data-menubtn="" data-tip="更多导出方式" data-i="chevron-down"></button>
    <div class="sn-menu sn-end" role="menu">
      <div class="sn-item">MP4（1080p）</div>
      <div class="sn-item">MP4（4K）</div>
    </div>
  </div>
  <button class="sn-btn sn-ghost sn-ibtn" data-copy="https://example.com/s/7f3k2q" data-tip="复制链接">
    <span class="sn-swap">
      <span class="sn-a" data-i="copy"></span>
      <span class="sn-b" data-i="check"></span>
    </span>
  </button>
</div>
