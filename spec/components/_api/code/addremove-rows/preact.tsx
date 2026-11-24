import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { flipSnapshot, removeWithFlip } from "satin-ui";
import { Button } from "satin-ui/react";

interface ShotRow { id: number | string; name: string }

const ROWS: ShotRow[] = [{ id: 1, name: "镜头 07 · 车站外，雨刚停" }, { id: 2, name: "镜头 08 · 林夏走进候车厅" }, { id: 3, name: "镜头 09 · 站台上的最后一班车" }];

export default function ShotRows() {
  const [rows, setRows] = useState<ShotRow[]>(ROWS), list = useRef<HTMLDivElement>(null), els = useRef(new Map<number | string, HTMLDivElement>()), seq = useRef(0);
  // 新建的一行插在最前面，下面的往下让：改数据之前记下位置，DOM 更新以后播（flushSync 让 DOM 当场更新）
  const add = () => {
    const row = { id: `new-${++seq.current}`, name: `新镜头 ${seq.current}` };
    if (!list.current) return;
    const play = flipSnapshot(list.current);
    flushSync(() => setRows((xs) => [row, ...xs]));
    play(els.current.get(row.id));
  };
  // 删一行：先脱离布局淡出，下面的用弹簧补位（keep：节点留给 React 删），播完再从数据里删
  const remove = async (id: number | string) => {
    const el = els.current.get(id);
    if (el) await removeWithFlip(el, { keep: true });
    setRows((xs) => xs.filter((x) => x.id !== id));
  };
  return (
    <div class="sn-stack sn-gap-12">
      <div class="sn-row"><Button onClick={add}>新建镜头</Button></div>
      <div class="sn-stack sn-gap-8" ref={list}>
        {rows.map((r) => (
          <div key={r.id} class="sn-opt-row" ref={(el) => { if (el) els.current.set(r.id, el); else els.current.delete(r.id); }}>
            <span class="sn-nm">{r.name}</span>
            <Button variant="ghost" size="sm" icon="trash-2" aria-label={"删除 " + r.name} onClick={() => remove(r.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
