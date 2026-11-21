import { useState } from "react";
import { Button, CountInput } from "satin-ui/react";

export default function RoleName() {
  // 受控：value + onChange；父组件改值，计数跟着滚
  const [name, setName] = useState("林夏");
  return (
    <div class="sn-row">
      <CountInput max={8} value={name} onChange={setName} id="role-name" />
      <Button size="sm" onClick={() => setName("林夏和周屿")}>换一个</Button>
    </div>
  );
}
