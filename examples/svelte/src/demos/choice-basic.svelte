<script>
  let autosave = $state(true);
  let remind = $state(false);
</script>

<div class="sn-stack sn-gap-8">
  <label class="sn-check"><input type="checkbox" bind:checked={autosave} />{@render box()}自动保存草稿</label>
  <label class="sn-switch"><input type="checkbox" role="switch" bind:checked={remind} /><span class="sn-track"><span class="sn-knob"></span></span>生成完成后提醒我</label>
</div>

<!-- 复选框的方框：对勾和半选的横线 -->
{#snippet box()}<span class="sn-box"><svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 6.2l2.4 2.4 4.6-5" /></svg><span class="sn-bar"></span></span>{/snippet}
