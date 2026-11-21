<script>
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";
  import { createDataGrid } from "satin-ui/grid";

  let root;
  onMount(() => {
    const unsetup = setup();
    const off = enhance(root, (root) => {
      const grid = createDataGrid(root.querySelector('[data-ex="grid"]'), { rows: 100000 });
      // 不用了（换页、卸载）记得：grid.destroy();
      void grid;
    });
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div data-ex="grid"></div>
</div>
