import { createSignal } from "solid-js";
import { optimistic } from "satin-ui";

// 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
let n = 0;
const save = () => new Promise<void>((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));

export default function Favorite() {
  const [on, setOn] = createSignal(false), [count, setCount] = createSignal(24);
  let row!: HTMLDivElement;
  const toggle = () => {
    const next = !on(), d = next ? 1 : -1;
    // 先显示结果再保存；保存失败：改回去、这一行抖两下、弹出带"重试"的提示
    optimistic({
      shake: row,
      apply: () => { setOn(next); setCount((c) => c + d); },
      revert: () => { setOn(!next); setCount((c) => c - d); },
      save,
    });
  };
  return (
    <sn-enhance>
      <div class="sn-opt-row" ref={(el) => (row = el)}>
        <span class="sn-nm">雨夜车站</span>
        <button type="button" class={["sn-star", { "sn-on": on() }]} aria-pressed={String(on())} aria-label="收藏" onClick={toggle}><span data-i="star"></span><span class="sn-n">{count()}</span></button>
      </div>
    </sn-enhance>
  );
}
