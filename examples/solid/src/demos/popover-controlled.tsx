import { createSignal, For } from "solid-js";
import { popoverOf } from "satin-ui";

const RATES = [["16:9", "16:9 横屏"], ["9:16", "9:16 竖屏"], ["1:1", "1:1 方形"]];

// <sn-enhance> 接上 data-pop 触发按钮；改动立即生效、不需要"保存"：选了就把面板关上
export default function RatePicker() {
  const [rate, setRate] = createSignal("16:9");
  let pop!: HTMLDivElement;
  const pick = (v: string) => { setRate(v); popoverOf(pop)?.close(); };
  return (
    <sn-enhance>
      <button type="button" class="sn-btn sn-secondary" data-pop="pop-rate" aria-haspopup="dialog" aria-expanded="false">画面比例：{rate()}</button>
      <div ref={pop} class="sn-pop sn-popover" id="pop-rate" role="dialog" aria-label="画面比例">
        <h4>画面比例</h4>
        <div class="sn-stack sn-gap-8" role="radiogroup" aria-label="画面比例">
          <For each={RATES}>{([v, label]) => <label class="sn-radio"><input type="radio" name="pop-rate" value={v} checked={rate() === v} onChange={() => pick(v)} /><span class="sn-box"></span>{label}</label>}</For>
        </div>
      </div>
    </sn-enhance>
  );
}
