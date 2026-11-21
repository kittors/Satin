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
  <div class="sn-select">
    <button type="button" class="sn-btn sn-secondary" data-menubtn="" data-prefix="排序：" data-i="chevron-down:caret">排序：最近更新</button>
    <div class="sn-menu" role="menu">
      <div class="sn-item sn-sel" data-i="check:chk">最近更新</div>
      <div class="sn-item" data-i="check:chk">名称</div>
      <div class="sn-item" data-i="check:chk">创建时间</div>
    </div>
  </div>
</div>
