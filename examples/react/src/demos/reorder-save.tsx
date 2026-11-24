import { useEffect, useRef } from "react";
import { createReorder, flipSnapshot, optimistic } from "satin-ui";
import { Icon } from "satin-ui/react";

const SHOTS = [
  { no: "07", name: "镜头 07 · 车站外，雨刚停", meta: "远景 · 4 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "08", name: "镜头 08 · 林夏走进候车厅", meta: "全景 · 6 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "09", name: "镜头 09 · 站台上的最后一班车", meta: "中景 · 5 秒", thumb: "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "10", name: "镜头 10 · 车窗里的倒影", meta: "特写 · 3 秒", thumb: "https://images.unsplash.com/photo-1516900557549-41557d405adf?auto=format&fit=crop&w=96&h=56&q=72" },
  { no: "11", name: "镜头 11 · 雨夜里的公交站", meta: "近景 · 4 秒", thumb: "https://images.unsplash.com/photo-1576514864427-f0809d2b66eb?auto=format&fit=crop&w=96&h=56&q=72" },
];
// 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
let n = 0;
const save = () => new Promise<void>((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));
// 把一行挪到第 i 位，别的行平滑让位（已经在那儿就不动）
const moveTo = (list: HTMLElement | null, row: HTMLElement, i: number) => {
  if (!list) return;
  const rows = [...list.querySelectorAll(".sn-drag-row")];
  if (rows.indexOf(row) === i) return;
  const play = flipSnapshot(list), rest = rows.filter((r) => r !== row);
  list.insertBefore(row, rest[i] || null);
  play();
};

export default function ShotOrderSave() {
  const list = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // 按住左边的把手拖（移动 4px 才算拿起）；键盘：把手上按空格拿起，上下键移动，空格放下、Esc 取消
    // 行由库直接挪（不经过框架重画）：列表照初始顺序画一次，新顺序从 onReorder 里拿
    // 放下就保存（乐观更新）：保存失败时这一行回到原位、抖两下，给"重试"
    if (!list.current) return;
    const r = createReorder(list.current, { onReorder: ({ from, to, row }) => optimistic({ shake: row, apply: () => moveTo(list.current, row, to), revert: () => moveTo(list.current, row, from), save }) });
    return () => r.destroy();
  }, []);
  return (
    <div className="sn-drag-list" ref={list}>
      {SHOTS.map((s) => (
        <div key={s.no} className="sn-drag-row">
          <button type="button" className="sn-grip" aria-label={"拖动排序：" + s.name}><Icon name="grip-vertical" /></button>
          <span className="sn-cv" style={{ "--sn-g": `url(${s.thumb}) center / cover` }} />
          <b>{s.name}</b>
          <span className="sn-m">{s.meta}</span>
        </div>
      ))}
    </div>
  );
}
