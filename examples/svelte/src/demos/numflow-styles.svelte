<script>
  import NumberFlow from "satin-ui/svelte/NumberFlow.svelte";

  let n = $state(2026);
</script>

<div class="sn-row">
  <!-- value 变了只动变了的那几位；effect 换变化的样子：roll 滚动（默认）/ blur 模糊 / push 推入 / fade 淡入 -->
  <NumberFlow value={n} effect="blur" />
  <button type="button" class="sn-btn sn-secondary sn-sm" onclick={() => (n += 137)}>+137</button>
</div>
