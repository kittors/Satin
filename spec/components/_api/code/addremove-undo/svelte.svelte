<script>
  import { flushSync } from "svelte";
  import { flipSnapshot, removeWithFlip, toast } from "satin-ui";
  import Icon from "satin-ui/svelte/Icon.svelte";

  let tags = $state(["雨夜", "车站", "第三集", "悬疑", "长镜头", "暖色调"]);
  let text = $state("");
  let box;
  const els = new Map();
  // 记下每个标签的元素（出现、收起动画要用）
  const keep = (el, t) => { els.set(t, el); return { destroy: () => els.delete(t) }; };
  // 新的一项从它该在的位置出现，其余让位：改数据之前记下位置，DOM 更新以后播（flushSync 让 DOM 当场更新）
  const add = (t, at = tags.length) => {
    if (!t || tags.includes(t)) return;
    const play = flipSnapshot(box);
    flushSync(() => tags.splice(at, 0, t));
    play(els.get(t));
  };
  const submit = () => { add(text.trim()); text = ""; };
  // 删除：先脱离布局淡出，剩下的用弹簧补位（keep：节点留给 Svelte 删），播完再从数据里删
  const remove = async (t) => {
    const at = tags.indexOf(t);
    await removeWithFlip(els.get(t), { keep: true });
    tags = tags.filter((x) => x !== t);
    // 删掉的能撤销：撤销后按"新增"的方式回到原来的位置
    toast({ kind: "action", text: `已移除标签"${t}"`, action: { label: "撤销", run: (h) => { add(t, at); h.update({ kind: "status", text: `已恢复"${t}"`, done: true, duration: 2000 }); } } });
  };
</script>

<div>
  <div class="sn-add-row">
    <input class="sn-input" placeholder="添加一个标签，回车确认" aria-label="添加标签" bind:value={text} onkeydown={(e) => e.key === "Enter" && !e.isComposing && submit()} />
    <button type="button" class="sn-btn sn-secondary" onclick={submit}>添加</button>
  </div>
  <div class="sn-chips-box" bind:this={box}>
    {#each tags as t (t)}
      <span class="sn-chip sn-tag sn-on" use:keep={t}>{t}<button type="button" class="sn-x" aria-label={"移除 " + t} onclick={() => remove(t)}><Icon name="x" /></button></span>
    {/each}
  </div>
</div>
