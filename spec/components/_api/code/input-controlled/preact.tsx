import { useState } from "react";
import { Input } from "satin-ui/react";

export default function ProjectNameCount() {
  const [name, setName] = useState("雨夜车站");
  return (
    <div class="sn-stack sn-gap-8">
      <Input value={name} onChange={(e) => setName(e.target.value)} invalid={name.length > 12} aria-label="项目名称" />
      <span class="sn-help">{name.length} / 12 个字</span>
    </div>
  );
}
