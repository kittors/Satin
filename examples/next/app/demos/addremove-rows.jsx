"use client";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { flipSnapshot, removeWithFlip } from "satin-ui";
import { Button } from "satin-ui/react";

const ROWS = [{ id: 1, name: "镜头 07 · 车站外，雨刚停" }, { id: 2, name: "镜头 08 · 林夏走进候车厅" }, { id: 3, name: "镜头 09 · 站台上的最后一班车" }];

export default function ShotRows() {
  const [rows, setRows] = useState(ROWS), list = useRef(null), els = useRef(new Map()), seq = useRef(0);
  // 新建的一行插在最前面，下面的往下让：改数据之前记下位置，DOM 更新以后播（flushSync 让 DOM 当场更新）
  const add = () => {
    const row = { id: `new-${++seq.current}`, name: `新镜头 ${seq.current}` };
    const play = flipSnapshot(list.current);
    flushSync(() => setRows((xs) => [row, ...xs]));
    play(els.current.get(row.id));
  };
  // 删一行：先脱离布局淡出，下面的用弹簧补位（keep：节点留给 React 删），播完再从数据里删
  const remove = async (id) => {
    await removeWithFlip(els.current.get(id), { keep: true });
    setRows((xs) => xs.filter((x) => x.id !== id));
  };
  return (
    <div className="sn-stack sn-gap-12">
      <div className="sn-row"><Button onClick={add}>新建镜头</Button></div>
      <div className="sn-stack sn-gap-8" ref={list}>
        {rows.map((r) => (
          <div key={r.id} className="sn-opt-row" ref={(el) => (el ? els.current.set(r.id, el) : els.current.delete(r.id))}>
            <span className="sn-nm">{r.name}</span>
            <Button variant="ghost" size="sm" icon="trash-2" aria-label={"删除 " + r.name} onClick={() => remove(r.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
