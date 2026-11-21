import { createSignal } from "solid-js";

export default function ProjectNameCount() {
  const [name, setName] = createSignal("雨夜车站");
  return (
    <div class="sn-stack sn-gap-8">
      <input class="sn-input" value={name()} onInput={(e) => setName(e.currentTarget.value)} aria-invalid={name().length > 12 ? "true" : undefined} aria-label="项目名称" />
      <span class="sn-help">{name().length} / 12 个字</span>
    </div>
  );
}
