<script>
  import { buttonHTML, checkHTML, switchHTML, progressHTML, stepsHTML, chipHTML } from "satin-ui/components";
  import { SINK as S } from "../../shared/sink.js";
  // 自定义元素的属性：数组、对象写成 JSON
  const j = (v) => JSON.stringify(v);
  let view = $state(S.segmented.value);
</script>

<main class="sink">
  <h1>{S.title}</h1>
  <div class="line">{@html S.buttons.map(([v, t]) => buttonHTML({ text: t, variant: v })).join("") + buttonHTML({ variant: "ghost", icon: S.iconButton.icon, tip: S.iconButton.tip })}</div>
  <div class="sn-field"><label class="sn-lbl" for="f-title">{S.field.label}</label><input class="sn-input" type="text" id="f-title" placeholder={S.field.placeholder}><div class="sn-help">{S.field.help}</div></div>
  <div class="line">{@html checkHTML(S.check) + switchHTML(S.switch)}</div>
  <div class="line"><sn-segmented items={j(S.segmented.items)} value={view} onsn-change={(e) => (view = e.detail)}></sn-segmented></div>
  <div class="sn-field"><span class="sn-lbl">{S.slider.label}</span><sn-slider value={S.slider.value} max={S.slider.max} label={S.slider.label}></sn-slider></div>
  <div class="sn-field"><span class="sn-lbl">{S.select.label}</span><sn-select items={j(S.select.items)} value={S.select.value}></sn-select></div>
  <sn-tabs tabs={j(S.tabs.tabs)} value={S.tabs.value}></sn-tabs>
  <div class="line">{@html progressHTML({ value: S.progress }) + progressHTML({ value: S.progress, ring: true })}</div>
  {@html stepsHTML(S.steps)}
  <sn-collapse items={j(S.collapse.items)} open={j(S.collapse.open)}></sn-collapse>
  <div class="sn-field"><span class="sn-lbl">{S.stepper.label}</span><sn-stepper value={S.stepper.value} min={S.stepper.min} max={S.stepper.max} unit={S.stepper.unit} label={S.stepper.label}></sn-stepper></div>
  <div class="line">{@html S.chips.map((t) => chipHTML({ text: t })).join("")}</div>
</main>
