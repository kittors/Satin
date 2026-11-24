<script lang="ts">
  import Dialog from "satin-ui/svelte/Dialog.svelte";
  import { toast } from "satin-ui";

  const nameId = $props.id();
  let open = $state(false), name = $state("雨夜车站");
  // 弹窗不会因为提交自己关：在这里保存，成功了再关
  function save() {
    open = false;
    toast({ text: "已改名为：" + name.trim() });
  }
</script>

<button type="button" class="sn-btn sn-primary" onclick={() => (open = true)}>重命名</button>
<Dialog bind:open title="重命名项目" description="新名称会同步给所有协作者。" onsubmit={save}>
  <div class="sn-field">
    <label class="sn-lbl" for={nameId}>项目名称</label>
    <input class="sn-input" id={nameId} bind:value={name} autocomplete="off" />
  </div>
  {#snippet footer()}
    <!-- data-cancel：和 Esc 一样关上 -->
    <button type="button" class="sn-btn sn-ghost" data-cancel>取消</button>
    <button type="submit" class="sn-btn sn-primary">保存</button>
  {/snippet}
</Dialog>
