import { useState } from "react";
import { Button, Field, Input, Checkbox, Switch, Segmented, Slider, Select, Tabs, Progress, Steps, Collapse, Stepper, Chip } from "satin-ui/react";
import { SINK as S } from "../../shared/sink.js";

export default function App() {
  const [view, setView] = useState(S.segmented.value), [level, setLevel] = useState(S.slider.value), [ratio, setRatio] = useState(S.select.value);
  return (
    <main className="sink">
      <h1>{S.title}</h1>
      <div className="line">
        {S.buttons.map(([v, t]) => <Button key={v} variant={v}>{t}</Button>)}
        <Button variant="ghost" icon={S.iconButton.icon} tip={S.iconButton.tip} />
      </div>
      <Field label={S.field.label} htmlFor="f-title" help={S.field.help}><Input id="f-title" placeholder={S.field.placeholder} /></Field>
      <div className="line">
        <Checkbox label={S.check.label} defaultChecked={S.check.checked} />
        <Switch label={S.switch.label} defaultChecked={S.switch.checked} />
      </div>
      <div className="line"><Segmented items={S.segmented.items} value={view} onChange={setView} /></div>
      <div className="sn-field"><span className="sn-lbl">{S.slider.label}</span><Slider value={level} max={S.slider.max} label={S.slider.label} onChange={setLevel} /></div>
      <div className="sn-field"><span className="sn-lbl">{S.select.label}</span><Select items={S.select.items} value={ratio} onChange={setRatio} /></div>
      <Tabs tabs={S.tabs.tabs} defaultValue={S.tabs.value} />
      <div className="line"><Progress value={S.progress} /><Progress value={S.progress} ring /></div>
      <Steps steps={S.steps.steps} current={S.steps.current} />
      <Collapse items={S.collapse.items} open={S.collapse.open} />
      <div className="sn-field"><span className="sn-lbl">{S.stepper.label}</span><Stepper defaultValue={S.stepper.value} min={S.stepper.min} max={S.stepper.max} unit={S.stepper.unit} label={S.stepper.label} /></div>
      <div className="line">{S.chips.map((t) => <Chip key={t}>{t}</Chip>)}</div>
    </main>
  );
}
