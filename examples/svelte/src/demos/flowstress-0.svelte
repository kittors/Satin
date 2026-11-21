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

</div>
