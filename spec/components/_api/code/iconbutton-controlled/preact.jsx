import { useState } from "react";
import { Button } from "satin-ui/react";

export default function GridToggle() {
  const [on, setOn] = useState(true);
  return (
    <div class="sn-row">
      <Button variant="ghost" icon="layout-grid" selected={on} aria-pressed={on} tip={on ? "网格（已打开）" : "网格（已关上）"} onClick={() => setOn(!on)} />
    </div>
  );
}
