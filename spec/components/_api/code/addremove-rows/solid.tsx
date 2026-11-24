import { For, createSignal, flush } from "solid-js";
import { flipSnapshot, icon, removeWithFlip } from "satin-ui";

const ROWS = [{ id: 1, name: "镜头 07 · 车站外，雨刚停" }, { id: 2, name: "镜头 08 · 林夏走进候车厅" }, { id: 3, name: "镜头 09 · 站台上的最后一班车" }];

export default function ShotRows() {
  const [rows, setRows] = createSignal(ROWS), els = new Map<number, HTMLElement>();
  let list!: HTMLDivElement, seq = 0;
  // 新建的一行插在最前面，下面的往下让：改数据之前记下位置，DOM 更新以后播（flush 让 DOM 当场更新）
  const add = () => {
    const row = { id: `new-${++seq}`, name: `新镜头 ${seq}` };
    const play = flipSnapshot(list);
    setRows((xs) => [row, ...xs]);
    flush();
    play(els.get(row.id));
  };
  // 删一行：先脱离布局淡出，下面的用弹簧补位（keep：节点留给 Solid 删），播完再从数据里删
  const remove = async (id: number) => {
    await removeWithFlip(els.get(id), { keep: true });
    setRows((xs) => xs.filter((x) => x.id !== id));
  };
  return (
    <div class="sn-stack sn-gap-12">
      <div class="sn-row"><button type="button" class="sn-btn sn-secondary" onClick={add}>新建镜头</button></div>
      <div class="sn-stack sn-gap-8" ref={(el) => (list = el)}>
        <For each={rows()}>{(r) => (
          <div class="sn-opt-row" ref={(el) => els.set(r.id, el)}>
            <span class="sn-nm">{r.name}</span>
            <button type="button" class="sn-btn sn-ghost sn-sm sn-ibtn" aria-label={"删除 " + r.name} onClick={() => remove(r.id)} innerHTML={icon("trash-2")} />
          </div>
        )}</For>
      </div>
    </div>
  );
}
