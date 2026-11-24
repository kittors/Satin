<script lang="ts">
  const STEPS = ["导入原文", "拆分章节", "生成分镜", "配音"];
  let cur = $state(1);
</script>

<div class="sn-stack sn-gap-12">
  <div class="sn-steps">
    {#each STEPS as s, i (s)}
      {#if i}<span class="sn-ln" class:sn-done={i <= cur}><i></i></span>{/if}
      <span class="sn-st" class:sn-done={i < cur} class:sn-cur={i === cur}><span class="sn-n">{i + 1}</span>{s}</span>
    {/each}
  </div>
  <div class="sn-row">
    <button type="button" class="sn-btn sn-secondary sn-sm" disabled={cur === 0} onclick={() => cur--}>上一步</button>
    <button type="button" class="sn-btn sn-primary sn-sm" disabled={cur === STEPS.length - 1} onclick={() => cur++}>下一步</button>
  </div>
</div>
