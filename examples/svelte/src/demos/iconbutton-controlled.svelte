<script lang="ts">
  import Icon from "satin-ui/svelte/Icon.svelte";

  let on = $state(true);
  const tip = $derived(on ? "网格（已打开）" : "网格（已关上）");
</script>

<div class="sn-row">
  <button type="button" class="sn-btn sn-ghost sn-ibtn" class:sn-selected={on} aria-pressed={on} data-tip={tip} aria-label={tip} onclick={() => (on = !on)}><Icon name="layout-grid" /></button>
</div>
