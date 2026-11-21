import { useState } from "react";
import { Button, Steps } from "satin-ui/react";

const STEPS = ["导入原文", "拆分章节", "生成分镜", "配音"];

export default function MakeSteps() {
  const [cur, setCur] = useState(1);
  return (
    <div class="sn-stack sn-gap-12">
      <Steps steps={STEPS} current={cur} />
      <div class="sn-row">
        <Button size="sm" disabled={cur === 0} onClick={() => setCur(cur - 1)}>上一步</Button>
        <Button size="sm" variant="primary" disabled={cur === STEPS.length - 1} onClick={() => setCur(cur + 1)}>下一步</Button>
      </div>
    </div>
  );
}
