import { onSettled } from "solid-js";
import { createCount } from "satin-ui";

export default function RoleName() {
  let host!: HTMLDivElement;
  // onChange 拿到新值；程序里改值用 update({ value })；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createCount(host, { max: 8, value: "林夏", id: "role-name", onChange: (v) => console.log("角色名：", v) });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
