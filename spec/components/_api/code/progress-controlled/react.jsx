import { useEffect, useState } from "react";
import { Button, Progress } from "satin-ui/react";

export default function ExportProgress() {
  const [p, setP] = useState(0), [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setP((x) => Math.min(1, x + 0.1)), 300);
    return () => clearInterval(t);
  }, [running]);
  useEffect(() => { if (p >= 1) setRunning(false); }, [p]);
  const toggle = () => { setP(0); setRunning(!running); };
  return (
    <div className="sn-stack sn-gap-8" style={{ maxWidth: 420 }}>
      <Progress value={p} label="导出进度" />
      <div className="sn-row">
        <span className="sn-help sn-num">{p >= 1 ? "已导出" : running ? `已导出 ${Math.round(p * 100)}%` : "还没开始"}</span>
        <Button size="sm" onClick={toggle}>{running ? "取消" : p >= 1 ? "再导一次" : "开始导出"}</Button>
      </div>
    </div>
  );
}
