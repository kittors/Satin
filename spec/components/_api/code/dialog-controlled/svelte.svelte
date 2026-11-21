<script>
  import Dialog from "satin-ui/svelte/Dialog.svelte";
  import { toast } from "satin-ui";

  const nameId = $props.id();
  let open = $state(false), name = $state("");
  function create() {
    open = false;
    toast({ text: "已创建：" + (name.trim() || "未命名项目") });
  }
</script>

<button type="button" class="sn-btn sn-primary" onclick={() => (open = true)}>新建项目</button>
<!-- 开关放在自己的状态里：bind:open，关上（Esc、取消、程序关）以后自动改回 false -->
<Dialog bind:open title="新建项目" description="名称之后随时可以改。" onsubmit={create}>
  <div class="sn-field">
    <label class="sn-lbl" for={nameId}>项目名称</label>
    <input class="sn-input" id={nameId} placeholder="比如：雨夜车站" autocomplete="off" bind:value={name} />
  </div>
  {#snippet footer()}
    <button type="button" class="sn-btn sn-ghost" data-cancel>取消</button>
    <button type="submit" class="sn-btn sn-primary">创建项目</button>
  {/snippet}
</Dialog>
