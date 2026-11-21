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
  <div class="sn-field">
    <span class="sn-lbl">交付日期</span>
    <div class="sn-pk" data-pk="date">
      <button class="sn-pk-trigger" type="button" aria-haspopup="dialog">
        <span class="sn-val sn-ph" data-ph="选择日期">选择日期</span>
        <span class="sn-end sn-swap">
          <span class="sn-a" data-i="calendar"></span>
          <span class="sn-b" data-i="x" role="button" aria-label="清除"></span>
        </span>
      </button>
      <div class="sn-pk-panel" role="dialog" aria-label="选择日期">
        <div class="sn-cal-slot"></div>
        <div class="sn-pk-foot">
          <button class="sn-btn sn-ghost sn-sm" type="button" data-today="">今天</button>
          <span class="sn-grow"></span>
          <button class="sn-btn sn-ghost sn-sm" type="button" data-clear="">清除</button>
        </div>
      </div>
    </div>
  </div>
</div>
