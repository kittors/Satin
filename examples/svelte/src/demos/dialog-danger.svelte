<script lang="ts">
  import Dialog from "satin-ui/svelte/Dialog.svelte";
  import Icon from "satin-ui/svelte/Icon.svelte";
  import { toast } from "satin-ui";

  let open = $state(false);
  function remove() {
    open = false;
    toast({ text: '已删除"雨夜车站"' });
  }
</script>

<button type="button" class="sn-btn sn-danger-soft" onclick={() => (open = true)}><Icon name="trash-2" />删除项目…</button>
<Dialog bind:open icon="trash-2" title='删除"雨夜车站"？' description="删除后无法恢复，协作者也会失去访问权限。" onsubmit={remove}>
  <!-- 写清会一起删掉什么 -->
  <div class="sn-impact"><b>将一起删除</b><ul><li>12 个镜头和全部画面版本</li><li>3 段配音、2 个已导出的成片</li></ul></div>
  {#snippet footer()}
    <button type="button" class="sn-btn sn-ghost" data-cancel>取消</button>
    <button type="submit" class="sn-btn sn-danger">删除项目</button>
  {/snippet}
</Dialog>
