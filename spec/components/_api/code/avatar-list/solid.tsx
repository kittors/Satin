import { For } from "solid-js";

const PEOPLE = [
  { name: "何慧", role: "前端开发", online: true },
  { name: "黄磊", role: "产品设计", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128&q=80" },
  { name: "徐丽", role: "财务顾问" },
];

export default function Members() {
  return (
    <div class="sn-set-list">
      <For each={PEOPLE}>{(p) => (
        <div class="sn-set-row">
          <sn-avatar name={p.name} src={p.src} status={p.online ? "online" : undefined} decorative=""></sn-avatar>
          <div class="sn-tx"><b>{p.name}</b><span>{p.role}</span></div>
        </div>
      )}</For>
    </div>
  );
}
