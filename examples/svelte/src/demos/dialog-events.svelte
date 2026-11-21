<script>
  import { onMount } from "svelte";
  import { setup, enhance } from "satin-ui";

  let root;
  onMount(() => {
    const unsetup = setup();
    const off = enhance(root, (root) => {
      const out = root.querySelector('[data-ex="dlg-ev"] [data-out]');
      root.querySelector("#dlg-ev-d").addEventListener("close", () => {
        out.textContent = "关上了：" + new Date().toLocaleTimeString("zh-CN");
      });
    });
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <div class="sn-row" data-ex="dlg-ev">
    <button type="button" class="sn-btn sn-secondary" data-dlg="dlg-ev-d">导出设置</button>
    <span class="sn-help" data-out="">还没打开过</span>
  </div>
  <dialog class="sn-dlg" id="dlg-ev-d" aria-labelledby="dlg-ev-t">
    <form method="dialog">
      <div class="sn-hd">
        <div style="flex:1">
          <h3 id="dlg-ev-t">导出设置</h3>
          <div class="sn-sub">按 Esc 或点"关闭"，看下面那行字怎么变。</div>
        </div>
      </div>
      <div class="sn-ft">
        <button type="button" class="sn-btn sn-primary" data-cancel="">关闭</button>
      </div>
    </form>
  </dialog>
</div>
