import { useState } from "react";
import { Slider } from "satin-ui/react";

export default function OpacitySlider() {
  const [value, setValue] = useState(72);
  return (
    <div className="sn-stack sn-gap-8">
      <Slider max={100} label="不透明度" value={value} onChange={setValue} />
      <span className="sn-help">不透明度 {value}%</span>
    </div>
  );
}
