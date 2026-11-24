import { For, createSignal, flush } from "solid-js";
import { flipSnapshot, icon, removeWithFlip, toast } from "satin-ui";

const TAGS = ["雨夜", "车站", "第三集", "悬疑", "长镜头", "暖色调"];

export default function TagEditorUndo() {
  const [tags, setTags] = createSignal<string[]>(TAGS), els = new Map<string, HTMLElement>();
  let box!: HTMLDivElement, input!: HTMLInputElement;
  // 新的一项从它该在的位置出现，其余让位：改数据之前记下位置，DOM 更新以后播（flush 让 DOM 当场更新）
  const add = (t: string, at = tags().length) => {
    if (!t || tags().includes(t)) return;
    const play = flipSnapshot(box);
    setTags((xs) => [...xs.slice(0, at), t, ...xs.slice(at)]);
    flush();
    play(els.get(t));
  };
  const submit = () => { add(input.value.trim()); input.value = ""; };
  // 删除：先脱离布局淡出，剩下的用弹簧补位（keep：节点留给 Solid 删），播完再从数据里删
  const remove = async (t: string) => {
    const at = tags().indexOf(t);
    await removeWithFlip(els.get(t), { keep: true });
    setTags((xs) => xs.filter((x) => x !== t));
    // 删掉的能撤销：撤销后按"新增"的方式回到原来的位置
    toast({ kind: "action", text: `已移除标签"${t}"`, action: { label: "撤销", run: (h) => { add(t, at); h.update({ kind: "status", text: `已恢复"${t}"`, done: true, duration: 2000 }); } } });
  };
  return (
    <div>
      <div class="sn-add-row">
        <input class="sn-input" placeholder="添加一个标签，回车确认" aria-label="添加标签" ref={(el) => (input = el)} onKeyDown={(e) => e.key === "Enter" && !e.isComposing && submit()} />
        <button type="button" class="sn-btn sn-secondary" onClick={submit}>添加</button>
      </div>
      <div class="sn-chips-box" ref={(el) => (box = el)}>
        <For each={tags()}>{(t) => (
          <span class="sn-chip sn-tag sn-on" ref={(el) => els.set(t, el)}>{t}<button type="button" class="sn-x" aria-label={"移除 " + t} onClick={() => remove(t)} innerHTML={icon("x")} /></span>
        )}</For>
      </div>
    </div>
  );
}
