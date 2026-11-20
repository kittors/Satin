import { For } from "solid-js";
import { buttonHTML, checkHTML, switchHTML, progressHTML, stepsHTML, chipHTML } from "satin-ui/components";
import { SINK as S } from "../../shared/sink.js";
const j = (v) => JSON.stringify(v);
// 有交互的组件用 <sn-xxx> 自定义元素（Solid 2 默认按 HTML 属性写）；纯样式的组件直接写 sn- 类名（这里用标记函数生成）
export default function App() {
  return (
    <main class="sink">
      <h1>{S.title}</h1>
      <div class="line" innerHTML={S.buttons.map(([v, t]) => buttonHTML({ text: t, variant: v })).join("") + buttonHTML({ variant: "ghost", icon: S.iconButton.icon, tip: S.iconButton.tip })} />
      <div class="sn-field"><label class="sn-lbl" for="f-title">{S.field.label}</label><input class="sn-input" type="text" id="f-title" placeholder={S.field.placeholder} /><div class="sn-help">{S.field.help}</div></div>
      <div class="line" innerHTML={checkHTML(S.check) + switchHTML(S.switch)} />
      <div class="line"><sn-segmented items={j(S.segmented.items)} value={S.segmented.value} /></div>
      <div class="sn-field"><span class="sn-lbl">{S.slider.label}</span><sn-slider value={S.slider.value} max={S.slider.max} label={S.slider.label} /></div>
      <div class="sn-field"><span class="sn-lbl">{S.select.label}</span><sn-select items={j(S.select.items)} value={S.select.value} /></div>
      <sn-tabs tabs={j(S.tabs.tabs)} value={S.tabs.value} />
      <div class="line" innerHTML={progressHTML({ value: S.progress }) + progressHTML({ value: S.progress, ring: true })} />
      <div innerHTML={stepsHTML(S.steps)} style={{ display: "contents" }} />
      <sn-collapse items={j(S.collapse.items)} open={j(S.collapse.open)} />
      <div class="sn-field"><span class="sn-lbl">{S.stepper.label}</span><sn-stepper value={S.stepper.value} min={S.stepper.min} max={S.stepper.max} unit={S.stepper.unit} label={S.stepper.label} /></div>
      <div class="line"><For each={S.chips}>{(t) => <span class="sn-chip">{t}</span>}</For></div>
    </main>
  );
}
