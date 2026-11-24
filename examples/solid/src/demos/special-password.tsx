import { onSettled } from "solid-js";
import { createPassword } from "satin-ui";

export default function NewPassword() {
  let host!: HTMLDivElement;
  // meter：强度条依次点亮；大写锁定打开时下面展开提示；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createPassword(host, { label: "设置密码", placeholder: "至少 8 位，字母加数字更安全", meter: true, id: "new-pw" });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
