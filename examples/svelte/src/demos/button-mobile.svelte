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
  <div class="sn-bottom-bar">
    <span class="sn-grow sn-num">合计 ¥ 1,280</span>
    <button type="button" class="sn-btn sn-primary sn-lg">提交订单</button>
  </div>
</div>
