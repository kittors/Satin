import { onSettled } from "solid-js";
import { createEmail } from "satin-ui";

export default function NotifyEmail() {
  let host!: HTMLDivElement;
  // 格式对了右边的对勾一笔画出来；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createEmail(host, { label: "通知邮箱", placeholder: "name@example.com", id: "notify-email" });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
