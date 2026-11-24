<script lang="ts">
  import Icon from "satin-ui/svelte/Icon.svelte";

  const STATUS = ["进行中", "已完成", "失败", "已归档"];
  let picked = $state(["进行中"]);
  const toggle = (s: string) => (picked = picked.includes(s) ? picked.filter((x) => x !== s) : [...picked, s]);
</script>

<div class="sn-row">
  {#each STATUS as s (s)}
    <button type="button" class="sn-chip" class:sn-on={picked.includes(s)} aria-pressed={picked.includes(s)} onclick={() => toggle(s)}><Icon name="check" />{s}</button>
  {/each}
</div>
