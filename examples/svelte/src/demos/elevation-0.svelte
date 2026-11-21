<script>
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import "./elevation-0.css";

  let root;
  onMount(() => {
    const unsetup = setup();
    const off = enhance(root);
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div class="elev e0">
    <b>卡片</b>
    <span class="sn-t-caption sn-c-tertiary">raised + 1px 描边</span>
  </div>
  <div class="elev e1">
    <b>浮层</b>
    <span class="sn-t-caption sn-c-tertiary">菜单、Popover、通知</span>
  </div>
  <div class="elev e2">
    <b>对话框</b>
    <span class="sn-t-caption sn-c-tertiary">对话框、抽屉</span>
  </div>
</div>
