import { createSignal } from "solid-js";
import { optimistic } from "satin-ui";

// 演示用的保存：700ms 后返回，每第二次失败（模拟网络断了）；换成真实的请求
let n = 0;
const save = () => new Promise<void>((ok, fail) => setTimeout(() => (++n % 2 ? ok() : fail(new Error("网络断了"))), 700));

export default function AutosaveSetting() {
  const [on, setOn] = createSignal(false);
  let row!: HTMLDivElement;
  const change = (e: Event) => {
    const next = (e.currentTarget as HTMLInputElement).checked;
    // 开关已经拨过去了，apply 只是把数据对上；保存失败：拨回去、这一行抖两下、给"重试"
    optimistic({ shake: row, apply: () => setOn(next), revert: () => setOn(!next), save });
  };
  return (
    <div class="sn-opt-row" ref={(el) => (row = el)}>
      <label class="sn-switch"><input type="checkbox" role="switch" checked={on()} onChange={change} /><span class="sn-track"><span class="sn-knob"></span></span>自动保存草稿</label>
    </div>
  );
}
