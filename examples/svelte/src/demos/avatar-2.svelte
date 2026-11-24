<script lang="ts">
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import { defineElements } from "satin-ui/elements";
  defineElements();

  let root!: HTMLDivElement;
  onMount(() => {
    if (!root) return;
    const unsetup = setup();
    const off = enhance(root);
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div class="sn-set-list" style="max-width:420px">
    <div class="sn-set-row">
      <sn-avatar name="何慧" decorative="" status="online"></sn-avatar>
      <div class="sn-tx">
        <b>何慧</b>
        <span>前端开发</span>
      </div>
    </div>
    <div class="sn-set-row">
      <sn-avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&amp;fit=crop&amp;w=128&amp;h=128&amp;q=80" name="黄磊" decorative=""></sn-avatar>
      <div class="sn-tx">
        <b>黄磊</b>
        <span>产品设计</span>
      </div>
    </div>
    <div class="sn-set-row">
      <sn-avatar name="徐丽" decorative=""></sn-avatar>
      <div class="sn-tx">
        <b>徐丽</b>
        <span>财务顾问</span>
      </div>
    </div>
  </div>
</div>
