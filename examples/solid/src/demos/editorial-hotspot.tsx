import { createSignal, For } from "solid-js";
import { openLightbox } from "satin-ui";

const IMG = "https://images.unsplash.com/photo-1589803196988-17b417281773?auto=format&fit=crop&w=1200&h=675&q=84";
const SPOTS = [
  { x: 24, y: 74, align: "left", side: "above", short: "冷雨反射", label: "标注 01：5200K 冷雨积水反射", title: "5200K 冷雨积水反射", desc: "浅积水承接钠灯冷白反光并压低高光饱和度，与远景 3400K 暖灯拉开冷暖纵深。" },
  { x: 54, y: 36, align: "center", side: "below", short: "视线引导", label: "标注 02：纵深电车视线引导", title: "纵深电车视线引导", desc: "两侧路沿与湿润车道向画面中心汇聚，车灯成为唯一暖色高光锚点。" },
  { x: 78, y: 48, align: "right", side: "below", short: "三分留白", label: "标注 03：右侧暗部三分留白", title: "右侧暗部三分留白", desc: "刻意压暗右侧建筑体块保留三分之一负空间，为片名与字幕留出纯净通道。" },
] as const;

export default function EditorialHotspot() {
  const [active, setActive] = createSignal<number | null>(0);
  const cur = () => SPOTS[active() ?? 0];
  const next = () => setActive(((active() ?? 0) + 1) % SPOTS.length);
  const openFull = () => openLightbox([{ bg: `url("${IMG}") center / cover`, ratio: 16 / 10, alt: "夜色街道与雨幕高光剖析帧" }], 0);

  return (
    <sn-enhance>
      <section class="sn-ed-inspect" aria-label="雨夜构图与布光剖析">
        <div class="sn-ed-canvas" onClick={() => setActive(null)}>
          <img src={IMG} alt="夜色街道与雨幕高光剖析帧" decoding="async" />
          <button type="button" class="sn-ed-canvas-zoom" data-i="maximize-2" data-tip="全屏查看剖析帧" aria-label="全屏查看剖析帧" onClick={(e) => { e.stopPropagation(); openFull(); }}></button>
          <For each={SPOTS}>
            {(s, i) => (
              <button type="button" class={["sn-ed-pin", { "sn-on": active() === i() }]} style={{ "--sn-x": `${s.x}%`, "--sn-y": `${s.y}%` }} aria-label={s.label} aria-pressed={active() === i()} onClick={(e) => { e.stopPropagation(); setActive(i()); }}></button>
            )}
          </For>
          <div class={["sn-ed-pop", { "sn-ed-hidden": active() === null }]} style={{ "--sn-px": `${cur().x}%`, "--sn-py": `${cur().y}%` }} data-align={cur().align} data-side={cur().side === "below" ? "below" : undefined} role="region" aria-live="polite" onClick={(e) => e.stopPropagation()}>
            <div class="sn-ed-pop-hd">
              <span class="sn-ed-pop-idx">{String((active() ?? 0) + 1).padStart(2, "0")} / 03</span>
              <button type="button" class="sn-ed-pop-next" onClick={next}>下一处<span data-i="arrow-right"></span></button>
            </div>
            <div class="sn-ed-pop-body"><b>{cur().title}</b><p>{cur().desc}</p></div>
          </div>
        </div>
        <div class="sn-ed-pin-bar">
          <div class="sn-ed-pin-tabs" role="tablist" aria-label="构图标注点">
            <For each={SPOTS}>
              {(s, i) => (
                <button type="button" class={["sn-ed-pin-tab", { "sn-on": active() === i() }]} role="tab" aria-selected={active() === i()} onClick={() => setActive(i())}>
                  <i>{String(i() + 1).padStart(2, "0")}</i>{s.short}
                </button>
              )}
            </For>
          </div>
          <span class="sn-ed-pin-hint">点击靶心切换，点空白收起</span>
        </div>
      </section>
    </sn-enhance>
  );
}
