<script>
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";

  let root;
  onMount(() => {
    const unsetup = setup();
    const off = enhance(root, (root) => {
      const box = root.querySelector('[data-ex="due"]');
      box.addEventListener("pick", (e) => {
        box.querySelector("[data-out]").textContent = e.detail.text ? "交付日期：" + e.detail.text : "还没选交付日期";
      });
    });
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div class="sn-stack sn-gap-8" data-ex="due">
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
    <span class="sn-help" data-out="">还没选交付日期</span>
  </div>
</div>
