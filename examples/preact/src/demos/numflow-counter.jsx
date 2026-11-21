import { useState } from "react";
import { Button, NumberFlow } from "satin-ui/react";

export default function ShotCounter() {
  const [n, setN] = useState(128);
  return (
    <div class="sn-row">
      {/* value 变了只动变了的那几位 */}
      <NumberFlow value={n} />
      <Button size="sm" onClick={() => setN(n + 1)}>+1</Button>
      <Button size="sm" onClick={() => setN(n - 12)}>-12</Button>
    </div>
  );
}
