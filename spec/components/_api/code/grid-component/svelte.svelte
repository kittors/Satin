<script>
  import DataGrid from "satin-ui/svelte/DataGrid.svelte";

  let seed = $state(11);
</script>

<div class="sn-stack sn-gap-8">
  <div class="sn-row">
    <button type="button" class="sn-btn sn-secondary sn-sm" onclick={() => seed++}>换一批数据</button>
    <span class="sn-help">种子 {seed}</span>
  </div>
  <!-- rows、seed 只在创建时用（数据在后台线程里按它们生成）：变了组件自己换一张新表 -->
  <DataGrid rows={2000} {seed} label="镜头清单" />
</div>
