<script lang="ts">
  import Segmented from "satin-ui/svelte/Segmented.svelte";

  const RANGES = ["7 天", "30 天", "全部"];
  let range = $state("30 天");
</script>

<div class="sn-stack sn-gap-8">
  <Segmented items={RANGES} bind:value={range} label="时间范围" />
  <span class="sn-help">{range === "全部" ? "显示全部数据" : `显示最近 ${range}的数据`}</span>
</div>
