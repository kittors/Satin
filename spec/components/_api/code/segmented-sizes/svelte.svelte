<script>
  import Segmented from "satin-ui/svelte/Segmented.svelte";
</script>

<div class="sn-row">
  <Segmented items={["全部","进行中","已完成"]} value="全部" size="sm" label="状态" />
  <button type="button" class="sn-btn sn-secondary sn-sm">导出</button>
</div>
