<script lang="ts">
  import { flushSync } from "svelte";
  import { flipSnapshot, removeWithFlip } from "satin-ui";
  import Icon from "satin-ui/svelte/Icon.svelte";

  let rows = $state([{ id: 1, name: "镜头 07 · 车站外，雨刚停" }, { id: 2, name: "镜头 08 · 林夏走进候车厅" }, { id: 3, name: "镜头 09 · 站台上的最后一班车" }]);
  let list!: HTMLDivElement;
  let seq = 0;
  const els = new Map<number, HTMLElement>();
  const keep = (el: HTMLElement, id: number) => { els.set(id, el); return { destroy: () => els.delete(id) }; };
  // 新建的一行插在最前面，下面的往下让：改数据之前记下位置，DOM 更新以后播（flushSync 让 DOM 当场更新）
  const add = () => {
    const row = { id: `new-${++seq}`, name: `新镜头 ${seq}` };
    const play = flipSnapshot(list);
    flushSync(() => rows.unshift(row));
    play(els.get(row.id));
  };
  // 删一行：先脱离布局淡出，下面的用弹簧补位（keep：节点留给 Svelte 删），播完再从数据里删
  const remove = async (id: number) => {
    await removeWithFlip(els.get(id), { keep: true });
    rows = rows.filter((x) => x.id !== id);
  };
</script>

<div class="sn-stack sn-gap-12">
  <div class="sn-row"><button type="button" class="sn-btn sn-secondary" onclick={add}>新建镜头</button></div>
  <div class="sn-stack sn-gap-8" bind:this={list}>
    {#each rows as r (r.id)}
      <div class="sn-opt-row" use:keep={r.id}>
        <span class="sn-nm">{r.name}</span>
        <button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" aria-label={"删除 " + r.name} onclick={() => remove(r.id)}><Icon name="trash-2" /></button>
      </div>
    {/each}
  </div>
</div>
