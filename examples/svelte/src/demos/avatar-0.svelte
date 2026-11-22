<script>
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import { defineElements } from "satin-ui/elements";
  import "./avatar-0.css";
  defineElements();

  let root;
  onMount(() => {
    const unsetup = setup();
    const off = enhance(root);
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div class="row" style="gap:14px">
    <sn-avatar seed="u4" name="周屿" size="16"></sn-avatar>
    <sn-avatar seed="u4" name="周屿" size="20"></sn-avatar>
    <sn-avatar seed="u4" name="周屿" size="24"></sn-avatar>
    <sn-avatar seed="u4" name="周屿"></sn-avatar>
    <sn-avatar seed="u4" name="周屿" size="40"></sn-avatar>
    <sn-avatar seed="u4" name="周屿" size="64"></sn-avatar>
  </div>
</div>
