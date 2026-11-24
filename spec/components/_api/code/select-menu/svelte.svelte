<script lang="ts">
  import Icon from "satin-ui/svelte/Icon.svelte";

  const sorts = ["最近更新", "名称", "创建时间"];
</script>

<sn-enhance>
  <div class="sn-select">
    <button type="button" class="sn-btn sn-secondary" data-menubtn data-prefix="排序：">排序：最近更新<Icon name="chevron-down" class="sn-caret" /></button>
    <div class="sn-menu" role="menu">
      {#each sorts as s, i (s)}
        <div class={i === 0 ? "sn-item sn-sel" : "sn-item"}>{s}<span class="sn-chk"><Icon name="check" /></span></div>
      {/each}
    </div>
  </div>
</sn-enhance>
