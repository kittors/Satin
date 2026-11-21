import { onSettled } from "solid-js";
import { createLongText } from "satin-ui";

export default function ShotDescription() {
  let host;
  // 随内容长高、用量环；⌘↵ 调 onSubmit；挂上以后建，卸载时 destroy()
  onSettled(() => {
    const it = createLongText(host, {
      max: 120,
      maxLines: 7,
      placeholder: "写清楚人物、动作和光线，生成会更准。可以一直往下写，框会跟着长高。",
      label: "画面描述",
      onSubmit: (text) => console.log("保存：", text),
    });
    return () => it.destroy();
  });
  return <div ref={(el) => (host = el)}></div>;
}
