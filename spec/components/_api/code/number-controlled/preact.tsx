import { useState } from "react";
import { Stepper } from "satin-ui/react";

export default function EpisodeCount() {
  const [value, setValue] = useState(3);
  return (
    <div class="sn-stack sn-gap-8">
      <Stepper min={1} max={12} unit="集" label="集数" value={value} onChange={setValue} />
      <span class="sn-help">预计生成 {value * 24} 个镜头</span>
    </div>
  );
}
