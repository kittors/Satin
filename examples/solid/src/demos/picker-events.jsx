import { createSignal } from "solid-js";

// 名字不是驼峰的原生事件用 ref 挂（Solid 2 的 onXxx 只认驼峰的事件名）
const on = (type, fn) => (el) => el.addEventListener(type, fn);

export default function DueDate() {
  const [due, setDue] = createSignal("");
  // 选好、清除时选择器上冒泡一个 pick 事件，e.detail.text 是触发框里显示的文字（清除时是空字符串）
  return (
    <sn-enhance>
      <div class="sn-stack sn-gap-8" ref={on("pick", (e) => setDue(e.detail.text))}>
        <div class="sn-field">
          <span class="sn-lbl">交付日期</span>
          <div class="sn-pk" data-pk="date">
            <button class="sn-pk-trigger" type="button" aria-haspopup="dialog"><span class="sn-val sn-ph" data-ph="选择日期">选择日期</span><span class="sn-end sn-swap"><span class="sn-a" data-i="calendar"></span><span class="sn-b" data-i="x" role="button" aria-label="清除"></span></span></button>
            <div class="sn-pk-panel" role="dialog" aria-label="选择日期"><div class="sn-cal-slot"></div><div class="sn-pk-foot"><button class="sn-btn sn-ghost sn-sm" type="button" data-today>今天</button><span class="sn-grow"></span><button class="sn-btn sn-ghost sn-sm" type="button" data-clear>清除</button></div></div>
          </div>
        </div>
        <span class="sn-help">{due() ? "交付日期：" + due() : "还没选交付日期"}</span>
      </div>
    </sn-enhance>
  );
}
