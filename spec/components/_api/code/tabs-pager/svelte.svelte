<script>
  import Pager from "satin-ui/svelte/Pager.svelte";

  let page = $state(1);
</script>

<div class="sn-stack sn-gap-8">
  <Pager total={13} count={128} bind:page={page} />
  <span class="sn-help">第 {page} 页</span>
</div>
