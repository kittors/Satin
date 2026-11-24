import { useState } from "react";
import { Chip } from "satin-ui/react";

const STATUS = ["进行中", "已完成", "失败", "已归档"];

export default function StatusFilter() {
  const [picked, setPicked] = useState(["进行中"]);
  const toggle = (s: string, on: boolean) => setPicked((p) => (on ? [...p, s] : p.filter((x) => x !== s)));
  return (
    <div className="sn-row">
      {STATUS.map((s) => (
        <Chip key={s} selected={picked.includes(s)} onChange={(on) => toggle(s, on)}>{s}</Chip>
      ))}
    </div>
  );
}
