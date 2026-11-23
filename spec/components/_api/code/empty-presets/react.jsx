import { EmptyArt } from "satin-ui/react";

const PRESETS = [
  { name: "projects", title: "首次使用" },
  { name: "search", title: "筛选无结果" },
  { name: "error", title: "加载失败" },
  { name: "inbox", title: "空收件箱" },
  { name: "folder", title: "空文件夹" },
  { name: "lock", title: "暂无权限" },
];

export default function EmptyPresets() {
  return (
    <div className="sn-empty-presets">
      {PRESETS.map((p) => (
        <div className="sn-empty-preset" key={p.name}>
          <EmptyArt name={p.name} />
          <b>{p.title}</b>
          <code>{p.name}</code>
        </div>
      ))}
    </div>
  );
}
