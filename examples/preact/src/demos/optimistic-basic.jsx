import { useRef, useState } from "react";
import { optimistic } from "satin-ui";
import { Icon } from "satin-ui/react";

// 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
let n = 0;
const save = () => new Promise((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));

export default function Favorite() {
  const [star, setStar] = useState({ on: false, count: 24 }), row = useRef(null);
  const toggle = () => {
    const next = !star.on, d = next ? 1 : -1;
    // 先显示结果再保存；保存失败：改回去、这一行抖两下、弹出带"重试"的提示
    optimistic({
      shake: row.current,
      apply: () => setStar((s) => ({ on: next, count: s.count + d })),
      revert: () => setStar((s) => ({ on: !next, count: s.count - d })),
      save,
    });
  };
  return (
    <div class="sn-opt-row" ref={row}>
      <span class="sn-nm">雨夜车站</span>
      <button type="button" className={star.on ? "sn-star sn-on" : "sn-star"} aria-pressed={String(star.on)} aria-label="收藏" onClick={toggle}>
        <Icon name="star" />
        <span class="sn-n">{star.count}</span>
      </button>
    </div>
  );
}
