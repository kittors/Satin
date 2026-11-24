import { useState } from "react";
import { Checkbox } from "satin-ui/react";

const SHOTS = ["开场", "车站", "雨夜"];

export default function PickShots() {
  const [picked, setPicked] = useState(["开场"]);
  const all = picked.length === SHOTS.length;
  const toggle = (s: string, on: boolean) => setPicked(on ? [...picked, s] : picked.filter((x) => x !== s));
  return (
    <div class="sn-stack sn-gap-8">
      <Checkbox label="全选" checked={all} indeterminate={picked.length > 0 && !all} onChange={(e) => setPicked(e.target.checked ? SHOTS : [])} />
      {SHOTS.map((s) => (
        <Checkbox key={s} label={s} checked={picked.includes(s)} onChange={(e) => toggle(s, e.target.checked)} />
      ))}
    </div>
  );
}
