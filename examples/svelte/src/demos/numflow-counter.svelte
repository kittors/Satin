<script lang="ts">
  import NumberFlow from "satin-ui/svelte/NumberFlow.svelte";

  let n = $state(128);
</script>

<div class="sn-row">
  <!-- value 变了只动变了的那几位 -->
  <NumberFlow value={n} />
  <button type="button" class="sn-btn sn-secondary sn-sm" onclick={() => (n += 1)}>+1</button>
  <button type="button" class="sn-btn sn-secondary sn-sm" onclick={() => (n -= 12)}>-12</button>
</div>
