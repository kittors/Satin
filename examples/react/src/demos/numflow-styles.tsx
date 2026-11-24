import { useState } from "react";
import { Button, NumberFlow } from "satin-ui/react";

export default function NumberEffect() {
  const [n, setN] = useState(2026);
  return (
    <div className="sn-row">
      {/* value 变了只动变了的那几位；effect 换变化的样子：roll 滚动（默认）/ blur 模糊 / push 推入 / fade 淡入 */}
      <NumberFlow value={n} effect="blur" />
      <Button size="sm" onClick={() => setN(n + 137)}>+137</Button>
    </div>
  );
}
