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
  <div class="sn-row">
    <button type="button" class="sn-btn sn-primary sn-sm">保存修改</button>
    <button type="button" class="sn-btn sn-primary">保存修改</button>
    <button type="button" class="sn-btn sn-primary sn-lg">保存修改</button>
  </div>
</div>
