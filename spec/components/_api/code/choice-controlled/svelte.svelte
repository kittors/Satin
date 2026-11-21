<script>
  const SHOTS = ["开场", "车站", "雨夜"];
  let picked = $state(["开场"]);
  let allBox;
  const all = $derived(picked.length === SHOTS.length);
  // 半选只能用属性设（没有对应的 HTML 属性）
  $effect(() => { allBox.indeterminate = picked.length > 0 && !all; });
</script>

<div class="sn-stack sn-gap-8">
  <label class="sn-check"><input type="checkbox" bind:this={allBox} checked={all} onchange={(e) => (picked = e.currentTarget.checked ? [...SHOTS] : [])} />{@render box()}全选</label>
  {#each SHOTS as s (s)}
    <label class="sn-check"><input type="checkbox" value={s} bind:group={picked} />{@render box()}{s}</label>
  {/each}
</div>

<!-- 复选框的方框：对勾和半选的横线 -->
{#snippet box()}<span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5" /></svg><span class="sn-bar"></span></span>{/snippet}
