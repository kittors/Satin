<script>
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";

  let root;
  onMount(() => {
    const unsetup = setup();
    const off = enhance(root);
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div class="sn-row sn-between">
    <button type="button" class="sn-btn sn-ghost">不保存</button>
    <div class="sn-row sn-gap-8">
      <button type="button" class="sn-btn sn-secondary">取消</button>
      <button type="button" class="sn-btn sn-primary">保存</button>
    </div>
  </div>
</div>
