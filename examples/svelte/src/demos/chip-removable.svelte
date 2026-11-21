<script>
  import { removeChip } from "satin-ui";
  import Icon from "satin-ui/svelte/Icon.svelte";

  let tags = $state(["雨夜", "车站", "列车"]);
  // 先播收起动画（keep：节点交给 Svelte 删），放完再从数组里删
  const remove = (e, t) => removeChip(e.currentTarget.parentElement, { keep: true, onRemoved: () => (tags = tags.filter((x) => x !== t)) });
</script>

<div class="sn-row">
  {#each tags as t (t)}
    <span class="sn-chip sn-tag sn-on">{t}<button type="button" class="sn-x" aria-label="移除 {t}" onclick={(e) => remove(e, t)}><Icon name="x" /></button></span>
  {/each}
</div>
