<script>
  import Dialog from "satin-ui/svelte/Dialog.svelte";

  let open = $state(false), status = $state("还没打开过");
  // 关完（Esc、取消、程序关）都会调 onclose：在这里同步自己的状态（bind:open 已经改回 false）
  function closed() {
    status = "关上了：" + new Date().toLocaleTimeString("zh-CN");
  }
</script>

<div class="sn-row">
  <button type="button" class="sn-btn sn-secondary" onclick={() => (open = true)}>导出设置</button>
  <span class="sn-help">{status}</span>
</div>
<Dialog bind:open title="导出设置" description='按 Esc 或点"关闭"，看下面那行字怎么变。' onclose={closed}>
  {#snippet footer()}
    <button type="button" class="sn-btn sn-primary" data-cancel>关闭</button>
  {/snippet}
</Dialog>
