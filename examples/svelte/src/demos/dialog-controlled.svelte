<script>
  import { onMount } from "svelte";
  import { setup, enhance, closeDialog, toast } from "satin-ui";

  let root;
  onMount(() => {
    const unsetup = setup();
    const off = enhance(root, (root) => {
      const dlg = root.querySelector("#dlg-ctl");
      dlg.querySelector("form").addEventListener("submit", () => {
        const name = dlg.querySelector("input").value.trim() || "未命名项目";
        closeDialog(dlg);
        toast({ text: "已创建：" + name });
      });
    });
    return () => { off(); unsetup(); };
  });
</script>

<div bind:this={root}>
  <button type="button" class="sn-btn sn-primary" data-dlg="dlg-ctl">新建项目</button>
  <dialog class="sn-dlg" id="dlg-ctl" aria-labelledby="dlg-ctl-t">
    <form method="dialog">
      <div class="sn-hd">
        <div style="flex:1">
          <h3 id="dlg-ctl-t">新建项目</h3>
          <div class="sn-sub">名称之后随时可以改。</div>
        </div>
      </div>
      <div class="sn-bd">
        <div class="sn-field">
          <label class="sn-lbl" for="dlg-ctl-name">项目名称</label>
          <input class="sn-input" id="dlg-ctl-name" placeholder="比如：雨夜车站" autocomplete="off">
        </div>
      </div>
      <div class="sn-ft">
        <button type="button" class="sn-btn sn-ghost" data-cancel="">取消</button>
        <button type="submit" class="sn-btn sn-primary">创建项目</button>
      </div>
    </form>
  </dialog>
</div>
