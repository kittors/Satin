"use client";
import { useState } from "react";
import { Button, Popover, Radio } from "satin-ui/react";

const RATES = [["16:9", "16:9 横屏"], ["9:16", "9:16 竖屏"], ["1:1", "1:1 方形"]];

export default function RatePicker() {
  const [open, setOpen] = useState(false);
  const [rate, setRate] = useState("16:9");
  // 受控：open 放在这里，选了就关上（改动立即生效，不需要"保存"）
  const pick = (v) => { setRate(v); setOpen(false); };
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      title="画面比例"
      content={
        <div className="sn-stack sn-gap-8" role="radiogroup" aria-label="画面比例">
          {RATES.map(([v, label]) => (
            <Radio key={v} name="pop-rate" value={v} label={label} checked={rate === v} onChange={() => pick(v)} />
          ))}
        </div>
      }
    >
      <Button>画面比例：{rate}</Button>
    </Popover>
  );
}
