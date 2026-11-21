<script>
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import { createDataGrid } from "satin-ui/grid";

  let root;
  onMount(() => {
    const unsetup = setup();
    const off = enhance(root, (root) => {
      createDataGrid(root.querySelector('[data-ex="grid3"]'), { rows: 100000, seed: 11 });
    });
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div data-ex="grid3"></div>
</div>
