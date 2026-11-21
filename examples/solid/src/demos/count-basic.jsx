import { onSettled } from "solid-js";
import { createCount } from "satin-ui";

export default function ShotTitle() {
  let host;
  // 写到 90% 变成提醒色，写满再敲时计数抖一下；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createCount(host, { max: 20, placeholder: "一句话说清这个镜头", id: "shot-title", size: "lg" });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
